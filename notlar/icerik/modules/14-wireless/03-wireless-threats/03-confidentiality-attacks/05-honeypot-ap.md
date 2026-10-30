# Honeypot AP

## Nedir?
Honeypot AP, saldırganın **cazip veya yaygın bir SSID yayınlayan sahte bir AP kurarak istemcileri kendine çekmesidir.** Burada belirli bir kurumun ağı taklit edilmez; bunun yerine cihazların otomatik bağlanmaya meyilli olduğu genel/tanıdık isimler (`Free_WiFi`, `Starbucks`, `Airport_WiFi` gibi) ya da cihazların havada aradığı bilinen ağ adları kullanılır. Tuzağa düşen kurbanların trafiği saldırganın üzerinden akar.

## Hedeflediği zafiyet
İstemci cihazlar, daha önce bağlandıkları ağları **probe request** çerçeveleriyle havada arar ("X ağı burada mı?"). Saldırgan bu probe'ları dinleyip cihazın aradığı SSID ile bir AP yayınlarsa, cihaz onu tanıdık ağ sanıp bağlanabilir. Ayrıca birçok kullanıcı "ücretsiz Wi-Fi" gibi cazip isimlere elle bağlanmaya isteklidir. Her iki durumda da zafiyet, istemcinin bağlandığı ağın gerçekliğini doğrulamamasıdır.

## Nasıl çalışır?
1. Saldırgan ortamı dinleyip cihazların aradığı SSID'leri (probe request'ler) toplar ya da cazip bir genel SSID seçer.
2. Bu SSID ile açık bir honeypot AP yayınlar.
3. İstemciler otomatik veya elle bağlanır.
4. Saldırgan bağlanan kurbanların trafiğini dinler, sahte portal ile kimlik bilgisi toplar veya MITM'e geçer.

## Diğer saldırılardan farkı
Evil twin **belirli bir meşru AP'yi** aynı SSID ile taklit eder (hedefli). Honeypot AP ise belirli bir ağı taklit etmek yerine **genel bir cazibe veya cihazların aradığı isimlerle rastgele kurbanları** toplar (geniş ağ atar). İkisi de sahte AP kurar; fark, hedefin spesifik mi yoksa fırsatçı/geniş mi olduğudur. Promiscuous client (access control kategorisinde) ise aynı mantığın "daha güçlü sinyalle cezbetme" vurgulu halidir.

## Savunma
- İstemcilerde **otomatik bağlanmayı ve kayıtlı açık ağlara geri dönmeyi** kısıtlamak; gereksiz kayıtlı ağ profillerini temizlemek.
- Açık ağlara bağlanırken dikkatli olmak; kurumsal cihazlarda yalnızca onaylı profillere izin vermek.
- Kurumsal ortamda **WPA2/WPA3-Enterprise + sertifika doğrulaması** ile sahte AP'lere güveni kırmak.
- **WIPS** ile ortamda beliren yetkisiz/şüpheli açık AP'leri tespit etmek.

> **Ayırt etmek için:** Sahte AP, belirli bir ağı taklit etmeden **cazip/genel bir SSID ile rastgele kurban topluyorsa** konu honeypot AP'dir.
