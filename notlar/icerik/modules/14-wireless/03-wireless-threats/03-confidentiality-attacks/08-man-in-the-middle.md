# Man-in-the-Middle Attack

## Nedir?
Man-in-the-middle (MITM, "ortadaki adam"), saldırganın **istemci ile AP (veya istemci ile hedef sunucu) arasına girip** tüm trafiği kendi üzerinden geçirmesidir. Saldırgan her iki tarafa da "ben karşı tarafım" izlenimi verir; trafik onun üzerinden aktığı için hem **dinleyebilir (gizlilik)** hem de **değiştirebilir (bütünlük)**. Bu yüzden MITM, pek çok kablosuz saldırının buluştuğu güçlü bir konumdur.

## Hedeflediği zafiyet
MITM, iki tarafın birbirinin **gerçek kimliğini doğrulamaması** zafiyetine dayanır. İstemci bağlandığı AP'nin gerçekten o AP olduğunu, sunucu da karşısındakinin gerçek istemci olduğunu güçlü biçimde doğrulamıyorsa, saldırgan ikisinin arasına sızabilir. Kablosuz ortamda bu konum genelde sahte bir AP (evil twin/honeypot) ile ya da trafiği yönlendiren tekniklerle elde edilir.

## Nasıl çalışır?
1. Saldırgan araya girecek konumu kurar — tipik olarak kurbanı sahte bir AP'ye çekerek (evil twin → kurban saldırganın AP'sine bağlanır) ya da trafiği kendine yönlendirerek.
2. Kurbanın trafiği saldırganın üzerinden gerçek ağa/internete aktarılır; kurban her şeyin normal olduğunu sanır.
3. Saldırgan bu konumdan trafiği dinler (parola, çerez, oturum bilgisi) ve gerekirse içeriği değiştirir (sahte sayfa enjekte etme, yönlendirme vb.).

## Diğer saldırılardan farkı
Eavesdropping **pasiftir** — saldırgan sadece dinler, trafiğe dokunmaz. MITM ise **aktiftir** — saldırgan akışın ortasındadır ve onu yönlendirir/değiştirebilir. Evil twin ve honeypot, çoğu zaman MITM konumunu **elde etmenin yoludur**; MITM ise o konumda **yapılan iştir**. Session hijacking ve masquerading de sıklıkla MITM sayesinde elde edilen veriyle gerçekleştirilir. Yani MITM, bu kategorideki birçok saldırının ortak zeminidir.

## Savunma
- **Uçtan uca TLS/HTTPS:** Sunucu sertifikası doğrulandığı için saldırgan araya girse bile trafiği okuyamaz/değiştiremez. MITM'e karşı en belirleyici önlem budur.
- **WPA2/WPA3-Enterprise + sunucu sertifikası doğrulaması:** İstemcinin yalnızca gerçek AP'ye güvenmesini sağlayarak sahte AP üzerinden MITM'i engeller.
- Gereksiz açık ağlara ve bilinen SSID'lere otomatik bağlanmayı kısıtlamak.
- **WIDS/WIPS** ile sahte AP ve anormal yönlendirme/ARP davranışını tespit etmek; hassas erişimde VPN kullanmak.

> **Ayırt etmek için:** Saldırgan trafiği sadece dinlemekle kalmayıp **istemci ile AP/sunucu arasına girip akışı kendi üzerinden geçiriyorsa** konu MITM'dir.
