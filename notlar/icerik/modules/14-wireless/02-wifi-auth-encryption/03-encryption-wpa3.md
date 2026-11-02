# WPA3

## Nedir?
WPA3, Wi-Fi Alliance'ın 2018'de duyurduğu en güncel kablosuz güvenlik protokolüdür. WPA2'nin yıllar içinde ortaya çıkan zayıflıklarını (özellikle zayıf parola + handshake yakalama ve KRACK) kapatmayı hedefler. Temel yenilik, WPA2-Personal'ın PSK el sıkışması yerine **SAE** adlı daha güçlü bir anahtar değişim yöntemini kullanmasıdır.

## En büyük değişiklik: SAE (Dragonfly)
WPA3-Personal, 4-way handshake'in PSK türevi yerine **SAE (Simultaneous Authentication of Equals)** kullanır — "Dragonfly" olarak da anılır. SAE'nin WPA2 karşısındaki belirleyici avantajları:

- **Offline sözlük saldırısına direnç:** WPA2'de saldırgan handshake'i yakalayıp çevrimdışı olarak sınırsız parola deneyebiliyordu. SAE'de el sıkışmayı yakalamak, parolayı offline denemek için işe yaramaz — her tahmin ağ ile **canlı (online)** etkileşim gerektirir, bu da kaba kuvveti pratikte durdurur. Böylece görece zayıf bir parola bile WPA2'dekinden çok daha dayanıklı olur.
- **Forward secrecy (ileri gizlilik):** Her oturum için benzersiz anahtarlar üretilir. Saldırgan bir gün parolayı ele geçirse bile, **geçmişte kaydettiği** trafiği geriye dönük çözemez. WPA2'de parola ele geçince eski kayıtlı trafik çözülebiliyordu.

## Diğer iyileştirmeler
- **Protected Management Frames (PMF / 802.11w) zorunlu:** Yönetim çerçeveleri (deauth/disassociation dahil) korunur. Bu, WPA2'de yaygın olan sahte **deauthentication** saldırılarını ve bazı DoS/sahte AP tekniklerini zorlaştırır.
- **Enhanced Open (OWE):** Açık (şifresiz) ağlar için. Parola istemeden, kafe/havaalanı gibi açık ağlarda bile trafiği **opportunistic encryption** ile şifreler. Kimlik doğrulama yoktur ama pasif dinleme (eavesdropping) ciddi biçimde zorlaşır.
- **192-bit güvenlik modu (WPA3-Enterprise):** Yüksek güvenlik gerektiren ortamlar (devlet, savunma, finans) için daha güçlü kriptografik paket.

## WPA3-Personal vs WPA3-Enterprise
- **Personal:** SAE tabanlı; ev/küçük ofis için, ama WPA2-Personal'dan çok daha dirençli.
- **Enterprise:** 802.1X tabanlı kullanıcı kimlik doğrulaması (bkz. `00-authentication-process.md`); isteğe bağlı 192-bit mod ile en yüksek güvenlik.

## Zayıflıkları — "mükemmel" değil
WPA3 büyük bir ilerlemedir ama kusursuz değildir:
- **Dragonblood (2019):** SAE'nin ilk uygulamalarında bulunan yan-kanal (side-channel) ve downgrade açıkları. Saldırganın bazı durumlarda parola hakkında bilgi sızdırmasına veya bağlantıyı WPA2'ye düşürmesine olanak tanıyordu; büyük ölçüde yamalarla giderildi.
- **Transition (karışık) mod:** Geriye uyumluluk için WPA3/WPA2 bir arada sunulduğunda, saldırgan bağlantıyı WPA2'ye **downgrade** etmeye zorlayabilir. En yüksek güvenlik için yalnızca-WPA3 modu gerekir.
- **Yaygınlık:** Tüm iyileştirmelere rağmen, güvenlik ancak hem AP hem istemci WPA3'ü destekleyip kullandığında geçerlidir.

## Savunma / en iyi uygulama
- Donanım destekliyorse **WPA3** kullanmak; mümkünse **transition mod yerine yalnızca-WPA3**.
- Açık ağlarda **Enhanced Open (OWE)** desteğini açmak.
- Cihazları güncel tutmak (Dragonblood yamaları).
- Kurumsal ortamda **WPA3-Enterprise**, çok hassas ortamlarda **192-bit mod**.

## Özet — WEP'ten WPA3'e
| Protokol | Şifreleme | Bütünlük | Temel zayıflık |
|---|---|---|---|
| **WEP** | RC4 + 24-bit IV | CRC-32 (zayıf) | Tamamen kırık |
| **WPA** | RC4 + TKIP | MIC (Michael) | RC4 tabanlı, geçici çözüm |
| **WPA2** | AES + CCMP | CCMP MIC | Zayıf PSK + handshake yakalama, KRACK |
| **WPA3** | AES + SAE | PMF zorunlu | Dragonblood, downgrade (transition mod) |

> **Ayırt etmek için:** SAE / Dragonfly, offline sözlük saldırısına direnç, forward secrecy veya zorunlu PMF geçiyorsa konu WPA3'tür.
