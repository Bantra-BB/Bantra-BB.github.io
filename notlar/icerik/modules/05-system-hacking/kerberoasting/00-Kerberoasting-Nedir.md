# Kerberoasting

Kerberoasting, bir Active Directory ortamında domain'e dahil **herhangi bir kullanıcının**, bir servis hesabına ait Kerberos biletini (TGS) talep edebilmesi ve bu biletin **servis hesabının parola hash'iyle** şifrelenmesi gerçeğinden yararlanan bir saldırıdır. Saldırgan bileti alır, ağdan koparıp **offline** olarak kırar ve servis hesabının açık parolasını ele geçirir.

Önemli olan şu: saldırının ilk aşaması tamamen **meşru** görünür — çünkü bilet istemek Kerberos'un normal işleyişidir. Saldırganın ihtiyacı olan tek şey domain'de geçerli, **düşük yetkili bir hesaptır**.

---

## Neden servis hesapları hedeflenir?

Servis hesapları (SQL Server, IIS, MSSQL, uygulama servisleri vb.) `SPN` (Service Principal Name) ile tanımlanır ve genellikle:

- **Zayıf ve nadiren değişen** parolalara sahiptir — çoğu yıllarca sabit kalır,
- Sık sık **yüksek yetkilidir** (bazen doğrudan Domain Admin),
- Parola son kullanma politikası dışında tutulur.

Bu üçlü, offline kırma için ideal hedef oluşturur: güçlü yetki + kırılabilir parola.

---

## Kerberos akışı (arka plan)

Saldırıyı anlamak için kimlik doğrulama akışını bilmek şart:

1. **AS-REQ / AS-REP** — Kullanıcı, KDC'den (Authentication Server) bir **TGT** (Ticket Granting Ticket) alır. TGT, `krbtgt` hesabının hash'iyle şifrelenir.
2. **TGS-REQ** — Kullanıcı TGT'yi sunup belirli bir **SPN** için servis bileti (TGS) ister.
3. **TGS-REP** — KDC servis biletini döner. Biletin bir kısmı **servis hesabının parola hash'iyle** şifrelenir.
4. **AP-REQ** — Kullanıcı bileti ilgili servise sunarak erişim sağlar.

> **Kritik nokta:** 3. adımda KDC, kullanıcının o servise gerçekten erişim yetkisi olup olmadığını **kontrol etmez**. Geçerli bir TGT yeterlidir. Bu yüzden herhangi bir kullanıcı, herhangi bir SPN için bilet isteyip içindeki şifreli hash'i offline kırmaya götürebilir.

---

## Şifreleme tipi — saldırının hızını belirler

Biletin `etype` (encryption type) değeri kırma hızını doğrudan etkiler:

| etype | Algoritma | Hash öneki    | Kırma hızı            |
|-------|-----------|---------------|-----------------------|
| 23    | RC4-HMAC  | `$krb5tgs$23$`| **Hızlı** (tercih edilen) |
| 17    | AES128    | `$krb5tgs$17$`| Yavaş                 |
| 18    | AES256    | `$krb5tgs$18$`| Çok yavaş             |

Saldırgan mümkünse **RC4 (etype 23)** biletini ister; çünkü offline kırması AES'e göre kat kat hızlıdır. Bazı araçlar (örn. Rubeus `/tgtdeleg`) RC4 downgrade zorlayabilir.

---

Devamı:
- [Saldırı adımları](01-Saldiri-Adimlari.md)
- [Tespit ve savunma](02-Tespit-ve-Savunma.md)
