# WEP

## Nedir?
WEP (Wired Equivalent Privacy), 1997'de ilk 802.11 standardıyla gelen ilk Wi-Fi şifreleme protokolüdür. Adı iddialıdır — "kablolu ağa denk gizlilik" sunmayı hedefler — ama tasarım hatalarıyla doludur ve bugün **tamamen kırık** kabul edilir. Modern bir ağda WEP görürsen, o ağ pratikte korumasızdır. WEP'i anlamak yine de önemlidir, çünkü pek çok kablosuz saldırı (bit-flipping, IV/keystream saldırıları, WEP cracking) doğrudan onun kusurlarından doğar.

## Nasıl çalışır?
WEP, **RC4** akış şifrelemesini kullanır:
1. Paylaşılan gizli anahtar (40 veya 104 bit) ile her paket için üretilen bir **IV (Initialization Vector)** birleştirilir.
2. Bu birleşim RC4'e beslenir ve bir **keystream** üretilir.
3. Açık veri, keystream ile XOR'lanarak şifrelenir.
4. Veriye ek olarak bir **ICV (Integrity Check Value)** eklenir; bu, **CRC-32** ile hesaplanır ve paketin bozulmadığını doğrulamayı amaçlar.
5. IV, her pakette **açık (plaintext)** olarak başa eklenir ki alıcı aynı keystream'i üretebilsin.

## Tasarım kusurları
WEP'in çöküşü tek bir hata değil, birkaç kusurun birleşimidir:

- **Kısa IV (24 bit):** IV sadece 24 bittir ve yoğun bir ağda kısa sürede tükenip **tekrar eder**. Aynı IV = aynı keystream demektir; tekrar eden IV'ler saldırgana keystream çıkarma fırsatı verir.
- **IV'nin açık taşınması:** Saldırgan her paketin IV'sini doğrudan görür, bu da istatistiksel saldırıları kolaylaştırır.
- **Zayıf bütünlük (CRC-32):** ICV, kriptografik olmayan, **doğrusal** bir CRC'dir. Kazara hataları yakalar ama kasıtlı değişiklikleri yakalayamaz — saldırgan payload'ı değiştirip CRC'yi de düzeltebilir (bit-flipping'in temeli).
- **RC4 zayıf anahtarları:** Belirli IV'ler, anahtar hakkında istatistiksel ipucu sızdırır. **FMS** saldırısı bunu kullanır; sonraki **PTW** yöntemi çok daha az paketle anahtarı çıkarır.
- **Shared Key authentication'ın keystream sızdırması:** Challenge-response, açık metin ve şifreli halini birlikte havaya verir (bkz. `00-authentication-process.md`).

## WEP'e dayanan saldırılar
Bu kusurlar şu saldırıların doğrudan kaynağıdır (ilgili notlar `03-wireless-threats` altında):
- **IV replay / keystream toplama** → IV'leri biriktirip keystream sözlüğü kurma.
- **WEP injection** → ele geçirilen keystream ile geçerli paket üretme.
- **Bit-flipping** → zayıf CRC-32 sayesinde şifreli içeriği değiştirme.
- **Cracking WEP key** → yeterli IV toplayıp FMS/PTW ile anahtarı kurtarma (Aircrack-ng).

## Neden düzeltilemedi?
WEP'in sorunları yama ile kapatılabilecek türden değil; IV uzunluğu, CRC kullanımı ve RC4 entegrasyonu protokolün temeline işlemiştir. Bu yüzden çözüm WEP'i yamalamak değil, **tümüyle değiştirmek** oldu — önce geçici bir köprü (WPA/TKIP), sonra kalıcı çözüm (WPA2/CCMP).

## Savunma
- **WEP'i asla kullanmamak.** Hâlâ WEP ile çalışan bir cihaz/ağ varsa, en kısa sürede WPA2 (tercihen WPA3) ile değiştirilmeli.
- Eski donanım WEP'ten başkasını desteklemiyorsa, o cihazı güvenilir bir segmente izole etmek veya emekliye ayırmak.

> **Ayırt etmek için:** RC4 + 24-bit açık IV + CRC-32 (ICV) kombinasyonu geçiyorsa konu WEP'tir. "Kırık, kullanılmamalı" vurgusu da WEP'i işaret eder.
