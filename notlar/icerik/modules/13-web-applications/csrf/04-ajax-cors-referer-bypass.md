# CSRF — AJAX, CORS ve Referer Atlatma Teknikleri

Bu not, CSRF'nin AJAX (XMLHttpRequest) ile sömürülmesini ve bazı savunmaların
(CORS politikası, Referer kontrolü) nasıl atlatıldığını anlatır. Temel saldırı
için bkz. `01-saldiri-adimlari.md`, savunma için bkz. `02-tespit-ve-savunma.md`.

## XMLHttpRequest (AJAX) ile CSRF

Saldırgan, otomatik gönderilen bir form yerine JavaScript'te **XMLHttpRequest
(XHR)** ile de isteği kurbanın tarayıcısına yaptırabilir. İstek arka planda
(asenkron) gittiği için kullanıcı hiçbir şey fark etmez.

```html
<script>
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://hedef-site.com/updatepassword', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.withCredentials = true;            // oturum cookie'si de gitsin
  xhr.send('action=execute&parameter=value');
</script>
```

**Önemli nüans (SOP ile ilişkisi):** Same-Origin Policy, saldırgan sayfasının
cross-origin **yanıtı okumasını** engeller; ama isteğin **gönderilmesini**
engellemez. CSRF'de amaç yanıtı okumak değil, sunucuda durum değiştirmek olduğu
için, yanıt okunamasa bile işlem gerçekleşir.

İki ayrı durumu karıştırmamak gerekir:

- **Basit (simple) istek:** Sadece `GET/POST/HEAD`, basit `Content-Type`
  (`application/x-www-form-urlencoded`, `text/plain`, `multipart/form-data`) ve
  **özel header yok**. Bu istekler cross-origin'de **preflight olmadan** gider ve
  cookie taşır → klasik CSRF bu kategoridedir.
- **Özel header'lı istek:** `X-Requested-With: XMLHttpRequest` gibi bir header
  veya `application/json` gibi bir içerik tipi eklenirse, tarayıcı önce bir
  **CORS preflight (OPTIONS)** isteği atar. Sunucu bu header'a/origin'e izin
  vermiyorsa asıl istek **hiç gönderilmez**. Dolayısıyla "`X-Requested-With`
  zorunlu" gibi bir kontrol, ancak CORS yanlış yapılandırılmışsa atlatılır
  (aşağıya bkz.).

## SOP ve CORS Bypass

CORS, belirli cross-origin isteklere izin vermek için sunucunun döndürdüğü
başlıklarla çalışır. Yanlış yapılandırma, saldırgana kapı açar.

```php
// Zafiyetli sunucu yapılandırması
header('Access-Control-Allow-Origin: *');   // her origin'e izin
// ... anti-CSRF önlemi yok, e-posta güncelleyen kod ...
```

Doğru anlaşılması gereken iki nokta:

1. **`Access-Control-Allow-Origin: *` tek başına credential'lı CSRF sağlamaz.**
   `*` ile tarayıcı **cookie/credential göndermez**; ayrıca `*` ile
   `Access-Control-Allow-Credentials: true` **birlikte kullanılamaz** (CORS
   spesifikasyonu yasaklar). Bu yüzden `*` daha çok **veri sızıntısı** (cross-origin
   yanıt okuma) riskidir.
2. **Asıl tehlikeli yanlış yapılandırma: origin yansıtma (reflection) +
   credentials.** Sunucu, gelen `Origin` başlığını doğrulamadan yanıta
   kopyalıyorsa ve `Access-Control-Allow-Credentials: true` veriyorsa, saldırgan
   kendi origin'inden **cookie'li** cross-origin istek atıp yanıtı da okuyabilir:

   ```
   Access-Control-Allow-Origin: https://attacker.com   (gelen Origin aynen yansıtılmış)
   Access-Control-Allow-Credentials: true
   ```

   Bu durumda özel header'lı XHR istekleri de (preflight geçtiği için) çalışır.

## Referer Header Bypass

Bazı uygulamalar, CSRF'ye karşı yalnızca **Referer** başlığının kendi domain'iyle
eşleşmesini kontrol eder. Bu tek başına zayıf bir savunmadır:

- **Referer yoksa kabul ediliyorsa:** Saldırgan başlığı tamamen kaldırabilir.
  Örn. payload sayfasına `<meta name="referrer" content="no-referrer">` koymak,
  ya da privacy araçları/eklentiler başlığı zaten silebilir. Başlık yokken istek
  kabul ediliyorsa kontrol anlamsızlaşır.
- **Zayıf eşleştirme (substring) yapılıyorsa:** Kontrol sadece domain'in string
  olarak geçip geçmediğine bakıyorsa atlatılabilir:
  - `https://attacker.com/?hedef-site.com`  (domain query'de geçiyor)
  - `https://hedef-site.com.attacker.com/`  (domain prefix olarak geçiyor)

## Savunma

1. **Asıl savunma anti-CSRF token'dır** (synchronizer token, bkz. `02`). AJAX,
   CORS ve Referer kontrolleri tek başına yeterli değildir.
2. **CORS'u sıkı yapılandır:** Origin'i yansıtma; yalnızca bilinen güvenilir
   origin'lere izin ver. `Access-Control-Allow-Credentials: true` yalnızca
   doğrulanmış origin'lerle kullanılmalı, asla `*` ile birlikte değil.
3. **Referer/Origin kontrolünü yalnızca destek katmanı olarak kullan:** Başlık
   yoksa isteği **reddet**, substring değil tam origin eşleşmesi yap. `Origin`
   başlığı Referer'a göre daha güvenilirdir.
4. **`SameSite=Strict` cookie** ile katmanlı savunma (bkz. `04`).
5. Özel header zorunluluğu (`X-Requested-With`) bir destek önlemidir; CORS doğru
   yapılandırıldığında işe yarar, tek başına güvenilmez.
