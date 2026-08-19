# SQL Temelleri

> Örnek not. Kendi notlarını `notlar/icerik/` altına aynı klasör mantığıyla ekleyebilirsin.

SQL injection'ı anlamadan önce sorguların nasıl çalıştığını bilmek gerekir.

## Temel Sorgu

```sql
SELECT kullanici_adi, email FROM kullanicilar WHERE id = 1;
```

## Neden Zafiyet Oluşur?

Kullanıcıdan gelen veri, sorguya doğrudan eklendiğinde saldırgan sorgunun
mantığını değiştirebilir.

```sql
-- kullanıcı girdisi: 1 OR 1=1
SELECT * FROM kullanicilar WHERE id = 1 OR 1=1;
```

Bu sorgu tüm kullanıcıları döndürür.

## Korunma

- Hazır ifadeler (prepared statements) kullan
- Girdi doğrulaması yap
- En az yetki prensibini uygula
