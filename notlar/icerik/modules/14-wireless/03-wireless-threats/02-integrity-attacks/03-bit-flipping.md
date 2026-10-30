# Bit-Flipping Attacks

## Nedir?
Bit-flipping saldırısında saldırgan, şifreli bir paketin içeriğini **çözmeden**, sadece belirli bitlerini çevirerek (0→1, 1→0) çözüldüğünde ortaya çıkacak açık metni **öngörülebilir şekilde değiştirir.** Anahtarı bilmesine gerek yoktur; paketi okuyamaz bile — ama değiştirebilir. Bu, akış şifrelemelerinde (WEP'in RC4'ü gibi) ve bütünlük kontrolü zayıf olan sistemlerde mümkün olur.

## Hedeflediği zafiyet
İki özellik bir araya gelir:
- **Akış şifrelemesinin doğrusallığı:** Şifreli metindeki bir biti çevirmek, çözülen açık metinde tam olarak aynı konumdaki biti çevirir. Yani saldırgan, şifreli veride nokta atışı değişiklik yapabilir.
- **Zayıf bütünlük kontrolü:** WEP'in kullandığı CRC-32 (ICV) doğrusal bir fonksiyondur. Saldırgan payload'daki bitleri çevirirken, ICV'yi de buna uygun şekilde yeniden hesaplayıp düzeltebilir. Böylece değiştirilmiş paket "bütünlüğü bozulmamış" gibi görünür ve alıcı onu kabul eder.

Kısacası CRC-32, kazara oluşan hataları yakalamak için iyidir ama **kasıtlı manipülasyonu** yakalamak için tasarlanmamıştır — bit-flipping tam olarak bu boşluğu kullanır.

## Nasıl çalışır?
1. Saldırgan şifreli bir çerçeveyi yakalar (içeriğini okuyamaz ama yapısını/konumlarını tahmin edebilir).
2. Değiştirmek istediği alandaki bitleri çevirir.
3. CRC-32'nin doğrusallığından yararlanarak ICV'yi de düzeltir, böylece paket geçerli görünür.
4. Değiştirilmiş paketi ağa gönderir; alıcı onu çözdüğünde saldırganın istediği değişmiş veriyi elde eder.

## Diğer saldırılardan farkı
WEP injection **yeni geçerli paketler üretir**; bit-flipping ise **var olan bir paketi** değiştirir. Replay saldırıları paketi hiç değiştirmeden tekrar gönderir; bit-flipping ise içeriği kasıtlı olarak değiştirir. Ortak nokta, hepsinin WEP'in zayıf bütünlük/şifreleme tasarımından beslenmesidir.

## Savunma
- **WEP'i bırakıp WPA2 (CCMP/AES) veya WPA3 kullanmak.** Bu protokollerde bütünlük, doğrusal bir CRC ile değil **kriptografik bir MIC (Message Integrity Code)** ile sağlanır; bir biti çevirmek MIC'i geçersiz kılar ve paket reddedilir.
- Genel ilkeyle: bütünlük kontrolü olarak CRC gibi doğrusal, kriptografik olmayan fonksiyonlara güvenmemek.

> **Ayırt etmek için:** Saldırgan paketi çözmeden, **bitlerini çevirerek içeriği değiştiriyor** ve zayıf ICV/CRC sayesinde fark edilmiyorsa konu bit-flipping'dir.
