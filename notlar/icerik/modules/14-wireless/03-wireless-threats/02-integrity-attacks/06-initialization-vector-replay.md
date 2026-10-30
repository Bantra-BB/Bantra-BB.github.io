# Initialization Vector (IV) Replay

## Nedir?
IV replay, saldırganın WEP trafiğindeki **başlatma vektörlerini (Initialization Vector — IV)** ve bunlara karşılık gelen keystream'leri biriktirerek bir **keystream sözlüğü** kurması ve bu IV'leri yeniden kullanarak trafiği çözmesi veya sahte paket üretmesidir. Bu saldırı doğrudan WEP'in IV tasarımındaki kusura dayanır.

## Kısa hatırlatma: IV nedir?
WEP, her paketi RC4 ile şifrelerken anahtara kısa bir **IV** ekler ki aynı anahtarla şifrelenen paketler farklı görünsün. Fikir doğru ama uygulaması kırıktır: WEP'te IV sadece **24 bittir** ve açık (plaintext) olarak paketin başında taşınır. 24 bit çok küçük bir alan olduğu için yoğun bir ağda IV'ler kısa sürede tükenir ve **tekrar etmeye** başlar. (Detay: `02-wifi-auth-encryption/01-encryption-wep.md`.)

## Hedeflediği zafiyet
Aynı IV iki pakette tekrar ettiğinde, o iki paket aynı keystream ile şifrelenmiş olur. Saldırgan bu "IV çakışmalarını" toplayarak keystream'leri çıkarabilir. Yeterince IV biriktiğinde:
- Trafiği çözebilir (keystream sözlüğüyle),
- Aynı IV'yi yeniden kullanıp geçerli paketler üretebilir (WEP injection ile ilişkili),
- Ve nihayetinde WEP anahtarını kırabilir.

## Nasıl çalışır?
1. Saldırgan ağı uzun süre dinleyerek çok sayıda IV toplar.
2. Tekrar eden IV'leri ve bunlara ait keystream'leri eşleştirip bir sözlük oluşturur.
3. Bu sözlükle şifreli paketleri çözer veya aynı IV ile sahte paket enjekte eder.

IV toplama süreci yavaşsa, saldırgan paket enjeksiyonu (ör. yakalanan ARP'nin tekrar gönderilmesi) ile AP'yi daha fazla IV üretmeye zorlayarak süreci hızlandırır.

## Diğer saldırılardan farkı
IV replay, replay ailesinin **WEP'e özgü, kriptografik** bir üyesidir: data replay herhangi bir veri çerçevesini tekrar ederken, IV replay özellikle **IV yeniden kullanımını** istismar edip keystream elde etmeyi hedefler. WEP injection ise bu yolla elde edilen keystream'i kullanarak paket üretir — ikisi WEP kırma zincirinde sıkça birlikte anılır.

## Savunma
- **WEP'i tamamen bırakmak.** IV'nin kısa ve tekrar eden yapısı WEP'in düzeltilemez kusurudur.
- **WPA2 (CCMP/AES) / WPA3** kullanmak: bunlarda IV benzeri değerler çok daha uzundur, tekrar etmez ve her pakete replay korumalı paket numarası eklenir.

> **Ayırt etmek için:** Saldırı özellikle WEP'in **kısa/tekrar eden IV'lerini** biriktirip keystream elde etmeye dayanıyorsa konu IV replay'dir.
