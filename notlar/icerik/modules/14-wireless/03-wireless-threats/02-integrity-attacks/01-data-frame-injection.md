# Data Frame Injection

## Nedir?
Data frame injection, saldırganın ağa **sahte (forged) 802.11 veri çerçeveleri üretip göndermesidir.** Normalde bir istemci yalnızca ağa katıldıktan sonra veri çerçevesi gönderir; saldırgan ise bu çerçeveleri elle hazırlayıp enjekte ederek sanki meşru bir cihazmış gibi trafik üretir. Amaç, cihazları yanıltmak, başka bir saldırıyı beslemek ya da ağ davranışını manipüle etmek olabilir.

## Hedeflediği zafiyet
802.11'de çerçevelerin kaynağını güçlü biçimde doğrulayan bir mekanizma yoksa (ör. zayıf veya hiç şifreleme), saldırganın ürettiği çerçeve meşru sayılır. Ayrıca kablosuz kart **monitor + injection** moduna alınabildiğinde, saldırgan istediği içerikte ham çerçeveyi havaya basabilir. Bu, pek çok aktif kablosuz saldırının altında yatan temel yetenektir.

## Nasıl çalışır?
1. Saldırgan, injection destekleyen bir kartı monitor moda alır.
2. Hedef ağı dinleyerek geçerli parametreleri (BSSID, kanal, istemci MAC'leri) öğrenir.
3. Bu parametrelerle sahte bir veri çerçevesi hazırlar ve ağa enjekte eder. Çerçeve geçerli görünürse AP/istemciler onu işler.

Pratikte injection, Aircrack-ng suite'inin (`aireplay-ng`) ve benzeri araçların temel özelliğidir; WEP kırma, replay ve deauth gibi birçok saldırı bu enjeksiyon yeteneği üzerine kurulur.

## Diğer saldırılardan farkı
Data frame injection, bütünlük saldırılarının **en genel biçimidir** — "sahte çerçeve üretip gönderme" fikri. WEP injection, bit-flipping ve replay saldırıları aslında bu yeteneğin özelleşmiş halleridir: biri şifreli paket üretir, biri içeriği değiştirir, biri eskisini tekrar yollar. Bu dosya o fikrin genel çerçevesini verir.

## Savunma
- **WPA2 (CCMP/AES) veya WPA3** kullanmak: güçlü kriptografik bütünlük (MIC) sayesinde saldırganın ürettiği sahte çerçeve geçersiz sayılır.
- Yönetim çerçeveleri için **802.11w (Protected Management Frames)** desteğini açmak.
- WIDS/WIPS ile anormal enjeksiyon örüntülerini ve beklenmeyen kaynaklardan gelen çerçeveleri tespit etmek.

> **Ayırt etmek için:** Konu, belirli bir şifreleme hilesi değil de genel olarak "ağa sahte veri çerçevesi üretip gönderme" ise data frame injection'dır.
