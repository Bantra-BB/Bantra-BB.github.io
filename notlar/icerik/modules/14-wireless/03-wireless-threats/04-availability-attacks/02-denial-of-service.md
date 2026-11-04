# Denial-of-Service

## Nedir?
Denial-of-Service (DoS), bir kablosuz ağın veya cihazın **meşru kullanıcılara hizmet veremez hale getirilmesidir.** Amaç veriyi çalmak veya değiştirmek değil; erişimi engellemektir. Bu dosya, availability kategorisinin **şemsiye kavramıdır** — bu klasördeki pek çok saldırı (deauth flood, disassociation, authenticate flood, beacon flood, jamming vb.) aslında birer DoS yöntemidir.

## DoS nerede gerçekleşebilir? (katmanlar)
Kablosuz DoS, farklı katmanlarda yapılabilir:

| Katman | Örnek saldırı | Mantık |
|---|---|---|
| **Fiziksel (RF)** | Jamming (sinyal bozma) | Frekansı gürültüyle doldurup iletişimi imkânsız kılmak |
| **Veri bağlantısı (MAC/802.11)** | Deauth, disassociation, authenticate/beacon flood | Yönetim çerçevelerini kötüye kullanıp cihazları düşürmek/boğmak |
| **Ağ/üst katman** | ARP poisoning, flooding | Trafiği bozmak veya kaynakları tüketmek |

## Neden kablosuzda DoS kolaydır?
İki temel neden:
- **Paylaşımlı ortam:** Hava herkese açıktır; yeterli güçte gürültü (jamming) tüm iletişimi durdurabilir.
- **Korumasız yönetim çerçeveleri:** Klasik 802.11'de deauth/disassociation gibi yönetim çerçeveleri **şifrelenmez ve doğrulanmaz.** Saldırgan bunların sahtesini üretip cihazları ağdan düşürebilir. (Bu açığı kapatan önlem: 802.11w / PMF.)

## Nasıl çalışır? (genel)
1. Saldırgan hedefin kanalını/BSSID'sini belirler.
2. Seçtiği DoS yöntemine göre ya RF'i boğar (jamming), ya sahte yönetim çerçeveleri gönderir (deauth/disassoc flood), ya da kaynakları tüketecek istek seli üretir (authenticate/beacon flood).
3. Meşru kullanıcılar bağlanamaz veya bağlantıları sürekli kopar.

## Diğer saldırılardan farkı
DoS, bu kategorinin **genel amacıdır**; alt dosyalardaki saldırılar bunun özel biçimleridir. Diğer kategorilerden (confidentiality, integrity) farkı ise, DoS'ta amaç veriye erişmek veya onu değiştirmek değil, **hizmeti kesmektir.**

## Savunma
- **802.11w (Protected Management Frames):** Deauth/disassociation gibi çerçeveleri koruyarak MAC katmanı DoS'larının çoğunu engeller. WPA3'te zorunludur.
- **WIDS/WIPS:** Anormal çerçeve selini, tekrarlayan deauth'ları ve sahte AP'leri tespit edip uyarı/önlem üretir.
- **RF izleme:** Spektrum analizi ile jamming kaynaklarını tespit etmek; kritik alanlarda kapsama/parazit yönetimi.
- Dayanıklı tasarım: fazladan AP/kanal, otomatik kanal değişimi, kritik sistemlerde kablolu yedek.

> **Ayırt etmek için:** Amaç veri değil de **hizmetin kesilmesi** ise konu bir DoS'tur; hangi yöntemle yapıldığı (deauth, jamming, flood) alt dosyalarda ayrışır.
