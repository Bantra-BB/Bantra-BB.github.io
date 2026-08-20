<img width="1168" height="671" alt="{7BCB5938-E5A6-4C7D-92C7-ECBC1DF132B1}" src="https://github.com/user-attachments/assets/1d167984-3a21-47a5-9cd8-8b2b771808c9" /># SQL Injection Nedir?

## Web uygulaması ile veritabanı ilişkisi
Bir web uygulaması kullanıcıdan veri aldığında (login formu, arama
kutusu, URL parametresi), bu veriyi çoğu zaman bir SQL sorgusuna dahil
eder. Örneğin basit bir login kontrolü, arka planda (backend) şuna
benzer bir kod üretir:

```php
$username = $_POST['username'];
$password = $_POST['password'];

$query = "SELECT * FROM users WHERE username = '" . $username . "' AND password = '" . $password . "'";
```

Kullanıcı `admin` / `s3cr3t123` girdiğinde, oluşan sorgu:
```sql
SELECT * FROM users WHERE username = 'admin' AND password = 's3cr3t123'
```
Sorgu bir sonuç döndürürse (satır bulunursa), uygulama "giriş başarılı"
der.

## Sorun nerede?
Kod, kullanıcının girdiği metni doğrudan sorgunun içine **string
concatenation** (birleştirme, `.` operatörü) ile ekliyor. Uygulama,
kullanıcının ne yazdığını hiç sorgulamıyor — "bu bir isim mi, yoksa SQL
kodu mu" diye bir kontrol yok. Kullanıcı girdisi ile SQL kodu arasında
hiçbir sınır yok.

## Klasik saldırı: kimlik doğrulama bypass
Saldırgan, `username` alanına şunu yazarsa:
```
admin'--
```
Oluşan sorgu:
```sql
SELECT * FROM users WHERE username = 'admin'--' AND password = 'HERHANGİBİRŞEY'
```
Ne oldu?
1. Saldırganın girdiği tek tırnak (`'`), kodun kendi tek tırnağıyla
   eşleşti ve `username` string'ini erken kapattı
2. `--` sonrasındaki her şeyi (password kontrolü dahil) yorum satırına
   çevirdi, veritabanı motoru onu hiç okumadı
3. Sorgu artık fiilen şuna eşdeğer: `SELECT * FROM users WHERE username = 'admin'`
4. Parola hiç kontrol edilmeden, `admin` kullanıcısının satırı döner →
   giriş başarılı sayılır

## Daha da klasik: her zaman doğru yapmak
Saldırgan username alanına şunu yazarsa:
```
' OR '1'='1
```
Oluşan sorgu:
```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '...'
```
`'1'='1'` ifadesi her zaman doğrudur (true). WHERE koşulu OR ile
birleştiği için, koşulun tamamı doğru olur — tablo tüm satırları döner.
Uygulama genelde ilk satırı (çoğu zaman admin) alıp giriş yaptırır.

## Neden bu çalışıyor — özet

| Sorun | Sonuç |
|---|---|
| Girdi doğrulanmıyor | Saldırgan istediği karakteri (tek tırnak dahil) gönderebiliyor |
| String concatenation kullanılıyor | Girdi, sorgu metninin parçası haline geliyor |
| Yorum satırı desteği var | Sorgunun geri kalanı susturulabiliyor |

## SQLi Nasıl Tespit Edilir?
1. `'` gibi karakterler ile hata ve anomali kontrolü ile
2. `OR 1=1` `OR 1=2` gibi boolean ifadeler ile
3. SQL'e özgü payloadlar ile hedef sistemin döndüreceği cevapların kontrolü ile
4. Time delay sonuçlarını doğuracak SQL payloadları kullanılarak cevapta oluşacak delay gözlemlenerek
5. Bir SQL sorgusu içinde yürütüldüğünde out-of-band bir ağ etkileşimini tetiklemek üzere tasarlanmış OAST payloadları, ortaya çıkan etkileşimleri izler

## SQLi Türleri
1. Error-Based SQLi (Blind)
2. Union-Based SQLi
3. Boolean SQLi (Blind)
4. Time-Based SQLi (Blind)
5. OOB SQLi

## Asıl çözüm: parametreli sorgu (prepared statement)
```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->execute([$username, $password]);
```
Burada kullanıcı girdisi **hiçbir zaman sorgu metni olarak
yorumlanmaz** — veritabanı motoruna "bu bir değer, kod değil" diye
baştan bildirilir. Tek tırnak göndersen bile, düz bir karakter olarak
işlenir, sorgu yapısını değiştiremez. SQL injection'a karşı asıl kalıcı
savunma budur; birazdan göreceğimiz tüm enjeksiyon türleri, bu
korumanın olmadığı yerlerde çalışır.

# Labs
## Retrieving Hidden Data

Uygulamaya giriş yapıldığında bir ürün listesi ve kategoriler ile karşılaşıldı.
<img width="1464" height="1003" alt="{7D603558-877A-4522-9F56-F220749A5996}" src="images/sqli1.png" />

Herhangi bir kategorinin içine girildiğinde `category='name'` sorgusunun çalıştığı gözlemlendi.
<img width="728" height="40" alt="{CE7141F5-39ED-492B-9349-1CAE3AA4095F}" src="images/sqli2.png" />

Sorgu `'OR 1=1 -- -` payload'ı ile manipüle edildiğinde gizli olan ürünlerin de listelendiği gözlemlendi.
<img width="1340" height="1000" alt="{59469AD8-549B-4717-8008-0FB630B75194}" src="images/sqli3.png" />


## Login Bypass

Login sayfası incelendiğinde kullanıcı adı ve password girişi olduğu gözlemlendi.
<img width="817" height="395" alt="{63566B9E-CD30-455E-96BB-9725E4B6B9DB}" src="images/sqli4.png" />

`admin:admin` denemesi yapıldı ve istek incelendi.
<img width="1256" height="712" alt="image" src="images/sqli5.png" />

İstek burp ile incelendi ve `OR 1=1 -- -` payload'ı ile manipüle edildi (%20 = URL encoded space character)
<img width="1261" height="782" alt="{0F6295C0-7620-46AD-A531-0A3470C508FA}" src="images/sqli6.png" />

Manipüle edildikten sonra istek gönderildiğinde login başarılı bir şekilde bypass edildi ve administrator olarak giriş yapıldı. 
<img width="1262" height="395" alt="{6E714A2B-0C17-4F1C-B1A8-24CDA0A1E301}" src="images/sqli7.png" />

## Querying the database type and version

Category isteğine burp ile araya girildi ve sorgu `'UNION+SELECT+'abc',+'def'+#` ile manipüle edildi ve hedefe uygulamadan veri alınabilinecek sütunlar tespit edildi.
<img width="1260" height="451" alt="{A0388619-116F-4468-BF1F-D59F0F0AAF52}" src="images/sqli8.png" />

Ardından veri tabanı tipi ve versiyonunu bulmak için `'UNION+SELECT+@@version,+NULL#` payload'ı ile istek manipüle edildi ve istenilen bilgiler elde edildi.
<img width="624" height="353" alt="image" src="images/sqli9.png" />

<img width="1168" height="671" alt="{7BCB5938-E5A6-4C7D-92C7-ECBC1DF132B1}" src="images/sqli10.png" />
