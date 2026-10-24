# CSRF — Tespit ve Savunma

Bu not, CSRF'nin pentester gözüyle nasıl test edildiğini ve secure coder gözüyle
nasıl önlendiğini özetler. Saldırı teknikleri için bkz. `01-saldiri-adimlari.md`,
`03-double-submit-cookie-bypass.md`, `04-samesite-ve-bypass.md`,
`05-ajax-cors-referer-bypass.md`.

## Tespit (Pentester / Red Team)

- **CSRF testi:** Durum değiştiren işlemlerde (şifre/e-posta değiştirme, transfer)
  manipüle edilmiş istekler göndererek yetkisiz eylemin gerçekleşip gerçekleşmediğini
  dene; uygulanan korumanın etkinliğini ölç.
- **Boundary / token doğrulaması:** Her form ve istekte anti-CSRF token'ın **var
  olduğunu ve sunucu tarafında gerçekten doğrulandığını** kontrol et. Token'ı
  kaldırıp/boş bırakıp/başka kullanıcının token'ıyla değiştirip isteğin hâlâ kabul
  edilip edilmediğine bak. Token tahmin edilebilir mi (kodlanmış bilinen değer)?
- **Güvenlik başlıkları analizi:** `Origin`/`Referer` kontrolü, `SameSite` cookie
  özniteliği, CORS başlıkları ve CSP'nin varlığı ve doğruluğunu incele. Zayıf
  eşleştirme veya başlık yokken kabul gibi açıkları ara.
- **Oturum yönetimi testi:** Oturum token'larının güvenli üretildiğini, iletildiğini
  ve doğrulandığını değerlendir.
- **Sömürü senaryoları:** Gizli görsel/link (`<img>`/`<a>`), otomatik gönderilen
  form, AJAX/XHR, CORS/Referer atlatma gibi farklı vektörleri dene; savunmadaki
  boşlukları ortaya çıkar.

## Savunma (Secure Coder)

1. **Anti-CSRF token (asıl savunma).** Durum değiştiren her forma/isteğe benzersiz
   ve **tahmin edilemez** bir token ekle; token'ı sunucu tarafında oturuma bağlı
   (synchronizer token) üret ve her istekte doğrula. Geçersiz/eksik token → reddet.
   Token'ı bilinen bir veriden türetme; CSPRNG kullan (bkz. `03`).

2. **SameSite cookie özniteliği.** Hassas/durum cookie'lerinde açıkça
   `SameSite=Strict` (veya uygunsa `Lax`) ayarla; varsayılana güvenme. Cross-site
   isteklerde cookie'nin otomatik gönderimini kısıtlar (bkz. `04`).

3. **Referrer Policy ve Origin kontrolü.** Sıkı bir referrer politikası uygula;
   `Origin`/`Referer` kontrolünde başlık yoksa isteği **reddet** ve substring değil
   **tam origin** eşleşmesi yap. Bu bir destek katmanıdır, token'ın yerini tutmaz
   (bkz. `05`).

4. **Content Security Policy (CSP).** Güvenilir içerik kaynaklarını tanımlayıp
   zorlayarak, CSRF'yi tetiklemek için kullanılan zararlı script enjeksiyonu
   (XSS) riskini azalt.

5. **Double-Submit Cookie deseni (güvenli haliyle).** Token hem cookie'de hem
   istek parametresinde tutulup karşılaştırılacaksa, token **imzalı/HMAC'li ve
   tahmin edilemez** olmalı; cookie `__Host-` önekiyle set edilerek subdomain
   enjeksiyonu engellenmeli (bkz. `03`).

6. **CORS'u sıkı yapılandır.** Gelen `Origin`'i doğrulamadan yansıtma;
   `Access-Control-Allow-Credentials: true` yalnızca bilinen origin'lerle, asla
   `*` ile birlikte kullanılmamalı (bkz. `05`).

7. **CAPTCHA.** Özellikle kimlik doğrulama, form gönderimi ve hesap oluşturma gibi
   kritik akışlarda ek bir doğrulama katmanı olarak kullanılabilir.

## Katmanlı savunma özeti

Tek bir önleme güvenme. Pratikte güçlü kombinasyon: **synchronizer CSRF token +
`SameSite=Strict` cookie + sunucu tarafı `Origin` kontrolü + durum değiştiren
işlemlerde yalnızca POST.** CSP, CORS sıkılaştırması ve (gerektiğinde) CAPTCHA
bunu tamamlar.
