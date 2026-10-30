# Wireless Network Viruses

## Nedir?
Wireless network viruses, kablosuz ağ ortamı üzerinden yayılan ya da kablosuz altyapıyı (AP'ler, istemciler) hedef alan **zararlı yazılımlardır.** Bu başlık, bütünlük kategorisinde ele alınır çünkü böyle bir zararlı, bir cihaza veya AP'ye bulaştığında ağın ve üzerindeki verinin bütünlüğünü doğrudan bozabilir; saldırgana ağı manipüle etme fırsatı verir.

## Neden kablosuz ağlar için ayrı bir risk?
Kablosuz ortam, zararlı yazılımın yayılması için elverişli bir zemindir: menzildeki cihazlar birbirine görece kolay ulaşır, misafir/açık ağlar güvenilmeyen cihazları aynı ortama sokar ve bir AP'ye bulaşan zararlı, ona bağlanan tüm istemcileri etkileyebilecek bir konuma yerleşir. Bir AP ele geçirildiğinde saldırgan trafiği yönlendirebilir, sahte güncelleme/yapılandırma dağıtabilir veya ağı başka saldırılar için dayanak haline getirebilir.

## Nasıl bir tehdit oluşturur?
- Bulaşan bir istemci, bağlandığı kablosuz ağda diğer cihazlara yayılmaya çalışabilir.
- Zararlı yazılım yüklü bir AP (ör. değiştirilmiş firmware), ona bağlanan istemcilerin trafiğini izleyebilir veya manipüle edebilir — bu, bütünlük ve gizlilik ihlalini bir arada getirir.
- Açık/misafir ağlar, güvenilmeyen cihazların zararlıyı ortama taşıması için kanal olabilir.

## Diğer saldırılardan farkı
Bu kategorideki diğer saldırılar belirli çerçeveleri üretmek, değiştirmek veya tekrar göndermekle ilgiliydi. Wireless network viruses ise bir **yazılım tehdidi** boyutudur: saldırının aracı tek bir paket değil, cihaza/AP'ye yerleşen kötücül koddur. Kablosuz ortamı ise bu kodun yayılma ve etki alanı olarak kullanır.

## Savunma
- İstemcilerde güncel **anti-malware/EDR** ve güncel işletim sistemi/yama seviyesi.
- AP'lerde **firmware bütünlüğü** ve düzenli, doğrulanmış güncellemeler; yalnızca üreticiden imzalı firmware yüklemek.
- Misafir ağını kurumsal ağdan **segmentasyon** ile ayırmak; güvenilmeyen cihazları izole etmek.
- Ağ üzerinde anormal yayılma/trafik davranışını izleyen tespit mekanizmaları (NDR/WIPS).

> **Ayırt etmek için:** Tehdit tek bir çerçeve/replay değil de kablosuz ortam üzerinden yayılan/AP'yi hedef alan **zararlı yazılım** ise konu wireless network viruses'tır.
