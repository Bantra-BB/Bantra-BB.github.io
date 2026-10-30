# Evil Twin AP

## Nedir?
Evil twin ("kötü ikiz"), saldırganın **meşru bir AP'yi taklit eden sahte bir AP kurmasıdır.** Sahte AP, gerçek ağla aynı SSID'yi (çoğu zaman aynı BSSID'yi de) yayınlar; böylece kurbanların cihazları onu gerçek ağ sanıp bağlanır. Bağlanan trafiğin tamamı artık saldırganın üzerinden geçtiği için trafik dinlenebilir, kimlik bilgileri çalınabilir.

## Hedeflediği zafiyet
İstemcilerin varsayılan davranışı temel zafiyettir: bir cihaz, tanıdığı bir SSID'yi gördüğünde (özellikle daha güçlü sinyalle) ona otomatik bağlanma eğilimindedir ve çoğu zaman AP'nin **gerçekten o AP olup olmadığını doğrulamaz.** Karşılıklı kimlik doğrulama yoksa, aynı isimde sahte bir AP kurmak kurbanı kandırmak için yeterlidir.

## Nasıl çalışır?
1. Saldırgan hedef ağın SSID'sini (ve genelde BSSID'sini — bkz. MAC spoofing) öğrenir.
2. Aynı SSID ile sahte bir AP kurar, çoğu zaman daha güçlü sinyalle yayınlar.
3. Gerçek AP'ye bağlı kurbanları koparmak için deauthentication saldırısı gönderebilir; kurban yeniden bağlanırken sahte AP'ye düşer.
4. Kurban bağlandığında saldırgan trafiği dinler; sahte bir giriş/captive portal sayfasıyla parola toplayabilir.

## Diğer saldırılardan farkı
Evil twin, **belirli bir meşru AP'yi hedef alıp onu taklit eder** — amaç "şu kurumun ağıymış gibi görünmek". Honeypot AP ise belirli bir AP'yi taklit etmek yerine, **cazip/genel bir SSID** yayınlayıp rastgele kurbanları çeker. MITM, evil twin'in sağladığı konumun (araya girme) kullanıldığı bir sonraki adımdır; evil twin çoğu zaman MITM'e giden kapıdır. Masquerading'den farkı ise, evil twin'in bir **AP'yi**, masquerading'in bir **kullanıcı kimliğini** taklit etmesidir.

## Savunma
- **WPA2/WPA3-Enterprise + sunucu sertifikası doğrulaması:** İstemci yalnızca sertifikası geçerli olan gerçek AP'ye güvenir; aynı SSID'li sahte AP kabul edilmez. Evil twin'e karşı en etkili önlem budur.
- İstemcilerde açık ağlara ve bilinen SSID'lere otomatik bağlanmayı kısıtlamak.
- **WIDS/WIPS** ile ortamda aynı SSID'yi yayınlayan yetkisiz AP'leri tespit edip engellemek.
- Kullanıcı farkındalığı: beklenmedik yeniden bağlanma ve sahte giriş sayfalarına dikkat.

> **Ayırt etmek için:** Sahte AP, **belirli bir meşru ağı aynı SSID ile taklit ediyorsa** konu evil twin'dir.
