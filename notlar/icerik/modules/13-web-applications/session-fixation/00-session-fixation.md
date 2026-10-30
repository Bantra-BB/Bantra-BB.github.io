# Session Fixation

## Nedir?

Session fixation, saldırganın, kurban **giriş yapmadan önce** bir session id belirleyip (fixate) kurbanın tarayıcısına sabitlemesi ve kurban o id ile giriş yaptıktan sonra **aynı id'yi kullanarak** oturumu devralmasıdır. Saldırgan oturum kimliğini *çalmaz*; onu önceden *belirler*.

Kök neden: Uygulama, kullanıcı giriş yaptığında (ayrıcalık seviyesi anonim → authenticated değiştiğinde) **session id'yi yenilemez**. Giriş öncesi anonim oturum id'si, giriş sonrası kimlik doğrulanmış oturum için de geçerli kalır. Saldırgan bu id'yi önceden bildiği için, kurban giriş yapınca aynı id authenticated hale gelir ve saldırgan da o id ile içeri girer.

## Ön koşullar

- Uygulama, başarılı girişte session id'yi **regenerate etmiyor**.
- Saldırgan, kurbanın kullanacağı session id'yi önceden **belirleyebiliyor/enjekte edebiliyor** (URL parametresi, `Set-Cookie`, XSS vb.).

## Saldırı adımları

1. **Bir session id elde et.** Saldırgan siteye kendi girip geçerli bir anonim oturum id'si alır (ya da uygulama istemciden gelen id'yi kabul ediyorsa bir değer belirler).

2. **Session id'yi kurbana sabitle.** Yaygın yöntemler:
   - Session id'yi URL'de taşıyan uygulamalarda, id'yi içeren bir bağlantı gönderme: `https://hedef-site.com/login;jsessionid=FIXED` veya `https://hedef-site.com/?sid=FIXED`.
   - Cookie enjeksiyonu: XSS veya kontrol edilen bir subdomain üzerinden `document.cookie`/`Set-Cookie` ile session id'yi kurbanın tarayıcısına yazma.

3. **Kurban giriş yapar.** Kurban, saldırganın belirlediği id ile (çoğu zaman farkında olmadan) siteye gelir ve kimlik doğrular.

4. **Id authenticated olur.** Uygulama girişte id'yi yenilemediği için, saldırganın bildiği id artık kimlik doğrulanmış oturuma karşılık gelir.

5. **Oturumu devral.** Saldırgan aynı session id'yi kendi tarayıcısında kullanarak kurbanın oturumuna erişir.

## Session Fixation vs Session Hijacking

- **Hijacking:** Saldırgan, var olan bir oturumun id'sini **çalar** (sniffing, XSS).
- **Fixation:** Saldırgan id'yi **önceden belirler** ve kurbanın o id ile authenticate olmasını sağlar; çalmaya gerek kalmaz.

## Eksik olan kontrol

Uygulama, ayrıcalık seviyesi değiştiğinde (anonim → authenticated) session id'yi yenilemez. Oturum kimliği, kimlik doğrulama sınırını geçerken mutlaka değişmelidir.

## Savunma

1. **Girişte session id'yi yenile (en kritik).** Başarılı kimlik doğrulamadan hemen sonra yeni, rastgele bir session id üret ve eskisini geçersiz kıl (ör. PHP `session_regenerate_id(true)`).
2. **Session id'yi yalnızca sunucu üretsin.** Id'yi URL'de taşıma; yalnızca cookie kullan ve istemciden gelen keyfi id'yi kabul etme.
3. **Güvenli cookie öznitelikleri:** `HttpOnly`, `Secure`, `SameSite`.
4. **Oturum yönetimi:** timeout uygula; logout'ta ve hassas ayrıcalık değişiminde id'yi geçersiz kıl.
5. **Hassas işlemlerde yeniden kimlik doğrulama** iste.
