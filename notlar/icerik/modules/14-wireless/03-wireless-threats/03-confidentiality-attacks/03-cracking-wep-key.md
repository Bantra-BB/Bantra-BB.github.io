# Cracking WEP Key

## Nedir?
WEP key cracking, saldırganın yeterince şifreli trafik (özellikle **IV** içeren paket) topladıktan sonra, istatistiksel saldırılarla **WEP anahtarını kurtarmasıdır.** Anahtar ele geçince ağın tüm trafiği çözülebilir — bu yüzden saldırı, gizlilik kategorisinin en klasik örneğidir. WEP, tam olarak bu yüzden onlarca yıldır "kırık" kabul edilir.

## Neden WEP kırılabilir?
WEP'in çöküşü birkaç tasarım hatasının birleşimidir (detay: `02-wifi-auth-encryption/01-encryption-wep.md`):
- **Kısa IV (24 bit):** IV'ler kısa sürede tükenip tekrar eder; aynı IV, aynı keystream demektir.
- **IV'nin açık taşınması:** Saldırgan her paketin IV'sini doğrudan görür.
- **RC4'ün zayıf anahtar zafiyetleri:** Belirli IV'ler, anahtar hakkında istatistiksel ipucu sızdırır (FMS saldırısının temeli). Sonraki **PTW** yöntemi, çok daha az IV ile anahtarı çıkarabilir.

Bu üçü birleşince, yeterli IV toplandığında anahtar istatistiksel olarak çözülür.

## Nasıl çalışır?
Tipik akış Aircrack-ng suite ile şöyledir:

1. Kartı monitor moda al ve hedef ağı izlemeye başla:
```bash
airmon-ng start wlan0
airodump-ng --bssid <AP_BSSID> --channel <N> -w capture wlan0mon
```
2. Yeterli IV birikmesini bekle. Trafik azsa, IV üretimini hızlandırmak için paket enjeksiyonu (ör. yakalanan ARP'nin tekrar gönderilmesi — bkz. `02-integrity-attacks/05-data-replay.md`) kullanılır.
3. Toplanan paketlerden anahtarı kır:
```bash
aircrack-ng capture-01.cap
```

IV sayısı eşiğe ulaştığında araç anahtarı çıkarır.

## Diğer saldırılardan farkı
Eavesdropping trafiği yakalar ama şifreliyse okuyamaz; WEP cracking ise bu yakalanan trafiği **anahtarı kırarak okunabilir hale getirir** — yani eavesdropping'in şifreli WEP ağındaki doğal devamıdır. IV replay (integrity kategorisinde) ile yakın akrabadır: IV replay/enjeksiyon, bu kırma işleminin IV toplama adımını hızlandırmak için kullanılır. Fark, buradaki nihai hedefin **anahtarın tamamını kurtarıp gizliliği kırmak** olmasıdır.

## Savunma
- **WEP'i tamamen bırakmak** — başka çözüm yok. WEP düzeltilebilir bir protokol değildir.
- **WPA2 (CCMP/AES)** veya tercihen **WPA3** kullanmak; güçlü, uzun bir PSK ya da kurumsal ortamda 802.1X.

> **Ayırt etmek için:** Hedef, yeterli IV toplayıp istatistiksel saldırıyla **WEP anahtarının tamamını kurtarmak** ise konu WEP cracking'dir.
