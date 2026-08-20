# SQL Temelleri

## Veritabanı nedir?
Bir veritabanı, verinin düzenli şekilde saklandığı sistemdir. Web
uygulamalarının neredeyse tamamı arka planda bir veritabanı kullanır:
kullanıcı hesapları, ürünler, yorumlar, siparişler — hepsi tablolarda
tutulur.

En yaygın tür **ilişkisel veritabanı** (relational database) — MySQL,
PostgreSQL, Microsoft SQL Server, Oracle gibi. Veriler tablolar halinde
saklanır.

## Tablo, satır, sütun
Bir tabloyu Excel sayfası gibi düşünebilirsin. Örnek bir `users` tablosu:

| id | username | password  | email           |
|----|----------|-----------|-----------------|
| 1  | admin    | s3cr3t123 | admin@site.com  |
| 2  | alice    | alice2024 | alice@site.com  |

- Her **satır (row)** bir kayıt — burada bir kullanıcı
- Her **sütun (column)** bir alan — id, username, password, email
- Bu kayıtlar `users` adında bir **tabloda** tutuluyor

## SELECT — veri çekmek
En temel SQL komutu SELECT'tir. "Şu tablodan, şu sütunları getir" der.

```sql
SELECT username, email FROM users;
```
Bu sorgu, `users` tablosundaki tüm satırların `username` ve `email`
sütunlarını getirir.

Tüm sütunları getirmek için `*` kullanılır:
```sql
SELECT * FROM users;
```

## WHERE — şart koymak
Belirli satır(lar)ı filtrelemek için WHERE kullanılır:
```sql
SELECT * FROM users WHERE username = 'admin';
```
Bu sorgu sadece `username` değeri `admin` olan satırı getirir.

**Dikkat:** `'admin'` — metin (string) değerler tek tırnak içine alınır.
Sayısal değerler tırnak istemez: `WHERE id = 1`.

## AND / OR — birden fazla şart
```sql
SELECT * FROM users WHERE username = 'admin' AND password = 's3cr3t123';
```
Bu, gerçek bir login sorgusunun temelidir — birazdan bunun SQL injection
ile nasıl kırıldığını göreceğiz (`01-sql-injection-nedir.md`).

## Tek tırnak neden bu kadar önemli?
SQL, metni tek tırnakla sınırlandırır çünkü aksi halde motor, metnin
nerede bittiğini bilemez. Bu sınırlama mekanizması SQL injection'ın
**tüm temelidir**: eğer bir uygulama, kullanıcının girdiği metni
doğrulamadan bu tırnakların arasına koyarsa, kullanıcı kendi tırnağını
erken kapatıp sorgunun geri kalanını yeniden yazabilir.

## Yorum satırları
- `-- ` (iki tire + boşluk) — satırın geri kalanını yok sayar (MySQL'de
  boşluk şart)
- `#` — satırın geri kalanını yok sayar (sadece MySQL)
- `/* ... */` — blok yorum, birden fazla satırı kapsayabilir

Bunlar SQL injection'da sıkça kullanılır: saldırgan sorgunun geri
kalanını "susturmak" için yorum satırına çevirir.

## UNION — iki sorguyu birleştirmek
```sql
SELECT username FROM users
UNION
SELECT product_name FROM products;
```
Bu, iki ayrı SELECT'in sonuçlarını tek bir sonuç listesinde birleştirir.
**Şartı:** iki sorgunun sütun sayısı ve veri tipleri uyumlu olmalı.
UNION, ileride "UNION-based SQL injection" konusunun temelini
oluşturacak — saldırgan, kendi seçtiği veriyi (parola tablosu gibi)
orijinal sorgunun sonuçlarına bu şekilde ekler.
