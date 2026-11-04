# Disassociation Attacks

## Nedir?
Disassociation saldırısı, saldırganın sahte **disassociation (bağlantı sonlandırma)** çerçeveleri göndererek bir istemciyi ya da istemcileri AP'den koparmasıdır. 802.11'de disassociation, bir istemci ile AP arasındaki **association** ilişkisini normal şartlarda sonlandırmak için kullanılan meşru bir yönetim çerçevesidir; saldırgan bunun sahtesini üretip bağlantıyı zorla düşürür. Bir DoS türüdür.

## Hedeflediği zafiyet
Klasik 802.11'de yönetim çerçeveleri (disassociation dahil) **şifrelenmez ve kaynağı doğrulanmaz.** Yani bir istemci veya AP, "bu disassociation gerçekten karşı taraftan mı geldi?" diye kontrol edemez. Saldırgan, hedefin MAC adresini taklit ederek sahte bir disassociation çerçevesi gönderir ve alıcı bunu geçerli sayıp bağlantıyı sonlandırır.

## Nasıl çalışır?
1. Saldırgan hedef AP'nin BSSID'sini ve kurban istemcinin MAC adresini öğrenir (dinleyerek).
2. Bu adresleri kaynak/hedef olarak kullanan sahte disassociation çerçeveleri üretir.
3. Çerçeveyi gönderince istemci ağdan düşer. Saldırgan bunu sürekli tekrarlarsa istemci tekrar tekrar kopar ve pratikte hizmet alamaz.
4. Hedef tek istemci yerine "broadcast" seçilirse, AP'ye bağlı tüm istemciler etkilenebilir.

## Deauthentication ile farkı
Disassociation ve deauthentication çok benzer ve sık karıştırılır; ikisi de istemciyi düşürür ama 802.11 durum makinesinde farklı noktaları hedefler:

- **Disassociation:** Yalnızca **association** ilişkisini sonlandırır. İstemci hâlâ "authenticated" durumda kalabilir, sadece yeniden associate olması gerekir.
- **Deauthentication:** Daha köklüdür — hem authentication hem association'ı iptal eder. İstemcinin baştan tüm bağlanma sürecini tekrarlaması gerekir.

Pratikte deauth daha "sert" bir koparma olduğu için saldırganlarca daha çok tercih edilir; disassociation ise aynı mantığın association katmanındaki biçimidir.

## Savunma
- **802.11w (Protected Management Frames / PMF):** Yönetim çerçevelerini koruyarak sahte disassociation/deauth çerçevelerini geçersiz kılar. En etkili önlemdir; WPA3'te zorunludur.
- **WIDS/WIPS:** Anormal disassociation seli ve sahte çerçeveleri tespit etmek.
- WPA2'de PMF'yi (destekleniyorsa) etkinleştirmek; mümkünse WPA3'e geçmek.

> **Ayırt etmek için:** Sahte çerçeve **disassociation** ise ve yalnızca association'ı koparıyorsa konu disassociation saldırısıdır; hem auth hem association iptal ediliyorsa deauthentication'dır.
