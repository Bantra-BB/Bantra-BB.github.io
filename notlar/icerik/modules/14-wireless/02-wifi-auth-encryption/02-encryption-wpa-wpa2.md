# WPA / WPA2

## Nedir?
WPA (Wi-Fi Protected Access) ve halefi WPA2, WEP'in çöküşünün ardından gelen şifreleme protokolleridir. **WPA (2003)**, WEP'i acilen değiştirmek için tasarlanmış bir **geçici köprüydü** — eski WEP donanımında yazılım güncellemesiyle çalışabilsin diye hâlâ RC4 tabanlıydı ama **TKIP** ile güçlendirildi. **WPA2 (2004)**, kalıcı çözümdür: RC4/TKIP'i bırakıp **AES tabanlı CCMP**'ye geçti ve yıllarca varsayılan Wi-Fi güvenliği oldu.

## WPA — TKIP ile geçici yama
TKIP (Temporal Key Integrity Protocol), WEP'in kusurlarını eski donanımı değiştirmeden kapatmaya çalıştı:
- **Her paket için anahtar karıştırma (per-packet key mixing):** Aynı anahtarın tekrar tekrar aynı şekilde kullanılmasını engeller.
- **Genişletilmiş ve sıralı IV (TSC):** IV'yi büyütüp bir sayaç gibi kullanarak replay'i zorlaştırır.
- **MIC (Message Integrity Check — "Michael"):** WEP'in doğrusal CRC-32'si yerine gerçek bir bütünlük kontrolü ekler.

TKIP, WEP'ten çok daha iyiydi ama hâlâ RC4 üzerine kurulu olduğu için uzun vadede güvenli sayılmaz. Bugün TKIP de **eski/zayıf** kabul edilir ve kullanılmamalıdır.

## WPA2 — CCMP/AES ile kalıcı çözüm
WPA2'nin kalbi **CCMP**'dir (Counter Mode with CBC-MAC Protocol) ve **AES** blok şifrelemesine dayanır. Bu, WEP/TKIP'in RC4'ünden tamamen farklı, güçlü bir temeldir:
- **AES şifreleme:** Keystream yeniden kullanımı ve zayıf anahtar sorunları yoktur.
- **Kriptografik bütünlük (MIC):** Paket üzerinde kasıtlı değişiklik (bit-flipping gibi) yakalanır ve reddedilir.
- **Paket numarası (PN) ile replay koruması:** Her pakete artan bir numara eklenir; tekrarlanan paketler reddedilir, böylece data replay engellenir.

Bu üçü sayesinde WEP'i ve TKIP'i deşen integrity/confidentiality saldırılarının büyük kısmı WPA2-CCMP'de geçersiz kalır.

## 4-Way Handshake
WPA/WPA2-Personal'da istemci ile AP, ortak parolayı (PSK) havada hiç göndermeden, oturuma özel şifreleme anahtarları üretmek için **4-way handshake** yapar. Çok kısaca:
1. Taraflar PSK'den türetilen bir ana anahtara (PMK) sahiptir.
2. Dört mesajlık el sıkışmada rastgele değerler (nonce) değiş tokuş edilir ve bunlardan oturuma özel **PTK** üretilir.
3. Böylece her oturum farklı anahtarlar kullanır; parola doğrudan havada görünmez.

**Kritik zafiyet:** Bu handshake havada yakalanabilir. Saldırgan handshake'i (gerekirse bir istemciyi deauth ile düşürüp yeniden bağlanmaya zorlayarak) yakalar ve **çevrimdışı (offline)** olarak parolayı tahmin etmeye çalışır — sözlük/kaba kuvvet saldırısıyla. Yani WPA2-Personal'ın gerçek zayıf noktası protokolün matematiği değil, **zayıf/tahmin edilebilir parolalardır.** Güçlü ve uzun bir parola, bu saldırıyı pratikte imkânsız kılar. (İlgili: `03-wireless-threats/05-authentication-attacks`.)

## WPA2-Personal vs WPA2-Enterprise
- **Personal (PSK):** Herkes aynı parolayı paylaşır; 4-way handshake PSK'den türetilir. Ev/küçük ofis için.
- **Enterprise (802.1X):** Kimlik, RADIUS sunucusu üzerinden kullanıcı bazlı doğrulanır (bkz. `00-authentication-process.md`). Parola paylaşımı yoktur; handshake yakalayıp offline kırma Personal'daki kadar kolay işlemez. Kurumlar için önerilen moddur.

## Bilinen zayıflıklar
- **Zayıf PSK + handshake yakalama:** WPA2-Personal'ın başlıca riski (yukarıda).
- **KRACK (2017):** 4-way handshake'in yeniden kurulumunu (key reinstallation) istismar eden bir protokol açığıdır; bir dönem tüm WPA2 cihazlarını etkiledi, yamalarla kapatıldı. (Detay: `03-wireless-threats` altındaki KRACK notu.)
- **TKIP kullanımı:** WPA2'yi TKIP ile (geri uyumluluk için) çalıştırmak güvenliği düşürür; yalnızca CCMP/AES kullanılmalıdır.

## Savunma / en iyi uygulama
- **WPA2-CCMP (AES)** kullanmak; TKIP ve "WPA/WPA2 karışık" modlardan kaçınmak. Mümkünse **WPA3**'e geçmek.
- Personal modda **uzun, rastgele, tahmin edilmez bir parola** seçmek (offline kırmaya karşı tek gerçek savunma).
- Kurumsal ortamda **WPA2/WPA3-Enterprise (802.1X)** tercih etmek.
- Cihazları **KRACK** yamalarıyla güncel tutmak.

> **Ayırt etmek için:** TKIP + RC4 → WPA; CCMP + AES → WPA2. "4-way handshake yakalanıp offline kırılıyor" ise konu WPA/WPA2-Personal parolasıdır.
