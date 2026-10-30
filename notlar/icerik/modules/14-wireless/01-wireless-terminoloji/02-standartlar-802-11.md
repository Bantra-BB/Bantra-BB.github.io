# 802.11 Standartları

## 802.11 nedir?
**IEEE 802.11**, kablosuz yerel ağların (WLAN) kurallarını belirleyen standartlar ailesidir. Wi-Fi dediğimiz şey, bu standartların ticari adıdır. Zaman içinde her yeni sürüm daha yüksek hız, daha iyi menzil ve daha fazla cihaz desteği getirdi; sürümler sondaki harflerle ayrılır (a/b/g/n/ac/ax). Wi-Fi Alliance son yıllarda bunları sadeleştirip "Wi-Fi 4, 5, 6..." şeklinde de adlandırmaya başladı.

## Sürümler — karşılaştırmalı tablo

| Standart | Pazar adı | Yıl | Bant | Maks. teorik hız | Modülasyon |
|---|---|---|---|---|---|
| 802.11 (ilk) | — | 1997 | 2.4 GHz | 2 Mbps | DSSS / FHSS |
| **802.11a** | — | 1999 | 5 GHz | 54 Mbps | OFDM |
| **802.11b** | — | 1999 | 2.4 GHz | 11 Mbps | DSSS / CCK |
| **802.11g** | — | 2003 | 2.4 GHz | 54 Mbps | OFDM |
| **802.11n** | Wi-Fi 4 | 2009 | 2.4 + 5 GHz | 600 Mbps | MIMO-OFDM |
| **802.11ac** | Wi-Fi 5 | 2013 | 5 GHz | ~3.5 Gbps+ | MU-MIMO, OFDM |
| **802.11ax** | Wi-Fi 6 / 6E | 2019-21 | 2.4 + 5 (+6) GHz | ~9.6 Gbps | OFDMA, MU-MIMO |
| **802.11be** | Wi-Fi 7 | 2024 | 2.4 + 5 + 6 GHz | ~46 Gbps | OFDMA, geniş kanal |

> Buradaki hızlar **teorik tavan** değerleridir. Gerçek hız; mesafe, parazit, anten sayısı ve kanal genişliğine göre çok daha düşük olur.

## Sürümlerin kısa hikâyesi
- **802.11a vs b:** İkisi aynı yıl çıktı ama farklı yolları seçti. `a` hızlı ama kısa menzilli 5 GHz'i, `b` yavaş ama uzun menzilli 2.4 GHz'i kullandı. `a`, OFDM ile 54 Mbps'e çıktı; `b`, DSSS ile 11 Mbps'te kaldı. Uzun süre `b` daha yaygın oldu çünkü menzili ve maliyeti ev kullanıcısına uygundu.
- **802.11g:** `a`'nın hızını (OFDM, 54 Mbps) `b`'nin bandına (2.4 GHz) taşıdı ve `b` ile geriye uyumlu kaldı. Bu yüzden hızla yaygınlaştı.
- **802.11n (Wi-Fi 4):** Oyunu değiştiren sürüm. **MIMO** (çok anten) ve **channel bonding** (kanalları birleştirerek genişletme) ile hızı katladı. İki bantta da (2.4 + 5 GHz) çalışabilen ilk yaygın standart.
- **802.11ac (Wi-Fi 5):** Sadece 5 GHz. **MU-MIMO**, daha geniş kanallar (80/160 MHz) ve daha yoğun modülasyon ile gigabit seviyesine çıktı.
- **802.11ax (Wi-Fi 6/6E):** Amaç ham hızdan çok **kalabalık ortamda verim**. **OFDMA** ile aynı anda çok kullanıcıya hizmet, **6 GHz** bandının açılması (6E) ve pil tasarrufu (TWT) getirdi.
- **802.11be (Wi-Fi 7):** Daha geniş kanallar (320 MHz) ve **MLO (Multi-Link Operation)** — bir cihazın aynı anda birden fazla bantta bağlanması.

## Modülasyonla bağlantısı
Bu tablo, bir önceki bölümle (`01-anten-ve-sinyal.md`) birebir örtüşür — standartları modülasyonlarıyla eşleştirmek akılda tutmaya değer:

- İlk 802.11 → **DSSS / FHSS**
- 802.11b → **DSSS (yüksek hızda CCK)**
- 802.11a / g → **OFDM**
- 802.11n / ac → **MIMO-OFDM** (ac'de MU-MIMO)
- 802.11ax → **OFDMA** (OFDM'in çok kullanıcılı hali)

## Güvenlikle ilişkisi
Standardın **sürümü** ile ağın **güvenliği** farklı şeylerdir, karıştırma: 802.11 sürümü hızı ve fiziksel iletimi belirler; şifrelemeyi (WEP / WPA / WPA2 / WPA3) ayrı bir katman tanımlar. Yani 802.11ax (çok yeni ve hızlı) bir ağ, hâlâ eski ve kırık WEP ile korunuyor olabilir. Şifreleme ve kimlik doğrulama standartlarını `02-wifi-auth-encryption` bölümünde ayrı ele alacağız.

Bir ayrıntı pratikte işine yarar: bir AP'nin beacon çerçevesi hangi standartları ve hızları desteklediğini açıkça duyurur. `airodump-ng` gibi araçlar bu bilgiyi okuyup sana ağın sürümünü ve şifreleme tipini gösterir — keşif (reconnaissance) aşamasının ilk verisi budur.

## Özet
- 802.11 ailesi: **a/b/g/n/ac/ax/be** → Wi-Fi 4/5/6/7.
- Kabaca: `a/g` OFDM'i getirdi, `n` MIMO'yu, `ac` MU-MIMO + 5 GHz'i, `ax` OFDMA + 6 GHz'i.
- **Sürüm = hız/iletim**, **şifreleme = ayrı katman** — biri yeni diye diğeri güvenli olmak zorunda değil.
