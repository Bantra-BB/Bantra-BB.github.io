# WEP Injection

## Nedir?
WEP injection, saldırganın **WEP anahtarını hiç bilmeden geçerli şifreli paketler üretip ağa enjekte etmesidir.** Bunu mümkün kılan şey, bir **keystream** parçasının ele geçirilmesidir: WEP'in RC4 akış şifrelemesinde, bilinen bir açık metin (plaintext) ile ona karşılık gelen şifreli metin (ciphertext) elde edilirse, ikisinin XOR'u o IV için kullanılan keystream'i verir. Saldırgan bu keystream ile kendi istediği veriyi şifreleyip geçerli bir WEP paketi gibi gönderebilir.

## Hedeflediği zafiyet
Bu saldırı doğrudan WEP'in tasarım kusurlarına dayanır (detayı: `02-wifi-auth-encryption/01-encryption-wep.md`). İki zayıflık birleşir: RC4 keystream'inin IV başına yeniden kullanılabilmesi ve bütünlük kontrolünün (CRC-32 / ICV) kriptografik olmayıp tahmin edilebilir olması. Bir keystream parçası ele geçince, saldırgan aynı IV ile istediği kadar geçerli paket üretebilir — anahtarı hiç kırması gerekmez.

## Nasıl çalışır?
1. Saldırgan, bilinen açık metni olan bir paket yakalar (ör. ARP istekleri boyutu ve yapısı tahmin edilebilir olduğu için idealdir).
2. Açık metin ile şifreli metni XOR'layarak o IV'ye ait keystream'i çıkarır.
3. Bu keystream ile kendi verisini şifreler, uygun ICV'yi hesaplar ve geçerli bir WEP paketi olarak enjekte eder.

Bu teknik, WEP kırma sürecinde trafiği hızlandırmak için de kullanılır: enjekte edilen paketler AP'yi daha fazla IV üretmeye zorlar, böylece anahtarı kırmak için gereken IV'ler çok daha hızlı toplanır.

## Diğer saldırılardan farkı
Data frame injection'ın WEP'e özgü, kriptografik bir özel halidir: fark, burada saldırganın **geçerli şifreli** paketler üretmesidir (keystream sayesinde). Bit-flipping'den farkı ise, bit-flipping var olan bir paketi değiştirirken, WEP injection sıfırdan yeni geçerli paketler üretir.

## Savunma
- **WEP'i tamamen bırakmak** — tek gerçek çözüm budur. WEP, bu ve benzeri saldırılar yüzünden onlarca yıldır kırık kabul edilir.
- **WPA2 (CCMP/AES)** veya **WPA3**'e geçmek: keystream yeniden kullanımı ve zayıf bütünlük kontrolü bu protokollerde yoktur.

> **Ayırt etmek için:** Saldırgan, ele geçirdiği **keystream** ile anahtarı bilmeden **geçerli WEP paketleri üretiyorsa** konu WEP injection'dır.
