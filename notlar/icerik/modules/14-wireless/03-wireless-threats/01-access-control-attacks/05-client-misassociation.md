# Client Mis-association

## Nedir?
Client mis-association, meşru bir istemcinin **kurumun ağına ait olmayan bir AP'ye bağlanmasıdır** — çoğu zaman kullanıcı bunun farkında bile olmaz. Bağlanılan AP bir komşunun açık ağı, yakındaki bir kafenin Wi-Fi'si ya da saldırganın bu amaçla kurduğu sahte/rogue bir AP olabilir. Tehlike, bu bağlantının kurumun güvenlik çevresini (perimeter) dolanmasıdır.

## Hedeflediği zafiyet
Sorun yine istemci davranışından doğar: cihazlar, daha önce bağlandıkları SSID'leri veya açık ağları gördüklerinde otomatik bağlanabilir. Bir çalışanın dizüstü bilgisayarı aynı anda hem kurumsal kablolu ağa hem de dışarıdaki bir AP'ye bağlıysa, bu cihaz iki ağ arasında istemsiz bir **köprü** haline gelir. Saldırgan dıştaki AP üzerinden istemciye, oradan da iç ağa ulaşabilir — üstelik tüm bu trafik kurumun AP'lerini ve güvenlik kontrollerini hiç görmeden gerçekleşir.

## Nasıl çalışır?
1. Saldırgan, kurumun çevresinde (çoğunlukla fiziksel olarak binaya girmeden) bir AP kurar ya da zaten var olan dışarıdaki açık bir ağ yeterlidir.
2. Kurum içindeki bir istemci, sinyal/otomatik bağlanma davranışı nedeniyle bu dış AP'ye mis-associate olur.
3. İstemci aynı anda iç ağa da bağlıysa, saldırgan bu köprüden iç ağa sızmaya çalışır; değilse istemcinin kendisini hedef alır.

## Diğer saldırılardan farkı
Burada kurban **yanlış bir AP'ye** (ad-hoc değil) bağlanır ve bu genelde **kazara/istemsizdir.** Promiscuous client ile sınır incedir: promiscuous client, saldırganın daha güçlü sinyalle bu bağlanmayı aktif tetiklemesine vurgu yapar; client mis-association ise istemcinin yanlış AP'ye kayması olgusunu ve bunun yarattığı köprü riskini öne çıkarır. Unauthorized association'dan farkı ise, oradaki saldırganın genelde kendi soft AP'siyle kurbanı bilinçli olarak kendine bağlamasıdır.

## Savunma
- İstemcilerde otomatik bağlanmayı ve açık ağlara katılımı kısıtlamak; onaylı ağ profilleri dışına çıkışı engellemek.
- Cihazların aynı anda birden fazla ağa bağlanmasını (kablolu + kablosuz köprüsü) politikayla engellemek.
- **WPA2/WPA3-Enterprise + sunucu sertifikası doğrulaması** ile istemcinin yalnızca gerçek kurumsal AP'lere güvenmesini sağlamak.
- WIPS ile kurum istemcilerinin yetkisiz/komşu AP'lere bağlandığı durumları tespit etmek.

> **Ayırt etmek için:** Meşru bir istemci, ağa ait olmayan bir **AP'ye** (çoğu zaman farkında olmadan) bağlanıp çevre güvenliğini dolanıyorsa konu client mis-association'dır.
