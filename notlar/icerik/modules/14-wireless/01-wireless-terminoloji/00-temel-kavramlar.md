# Temel Kavramlar

## Kablosuz ağ nedir?
Kablosuz ağ, cihazların kablo yerine radyo dalgaları (RF — Radio Frequency) üzerinden haberleştiği ağdır. Kabloyla ağa bağlanmak yerine veri havadan, belirli frekanslarda taşınır. Wi-Fi olarak bildiğimiz teknoloji, bu işin **IEEE 802.11** standartları ailesiyle tanımlanmış halidir.

Kablolu ağdan temel farkı: iletim ortamı (hava) **paylaşımlıdır ve herkese açıktır**. Kabloda veri fiziksel olarak bir telin içinden gider; havada ise menzildeki herkes aynı sinyali dinleyebilir. Kablosuz güvenliğin tüm konusu da aslında buradan doğar — açık bir ortamda iletişimi nasıl gizli ve güvenilir tutarız.

## Access Point (AP) — Erişim Noktası
**Access Point (AP)**, kablosuz istemcileri bir araya toplayan ve onları kablolu ağa (ve internete) bağlayan merkezi cihazdır. Ev tipi modem/router'lar AP işlevini de içinde barındırır; kurumsal ortamda ise AP'ler genelde ayrı cihazlardır ve bir denetleyiciye (controller) bağlı çalışır.

AP sürekli olarak kendini tanıtan **beacon** adında küçük çerçeveler (frame) yayınlar. Telefonunun "kullanılabilir ağlar" listesinde gördüğün ağlar, aslında çevredeki AP'lerin yaydığı bu beacon'lardan toplanır.

## Station (STA) — İstemci
**Station (STA)**, kablosuz ağa bağlanan herhangi bir uç cihazdır: dizüstü, telefon, yazıcı, IoT cihazı. Türkçe not boyunca buna çoğunlukla **istemci (client)** diyeceğiz. AP de teknik olarak bir station'dır ama ağı yöneten taraf olduğu için ayrı anılır.

## SSID — Ağın adı
**SSID (Service Set Identifier)**, bir kablosuz ağın insan tarafından okunabilen adıdır — `Ofis-WiFi`, `Starbucks`, `Ev_5GHz` gibi. En fazla 32 byte uzunluğunda olabilir.

SSID bir güvenlik mekanizması **değildir**, sadece bir etikettir. AP'yi "gizli SSID" (hidden/non-broadcast) moduna alsan bile ağ tamamen görünmez olmaz: SSID, bir istemci bağlanırken yine havada taşınır ve dinleyen biri onu yakalayabilir. Yani gizli SSID, ciddi bir koruma sayılmaz — sadece sıradan göz için ağı listede göstermez.

## BSSID — AP'nin kimliği
**BSSID (Basic Service Set Identifier)**, tek bir AP'yi (daha doğrusu AP'nin tek bir radyosunu) tanımlayan 48 bitlik benzersiz kimliktir. Pratikte bu, **AP'nin kablosuz arayüzünün MAC adresidir**: `A4:2B:B0:11:22:33` gibi.

SSID ile BSSID sınavlarda ve sahada en çok karıştırılan ikilidir, ayrımı net tutmak gerekir:

| | SSID | BSSID |
|---|---|---|
| Nedir | Ağın okunabilir adı | AP'nin donanımsal kimliği |
| Örnek | `Ofis-WiFi` | `A4:2B:B0:11:22:33` |
| Uzunluk | En fazla 32 byte | 48 bit (6 byte, MAC adresi) |
| Benzersizlik | Birçok AP aynı SSID'yi yayınlayabilir | Her AP/radyo için ayrıdır |

Bir AP birden fazla ağ yayınlıyorsa (misafir + kurumsal gibi), genelde her SSID için ayrı bir BSSID türetilir — MAC adresinin son hanesi değişir.

## BSS, ESS, IBSS — Servis setleri
Bu üç kavram, bir kablosuz ağın topolojisini tanımlar.

**BSS (Basic Service Set):** Bir AP ile ona bağlı istemcilerden oluşan en temel yapı. Tek AP'li bir ağ bir BSS'tir. Bu yapının kimliği BSSID'dir.

**ESS (Extended Service Set):** Aynı SSID'yi yayınlayan birden fazla AP'nin oluşturduğu büyük ağ. Örneğin bir ofis katında `Ofis-WiFi` yayınlayan 20 AP tek bir ESS oluşturur. İstemci binada gezerken (**roaming**) SSID hep aynı kalır, sadece bağlandığı BSSID değişir — telefonun en güçlü sinyali veren AP'ye otomatik geçer.

**IBSS (Independent BSS) / Ad-hoc:** Merkezi bir AP olmadan cihazların doğrudan birbirine bağlandığı mod. AP olmadığı için BSSID rastgele üretilir. Bugün nadir kullanılır ama "ad-hoc" terimi olarak karşına çıkar.

| Yapı | AP var mı? | SSID | Örnek |
|---|---|---|---|
| BSS | Evet, tek AP | Tek | Ev ağı |
| ESS | Evet, çok AP | Hepsi aynı | Ofis/AVM Wi-Fi'si |
| IBSS (Ad-hoc) | Hayır | — | İki laptop'un doğrudan bağlanması |

## Frekans bantları
Wi-Fi iki ana frekans bandında çalışır (Wi-Fi 6E ile üçüncüsü eklendi):

- **2.4 GHz:** Menzili uzun, duvarları daha iyi geçer, ama yavaş ve kalabalıktır. Bluetooth, kablosuz fare, mikrodalga fırın gibi birçok cihaz da bu bandı kullandığı için parazit (interference) fazladır.
- **5 GHz:** Daha hızlı ve daha az kalabalık, ama menzili kısa ve duvarlardan daha çok etkilenir.
- **6 GHz:** Wi-Fi 6E / Wi-Fi 7 ile gelen, en geniş ve en temiz bant.

## Kanal (Channel)
Her bant, **kanal** adı verilen daha dar frekans dilimlerine bölünür. İki AP aynı kanalda yayın yaparsa birbirini parazitler; bu yüzden AP'ler farklı kanallara ayarlanır.

2.4 GHz bandında önemli bir ayrıntı var: kanallar 5 MHz arayla dizilir, ama her Wi-Fi kanalı yaklaşık 20-22 MHz genişliğindedir. Bu yüzden komşu kanallar birbirinin üstüne biner. Birbiriyle **çakışmayan tek kombinasyon 1, 6 ve 11** numaralı kanallardır. Saldırı/analiz tarafında bu bilgi işe yarar: hedefin hangi kanalda olduğunu bilmek, dinlemeyi (sniffing) o kanala kilitlemek için gerekir.

## Beacon, Probe ve diğer yönetim çerçeveleri
802.11 trafiği üç tür çerçeveden oluşur: **yönetim (management)**, **kontrol (control)** ve **veri (data)**. Terminoloji için en çok işine yarayacak yönetim çerçeveleri:

- **Beacon:** AP'nin düzenli aralıklarla yaydığı "buradayım" duyurusu. SSID, desteklenen hızlar, şifreleme bilgisi bunun içindedir.
- **Probe Request / Response:** İstemcinin "şu ağ burada mı?" diye sorması ve AP'nin cevabı. Telefonunun daha önce bağlandığı ağları havada araması bu çerçevelerle olur — ki bu, Evil Twin saldırılarının dayanak noktalarından biridir.
- **Authentication / Association:** İstemcinin AP'ye bağlanma sürecinde kullandığı çerçeveler.
- **Deauthentication / Disassociation:** Bağlantıyı sonlandıran çerçeveler. Bunların **şifrelenmemiş** olması, deauth saldırısının neden mümkün olduğunu açıklar — detayını saldırılar bölümünde göreceğiz.

## Hotspot
**Hotspot**, genele açık bir internet erişim noktasıdır — kafe, otel, havaalanı Wi-Fi'si gibi. Genelde ya açıktır (şifresiz) ya da **captive portal** denen bir giriş sayfasıyla kontrol edilir. Açık hotspot'lar, araya girme (MITM) ve sahte AP (Evil Twin) saldırıları için klasik hedeflerdir, çünkü trafik çoğu zaman şifresiz akar.

## Özet
- **AP** ağı sağlar, **STA/istemci** bağlanır.
- **SSID** ağın adı (güvenlik değil), **BSSID** AP'nin MAC kimliği.
- **BSS** tek AP'li ağ, **ESS** aynı SSID'li çok AP'li ağ, **IBSS** AP'siz ad-hoc ağ.
- Wi-Fi **2.4 / 5 / 6 GHz** bantlarında, **kanallara** bölünmüş olarak çalışır; 2.4 GHz'de çakışmayan kanallar **1, 6, 11**.
- Havadaki yönetim çerçevelerinin çoğu şifresizdir — kablosuz saldırıların büyük kısmı tam olarak bu açıktan beslenir.
