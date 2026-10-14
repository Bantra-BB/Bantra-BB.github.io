# Kerberoasting — Tespit ve Savunma

> Saldırının nasıl yapıldığı için: [Saldırı adımları](01-Saldiri-Adimlari.md)

---

## Tespit

- **Event ID 4769** (Kerberos service ticket requested) izlenir. Tek bir hesaptan **kısa sürede çok sayıda 4769** olayı, özellikle **RC4 (0x17)** şifreleme tipiyle birlikte, güçlü bir Kerberoasting işaretidir.
- **Honeypot / canary SPN:** kimsenin kullanmadığı sahte bir servis hesabına SPN atanır. Bu hesaba gelen herhangi bir bilet talebi neredeyse kesinlikle kötü niyetlidir — çünkü meşru hiçbir istemcinin onu istemesi için sebep yoktur.

---

## Savunma

- **Uzun, rastgele parola:** servis hesaplarına 25+ karakter rastgele parola ver. Offline kırmayı pratikte imkânsız hale getirir.
- **gMSA (Group Managed Service Accounts):** parolası otomatik yönetilen, ~120 karakterlik ve periyodik değişen hesaplar. Kerberoasting'i etkisiz bırakan en güçlü önlem.
- **RC4'ü devre dışı bırak, AES zorla:** zayıf ve hızlı kırılan RC4 biletlerini ortadan kaldırır.
- **Least privilege:** servis hesaplarına asla gereğinden fazla yetki (özellikle Domain Admin) verme — kırılsa bile etkisi sınırlı kalır.

---

## Sınav Notu (CEH v13)

- Kerberoasting için **pre-authentication kapalı olması gerekmez** → bu, onu **AS-REP Roasting'ten** ayıran temel farktır (AS-REP roasting, pre-auth'u kapalı hesapları hedefler).
- Talep edilen biletin şifrelendiği anahtar = **servis hesabının parola hash'i**. (`krbtgt` hash'iyle sahte bilet üretmek **Golden Ticket**'tır — karıştırma.)
- İzlenecek olay: **Event ID 4769**.
- "En etkili savunma" sorusunun cevabı genelde: **gMSA** ve **güçlü servis hesabı parolası**.
- Saldırı için gereken: domain'de **herhangi bir geçerli kullanıcı** (özel yetki değil).
