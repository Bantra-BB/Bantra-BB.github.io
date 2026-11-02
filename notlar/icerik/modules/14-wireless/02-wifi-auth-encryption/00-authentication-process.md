# Wi-Fi Authentication Process

## Bağlanma sürecinin aşamaları
Bir istemci bir AP'ye bağlanırken 802.11 düzeyinde sırasıyla şu adımlardan geçer:

1. **Discovery (keşif):** İstemci ya AP'nin yaydığı **beacon** çerçevelerini pasif olarak dinler, ya da **probe request** gönderip AP'lerden **probe response** alır.
2. **802.11 Authentication:** Adı yanıltıcıdır — bu, modern anlamda bir kimlik doğrulama değil, bağlanmanın ilk el sıkışmasıdır. İki klasik yöntemi vardır (aşağıda).
3. **Association:** İstemci AP'ye "sana bağlanıyorum" der (association request), AP kabul eder (association response) ve istemciye bir **AID (Association ID)** verir. Artık istemci o BSS'in üyesidir.
4. **Asıl güvenlik el sıkışması:** WPA/WPA2/WPA3'te gerçek kimlik doğrulama ve anahtar üretimi burada olur (ör. WPA2'nin **4-way handshake**'i). WEP'te ise bu adım yoktur; şifreleme doğrudan paylaşılan anahtarla yapılır.

Yani 802.11'in kendi "authentication" adımı ile WPA2/WPA3'ün gerçek kimlik doğrulaması farklı şeylerdir — sınavda ve okumalarda bu ayrım önemlidir.

## İki klasik 802.11 authentication yöntemi
WEP döneminden gelen iki temel yöntem:

| Yöntem | Nasıl çalışır | Güvenlik |
|---|---|---|
| **Open System Authentication** | İstemci herhangi bir doğrulama kanıtı göstermeden "kimlik doğrulandı" sayılır; erişim kontrolü (varsa) sonraki katmana bırakılır | Kimlik açısından hiçbir şey doğrulamaz |
| **Shared Key Authentication** | AP bir challenge (meydan okuma metni) gönderir, istemci onu WEP anahtarıyla şifreleyip geri yollar | Paradoksal olarak **daha zayıftır** (aşağıda) |

**Önemli paradoks:** Shared Key, "anahtarı kanıtlat" dediği için daha güvenli sanılır ama değildir. Challenge metni açık (plaintext) gönderilir, istemcinin şifreli cevabı da havada görülür. Saldırgan ikisini birden yakalayıp XOR'layarak o challenge'a ait **keystream**'i elde eder — bu da WEP'i kırmayı kolaylaştırır. Bu yüzden WEP'te, çelişkili biçimde, Open System genellikle Shared Key'den daha az bilgi sızdırır.

## Enterprise authentication (802.1X / EAP)
Kurumsal ortamda kimlik doğrulama, paylaşılan tek bir parolaya (PSK) değil, **kullanıcı/cihaz bazlı** kimliklere dayanır. Bunun çerçevesi **802.1X**'tir ve üç rol vardır:

- **Supplicant:** Bağlanmak isteyen istemci.
- **Authenticator:** AP — kapıda bekçi gibi, trafiği RADIUS'a taşır.
- **Authentication Server (RADIUS):** Kimlik kararını veren sunucu.

Aralarındaki mesajlaşma **EAP (Extensible Authentication Protocol)** ile yapılır; "extensible" (genişletilebilir) çünkü birçok EAP yöntemi vardır (sertifika tabanlı, parola tabanlı, tünelli vb.). Kimlik başarıyla doğrulandığında RADIUS sunucusu AP'ye onay (Access-Accept) gönderir ve şifreleme anahtarları üretilir. (İlgili saldırılar: `03-wireless-threats/02-integrity-attacks/04-extensible-ap-replay.md` ve `07-radius-replay.md`.)

## Personal vs Enterprise
WPA/WPA2/WPA3 iki modda sunulur:

| | Personal (PSK) | Enterprise (802.1X) |
|---|---|---|
| Kimlik | Herkese ortak tek parola (PSK) | Kullanıcı/cihaz bazlı kimlik |
| Arka uç | Yok | RADIUS sunucusu |
| Kullanım | Ev, küçük ofis | Kurum |
| Avantaj | Basit kurulum | Kişi bazlı iptal, güçlü doğrulama, sahte AP'ye direnç |

Enterprise mod, sunucu sertifikası doğrulaması sayesinde evil twin gibi sahte AP saldırılarına karşı da belirgin biçimde dayanıklıdır — çünkü istemci yalnızca sinyale değil, AP'nin arkasındaki doğrulanmış kimliğe güvenir.

## Özet
- **Authentication** ağa girişi, **encryption** veriyi korur; güvenlik protokolleri ikisini birlikte tanımlar.
- Bağlanma sırası: discovery → 802.11 auth → association → (WPA/WPA2/WPA3'te) gerçek güvenlik el sıkışması.
- WEP'in iki klasik yöntemi Open System ve Shared Key; Shared Key paradoksal olarak keystream sızdırdığı için daha zayıftır.
- Kurumsal ortamda kimlik **802.1X + EAP + RADIUS** üçlüsüyle, kullanıcı bazlı yapılır.
- Her protokol **Personal (PSK)** ve **Enterprise (802.1X)** olarak sunulur.
