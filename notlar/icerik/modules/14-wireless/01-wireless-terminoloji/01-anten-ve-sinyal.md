# Anten ve Sinyal (OFDM, MIMO, DSSS, FHSS)

Bu bölüm, verinin havada fiziksel olarak nasıl taşındığıyla ilgili. Bu kavramları tanımak, bir ağın hızını, menzilini ve ne kadar kolay dinlenebileceğini anlamana yarar.

## Spread Spectrum (yayılı spektrum) nedir?
Klasik radyo, sinyali tek bir dar frekansta gönderir. **Spread spectrum** ise sinyali bilerek geniş bir frekans bandına yayar. Bunun iki faydası var: parazite/girişime karşı dayanıklılık ve dinlemeye/bozmaya (jamming) karşı zorluk. Kökeni askeri iletişimdir. Wi-Fi'nin ilk sürümleri bu tekniklerle başladı; DSSS ve FHSS, spread spectrum'un iki farklı yöntemidir.

## DSSS (Direct Sequence Spread Spectrum)
**DSSS**, her veri bitini çok daha uzun bir kod dizisiyle çarparak sinyali geniş bir banda yayar.

Nasıl çalışır:
1. Gönderilecek her bit, **chipping code** (yayma kodu) adı verilen bir bit dizisiyle birleştirilir. Bu dizideki her bite **chip** denir.
2. Örneğin ilk 802.11b'de (1-2 Mbps) **11 chiplik Barker kodu** kullanılır — tek bir veri biti 11 chip olarak gönderilir.
3. Chip hızı veri hızından çok yüksek olduğu için sinyal geniş bir banda yayılır (2.4 GHz'de yaklaşık 22 MHz).
4. Alıcı aynı kodu bildiği için sinyali tekrar daraltıp (despreading) orijinal biti çıkarır.

Faydası: banttaki birkaç chip parazitten bozulsa bile alıcı biti yine doğru tahmin edebilir (buna **processing gain** denir). Dezavantajı: geniş bant kullandığı için spektrum verimliliği düşüktür, hızı sınırlıdır (802.11b'de en fazla 11 Mbps — bu hızlarda Barker yerine **CCK** denen kodlama devreye girer).

> **Ayırt etmek için:** "chipping code", "Barker code" veya "chip" kavramı geçiyorsa konu DSSS'tir.

## FHSS (Frequency Hopping Spread Spectrum)
**FHSS**, taşıyıcı frekansı çok sayıda dar kanal arasında, gönderici ve alıcının bildiği **sözde rastgele (pseudorandom) bir sıraya göre** sürekli atlatır.

Nasıl çalışır:
1. Bant çok sayıda dar kanala bölünür.
2. Gönderici ve alıcı aynı **atlama sırasını (hopping sequence)** ve zamanlamayı paylaşır.
3. Veri kısa bir süre bir kanalda gönderilir (**dwell time**), sonra sıradaki kanala atlanır. Saniyedeki atlama sayısına **hop rate** denir.
4. Alıcı aynı sırayla senkron atladığı için veriyi kesintisiz toplar.

Benzetme: iki kişinin önceden anlaştıkları bir listeye göre birkaç saniyede bir telsiz kanalı değiştirmesi gibi. Listeyi bilmeyen biri konuşmanın sadece kopuk parçalarını duyar.

Faydası: bir kanal parazitliyse sadece o atlamadaki veri etkilenir, sonraki temiz kanalda telafi edilir; dinlemek ve bozmak zorlaşır. Dezavantajı: her an sadece dar bir kanal kullanıldığı için hız düşüktür.

Wi-Fi bunu ilk 802.11'den sonra bıraktı, ama **Bluetooth hâlâ FHSS kullanır** (Bluetooth Classic: 79 kanal, saniyede 1600 atlama). Bluetooth ayrıca **AFH (Adaptive Frequency Hopping)** ile dolu kanalları (örneğin Wi-Fi'nin kullandığı kanallar) atlama listesinden çıkarıp aynı 2.4 GHz bandında Wi-Fi ile çakışmadan çalışır.

> **Güvenlik notu:** FHSS bir **şifreleme değildir**. Bluetooth'ta atlama sırası, ana cihazın adresi ve saatinden türetilir; bunu ele geçiren (örneğin **Ubertooth One** ile) atlamayı takip edip trafiği yakalayabilir. Yani FHSS'in sağladığı "gizlilik" dolaylı bir yan etkidir — asıl koruma şifrelemeden gelir.

## OFDM (Orthogonal Frequency Division Multiplexing)
**OFDM**, bir kanalı çok sayıda dar **alt taşıyıcıya (subcarrier)** bölüp veriyi bunlar üzerinden **paralel** gönderen tekniktir. Modern Wi-Fi'nin hız kaynağı budur.

Benzetme: tek şeritli hızlı bir otoyol yerine yan yana onlarca yavaş şerit. Her şerit tek başına daha dayanıklıdır ama toplam kapasite yüksektir.

**"Orthogonal" (dik) kısmı** önemli: alt taşıyıcılar frekansta birbirinin üstüne biner, ama matematiksel olarak birbirine dik yerleştirildiği için birbirini bozmaz. Böylece aralarına boşluk (guard band) koymaya gerek kalmaz, spektrum verimli kullanılır.

Avantajları:
- **Multipath dayanıklılığı:** Sinyal duvarlardan yansıyıp alıcıya farklı zamanlarda ulaşır. OFDM'de her sembol uzun sürdüğü ve semboller arasına **guard interval (cyclic prefix)** eklendiği için bu gecikmeler daha az zarar verir (semboller arası girişim — ISI — azalır).
- **Spektral verimlilik:** Üst üste binen alt taşıyıcılar sayesinde aynı bantta daha fazla veri taşınır.

Somut örnek (802.11a/g, 20 MHz kanal): 64 alt taşıyıcı tanımlıdır, 52'si kullanılır — 48'i veri, 4'ü senkronizasyon için pilot.

**OFDMA (Wi-Fi 6):** OFDM'de belirli bir anda tüm alt taşıyıcılar tek bir kullanıcıya gider. OFDMA'da ise alt taşıyıcılar gruplara (Resource Unit) bölünüp **aynı anda birden fazla kullanıcıya** dağıtılır. Kalabalık ortamlarda verimliliği ciddi artırır.

> **Ayırt etmek için:** "sinyali birden fazla dik alt taşıyıcıya böler" → OFDM. "frekanslar arasında belirli bir düzende atlar" → FHSS. "yayma koduyla birleştirir" → DSSS.

## MIMO (Multiple Input Multiple Output)
**MIMO**, hem gönderici hem alıcıda **birden fazla anten** kullanarak aynı anda birden çok veri akışı (spatial stream) taşıma tekniğidir. 802.11n ile geldi, sonrasında standart oldu.

İki temel faydası var:
- **Hız (spatial multiplexing):** Farklı antenlerden farklı veri akışları paralel gönderilir, toplam hız katlanır.
- **Menzil/kararlılık (diversity):** Aynı veri birden çok yoldan gider; alıcı en temiz geleni birleştirir, böylece multipath bir sorun olmaktan çıkıp avantaja dönüşür.

**MU-MIMO (Multi-User MIMO):** AP'nin aynı anda birden fazla istemciye ayrı akışlarla hizmet vermesidir. Modern Wi-Fi'de MIMO ile OFDM birlikte çalışır — buna **MIMO-OFDM** denir.

## Antenler
Anten, RF sinyalini havaya yayan ve havadan toplayan bileşendir. Wi-Fi güvenliğinde anten seçimi doğrudan menzili ve kapsama şeklini belirler — hem savunan hem saldıran taraf için önemlidir.

| Anten türü | Yayılım şekli | Tipik kullanım |
|---|---|---|
| **Omnidirectional** | Her yöne, dairesel | Ev/ofis AP'leri, geniş kapsama |
| **Directional (Yagi)** | Tek yöne, odaklı huzme | Uzak mesafe, belirli bir hedefe |
| **Parabolic / Grid** | Çok dar, çok uzak | Noktadan noktaya uzun bağlantı |
| **Dipole** | Çift yönlü, basit | Pek çok cihazdaki temel anten |

Pratik etkisi: bir saldırgan **directional anten** ile uzaktaki bir ağa, fiziksel olarak binaya girmeden erişebilir. Savunma tarafında ise AP anten gücünü ve yönünü ayarlamak, sinyalin bina dışına taşmasını (signal leakage) azaltmanın bir yoludur.

## Üçlü karşılaştırma — nerede ne kullanılır?

| Teknik | Yöntem | Kullanıldığı yer |
|---|---|---|
| DSSS | Her biti chip koduyla yayar | 802.11, 802.11b |
| FHSS | Frekanslar arasında düzenli atlar | İlk 802.11, Bluetooth |
| OFDM | Veriyi dik alt taşıyıcılara paralel böler | 802.11a/g ve sonrası |
| MIMO | Çok antenle paralel akış | 802.11n ve sonrası (OFDM ile) |

## Özet
- **DSSS / FHSS:** eski spread spectrum yöntemleri; DSSS yayma kodu kullanır, FHSS kanal atlar. FHSS bugün Bluetooth'ta yaşar.
- **OFDM:** modern Wi-Fi hızının temeli; veriyi çok sayıda dik alt taşıyıcıya böler. **OFDMA** ile aynı anda çok kullanıcıya hizmet verir.
- **MIMO:** çok antenle hız ve kararlılık; OFDM ile birleşince (MIMO-OFDM) bugünkü yüksek hızları verir.
- **Anten** yönü ve türü, kablosuz bir ağın saldırı yüzeyinin fiziksel sınırını belirler.
