# Promiscuous Client

## Nedir?
Promiscuous client saldırısında saldırgan, meşru AP'den **daha güçlü bir sinyal** yayan sahte bir AP kurar ve istemcilerin bu güçlü sinyale otomatik olarak takılmasını bekler. "Promiscuous" (ayrım gözetmeyen) tabiri buradan gelir: birçok istemci, en tanıdık/en güçlü sinyali veren AP'ye, kimliğini ciddi şekilde doğrulamadan bağlanma eğilimindedir.

## Hedeflediği zafiyet
İstemcilerin varsayılan davranışı bu saldırının temelidir: bir cihaz, daha önce bağlandığı bir SSID'yi gördüğünde ya da aynı SSID'yi daha güçlü sinyalle sunan bir AP bulduğunda, genellikle otomatik olarak ona geçer. Radyo tarafında istemci "en iyi sinyali seç" mantığıyla çalıştığı için, saldırgan sadece sinyal gücünü artırarak kurbanları kendine çekebilir.

## Nasıl çalışır?
1. Saldırgan, hedef ortamdaki meşru AP ile aynı (veya cazip) bir SSID yayınlayan sahte bir AP kurar.
2. Bu sahte AP'yi, meşru AP'den daha yüksek sinyal gücüyle (örneğin daha güçlü anten veya yüksek çıkış gücü) yayınlar.
3. Menzildeki promiscuous istemciler daha güçlü sinyali tercih edip sahte AP'ye bağlanır.
4. Bağlanan istemcilerin trafiği artık saldırganın üzerinden akar.

## Diğer saldırılardan farkı
Bu saldırının ayırt edici unsuru **sinyal gücü üzerinden cezbetmedir.** Evil Twin ile yakından ilişkilidir; fark, buradaki vurgunun "istemcinin daha güçlü sinyale ayrım gözetmeden atlama davranışı" olmasıdır. Client mis-association'da kurban kazara yanlış AP'ye bağlanır; promiscuous client'ta ise saldırgan bu bağlanmayı aktif olarak **daha güçlü sinyalle tetikler.**

## Savunma
- İstemcilerde "en güçlü sinyale otomatik bağlan" ve "bilinen ağlara otomatik katıl" davranışını sıkılaştırmak; mümkünse yalnızca doğrulanmış profillere bağlanmak.
- **Karşılıklı kimlik doğrulama** sağlayan yöntemler kullanmak (WPA2/WPA3-Enterprise + sunucu sertifikası doğrulaması) — böylece istemci yalnızca sinyale değil, AP'nin gerçek kimliğine de bakar.
- WIPS ile aynı SSID'yi yayınlayan beklenmeyen/aşırı güçlü AP'leri tespit etmek.

> **Ayırt etmek için:** Saldırganın temel kozu **daha güçlü sinyal** yayıp istemcileri kendine çekmekse konu promiscuous client'tır.
