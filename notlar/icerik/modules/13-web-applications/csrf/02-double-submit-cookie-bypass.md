# CSRF — Double Submit Cookie Bypass

## Double Submit Cookie nedir?

CSRF token'ı sunucu tarafında oturuma bağlı saklamak yerine, bu yöntemde sunucu token'ı kullanıcıya **iki yerde** gönderir:

- `csrf-token` adlı bir **cookie** olarak,
- form içinde gizli bir **alan** olarak.

İstek geldiğinde sunucu, **cookie'deki değer ile form alanındaki değerin aynı olup olmadığını** karşılaştırır; aynıysa isteği meşru sayar.

```php
// Sunucu tarafı doğrulama
if ($_POST["csrf_token"] === $_COOKIE["csrf-token"]) {
    // isteği işle
}
```

Yöntem şu varsayıma dayanır: "Saldırgan form alanına doğru token'ı yazamaz, çünkü başka origin'den cookie değerini okuyamaz." Bu varsayım aşağıdaki durumlarda çöker:

- Token **tahmin edilebilir/geri çevrilebilir** üretilmişse,
- Saldırgan **cookie'yi enjekte edebiliyorsa** (ör. kontrolündeki bir subdomain'den),
- **XSS** ile token okunabiliyorsa,
- MITM ile token yakalanabiliyorsa.

Aşağıdaki saldırı, ilk ikisini zincirler.

## Zafiyet 1 — Tahmin edilebilir token

Token, gizli ve rastgele bir değer yerine **bilinen bir veriden türetilmişse** (örneğin kullanıcı/hesap numarasının base64'ü) saldırgan token'ı üretebilir. Önemli nokta: `base64`, `hex` gibi **kodlamalar şifreleme değildir** — kodlanmış bir değer "secret" sayılmaz, geri çevrilip formülü çıkarılabilir.

```
Token örneği:  R0I4Mk1ZQkFOS...   ->  base64 decode  ->  bilinen bir kimlik değeri
```

Saldırgan kendi hesabındaki token'ı (ör. tarayıcı Inspect → Application → Cookies) alıp bir araçla (ör. CyberChef) çözerek bu ilişkiyi tespit eder; ardından kurbanın token'ını da aynı formülle üretir.

## Zafiyet 2 — Subdomain üzerinden cookie enjeksiyonu

Tarayıcıda bir subdomain, `domain` özniteliğini üst (parent) domain olarak ayarlayarak **parent domain için cookie set edebilir**. Saldırgan kontrolündeki bir subdomain, hedef domaine gidecek isteklerde taşınacak `csrf-token` cookie'sini kendi belirlediği değere ayarlar:

```php
setcookie('csrf-token', base64_encode("ATTACKER_VALUE"), [
    'domain'   => 'hedef-site.com',   // parent domain için set ediliyor
    'path'     => '/',
    'samesite' => 'Lax',
]);
```

## Saldırı adımları

1. **Token üretimini analiz et.** Token'ı ele geçirip (kendi oturumundan) çöz; bilinen bir veriden türetiliyorsa (tahmin edilebilirse) saldırı mümkündür.

2. **Cookie enjeksiyonunu doğrula.** Saldırganın, hedefin bir subdomain'ini kontrol edip edemediğini ve oradan parent domain için cookie set edilip edilemediğini tespit et.

3. **Payload sayfasını hazırla.** Saldırgan kontrolündeki subdomain'de, hedefin **gerçek** endpoint'ine otomatik gönderilen bir form barındır. Form, gizli `csrf_token` alanını saldırganın hesapladığı değere ayarlar:

   ```html
   <form method="post" action="https://hedef-site.com/changepassword" id="f">
     <input name="current_password" value="...">
     <input name="confirm_password" value="ATTACKER_PASSWORD">
     <input type="hidden" name="csrf_token" value="HESAPLANAN_TOKEN">
   </form>
   <script>document.getElementById('f').submit();</script>
   ```

4. **Aynı sayfada cookie'yi enjekte et.** Sayfa, parent domain için `csrf-token` cookie'sini form alanındaki değerle **aynı** olacak şekilde set eder (Zafiyet 2). Böylece istek gittiğinde cookie tarafı da saldırganın kontrolünde olur.

5. **Kurbana ulaştır.** Sosyal mühendislikle kurbanı bu sayfaya çek. Kurban hedef sitede oturumu açıkken sayfa açılır ve form otomatik gönderilir.

6. **Sunucu isteği kabul eder.** İstek gerçek endpoint'e gider; tarayıcı oturum cookie'sini ve saldırganın enjekte ettiği `csrf-token` cookie'sini taşır. Sunucu, cookie ile form alanını karşılaştırır — ikisi de saldırganın kontrolünde ve eşit olduğu için istek işlenir (ör. şifre değiştirilir).

   ```php
   // Her iki değer de saldırgan kontrolünde ve eşit -> kabul
   if (base64_decode($_POST["csrf_token"]) == base64_decode($_COOKIE["csrf-token"])) {
       // şifreyi güncelle
   }
   ```

## Eksik olan kontrol

Sunucu kullanıcıyı (oturumu) doğru doğruluyordu; ancak **CSRF token tahmin edilebilirdi** ve **cookie subdomain'den enjekte edilebiliyordu**. Double Submit mantığı "saldırgan doğru token'ı bilemez ve cookie'yi set edemez" varsayımına dayanır; iki varsayım da çökünce koruma tamamen devre dışı kalır.

## Savunma

1. **Token tahmin edilemez olmalı.** Token, bilinen bir veriden türetilmemeli; CSPRNG ile rastgele üretilip **sunucu tarafında oturuma bağlanmalıdır** (synchronizer token pattern). Double Submit kullanılacaksa token en azından **HMAC/imza** ile korunmalıdır.
2. **Cookie enjeksiyonunu engelle.** Cookie adını `__Host-` önekiyle kullan (ör. `__Host-csrf`); bu önek, cookie'nin bir subdomain'den parent için set edilmesini ve `domain` özniteliğiyle taşınmasını engeller.
3. **Katmanlı savunma:** `SameSite=Strict/Lax` cookie + `Origin`/`Referer` kontrolü + durum değiştiren işlemlerde yalnızca POST.

Kısaca zincir: **zayıf token üretimi (kodlama ≠ şifreleme) + subdomain cookie enjeksiyonu → Double Submit Cookie bypass.**

