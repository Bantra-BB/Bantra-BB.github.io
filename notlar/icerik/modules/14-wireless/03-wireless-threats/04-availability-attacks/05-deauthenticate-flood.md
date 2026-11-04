# De-authenticate Flood

## Nedir?
Deauthenticate flood (deauth saldırısı), saldırganın sahte **deauthentication** çerçevelerini sel halinde göndererek istemcileri AP'den sürekli koparmasıdır. Kablosuz dünyanın **en yaygın ve en bilinen DoS saldırısıdır** — basit, etkili ve pek çok başka saldırının (handshake yakalama, evil twin'e yönlendirme) hazırlık adımıdır.

## Hedeflediği zafiyet
Disassociation'daki ile aynı temel kusur: klasik 802.11'de **deauthentication çerçeveleri şifrelenmez ve doğrulanmaz.** Deauth, normalde bir bağlantıyı meşru şekilde sonlandırmak için vardır; ama kaynağı doğrulanmadığı için saldırgan, AP veya istemci adına sahte deauth üretip bağlantıyı zorla düşürebilir. Alıcı çerçeveyi geçerli sayar ve ağdan çıkar.

## Nasıl çalışır?
1. Saldırgan hedef AP'nin BSSID'sini ve (hedefliyse) kurban istemcinin MAC'ini öğrenir.
2. Bu adresleri kullanan sahte deauth çerçeveleri üretir ve sürekli gönderir.
3. İstemci düşer; flood devam ettiği sürece her yeniden bağlanma denemesi de kesilir — pratikte kalıcı kesinti.

Aircrack-ng ile tipik komut:
```bash
aireplay-ng --deauth 0 -a <AP_BSSID> -c <CLIENT_MAC> wlan0mon
```
`--deauth 0` sürekli gönderim demektir; `-c` verilmezse tüm istemcilere (broadcast) gönderilir.

## Sadece DoS değil — bir "araç"
Deauth flood çoğu zaman amaç değil, **araçtır:**
- **WPA/WPA2 handshake yakalama:** İstemci deauth ile düşürülür; yeniden bağlanırken 4-way handshake havaya çıkar ve saldırgan onu yakalayıp offline kırmaya götürür (bkz. `05-authentication-attacks/01-psk-cracking.md`).
- **Evil twin'e yönlendirme:** Kurban gerçek AP'den koparılır, daha güçlü sinyalli sahte AP'ye bağlanması sağlanır (bkz. `03-confidentiality-attacks/04-evil-twin-ap.md`).

## Diğer flood'lardan farkı
Authenticate ve beacon flood **kaynak tüketir/karıştırır**; deauth ve disassociation ise **mevcut bağlantıları koparır.** Disassociation'dan farkı, deauth'un hem authentication hem association'ı iptal eden daha köklü bir koparma olmasıdır — bu yüzden daha sık kullanılır.

## Savunma
- **802.11w (Protected Management Frames / PMF):** Deauth/disassociation çerçevelerini koruyarak sahte olanları geçersiz kılar. Deauth flood'a karşı en etkili önlemdir; WPA3'te zorunludur, WPA2'de desteklenen yerlerde açılmalıdır.
- **WIDS/WIPS:** Anormal deauth selini tespit edip kaynağı belirlemek/engellemek.
- WPA3'e geçiş, bu klasik saldırıyı büyük ölçüde etkisizleştirir.

> **Ayırt etmek için:** Sel yapılan şey **deauthentication** çerçeveleri ve amaç istemcileri koparmak (ya da handshake yakalamak/evil twin'e yönlendirmek) ise konu deauth flood'dur.
