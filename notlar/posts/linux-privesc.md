# Linux Privilege Escalation

> Örnek not. Kendi notunu yazarken bu dosyayı kopyalayıp değiştir.

Yetki yükseltme sırasında sistematik bir kontrol listesi izlemek zaman kazandırır.

## İlk Bilgi Toplama

```bash
id
whoami
uname -a
sudo -l
```

## Sık Kontrol Edilen Yerler

- **SUID binary'ler:** izinleri yanlış ayarlanmış çalıştırılabilirler
- **Cron job'lar:** yazılabilir script'ler
- **Yazılabilir /etc/passwd:** kritik bir yanlış yapılandırma

SUID dosyaları bulmak için:

```bash
find / -perm -4000 -type f 2>/dev/null
```

## Faydalı Kaynaklar

- GTFOBins — istismar edilebilir binary referansı
- LinPEAS — otomatik enumeration aracı

## Not

Gerçek bir hedefte çalışırken yalnızca **yetkili** olduğun sistemlerde test yap.
