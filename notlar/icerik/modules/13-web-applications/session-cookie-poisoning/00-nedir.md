# Cookie / Session Poisoning

## Nedir?

Cookie / Session Poisoning, saldırganın **cookie'lerde veya oturum verisinde tutulan değerleri manipüle ederek** uygulamayı kandırmasıdır. Uygulama, cookie içindeki bir veriye (rol, kullanıcı id, yetki bayrağı, fiyat vb.) güvenip bunu sunucu tarafında doğrulamıyorsa, saldırgan bu değeri değiştirerek yetki yükseltir veya başka kullanıcı gibi davranır.

Kök neden: Güvenlik kararının, **istemci tarafında saklanan ve istemcinin değiştirebileceği** veriye dayandırılması. Cookie tarayıcıda tutulur; dolayısıyla saldırgan onu serbestçe değiştirebilir. "İstemciden gelen veriye güvenme" ilkesinin ihlalidir.

İki ana biçim:
- **Cookie poisoning / tampering:** Cookie değerinin doğrudan değiştirilmesi (ör. `role=user` → `role=admin`).
- **Session poisoning:** Sunucu tarafı oturumda tutulan veriye güvenilmeyen girdinin enjekte edilmesi (ör. bir forma girilen değerin session'a yazılıp sonradan "güvenli" sayılarak kullanılması).

## Alt teknikler

- **Cookie tampering:** `role`, `isAdmin`, `userid` gibi değerleri değiştirip yetki yükseltme veya başka hesaba erişim.
- **Cookie snooping:** Cookie'de hassas veri (düz metin şifre, kişisel bilgi) saklanıyorsa bunu okuma/çıkarma.
- **Pass-the-cookie:** Ele geçirilmiş geçerli bir oturum cookie'sini başka bir tarayıcıya taşıyıp oturumu devralma. Oturum zaten authenticated olduğu için bu yöntem çoğu zaman MFA'yı bile atlatır.

## Saldırı adımları

1. **Cookie'leri incele.** DevTools → Application → Cookies veya Burp ile hangi cookie'lerin olduğunu ve neyi kontrol ettiğini (rol, id, bayrak) tespit et.

2. **Format/kodlamayı çöz.** Değer base64, hex veya JSON olabilir. Unutma: kodlama şifreleme değildir, geri çevrilebilir.

3. **Değeri manipüle et.** `role=admin`, `isAdmin=true`, `userid=<başkası>` gibi değiştir ve (gerekiyorsa) yeniden kodla.

4. **İsteği gönder.** Değiştirilmiş cookie ile isteği yolla.

5. **Sonuç.** Uygulama değeri sunucu tarafında doğrulamıyorsa → yetki yükseltme veya yetkisiz hesap erişimi.

Pass-the-cookie varyantında: geçerli bir oturum cookie'si (XSS, dosya erişimi, MITM ile) ele geçirilip saldırganın tarayıcısına eklenir ve oturum doğrudan devralınır.

## Eksik olan kontrol

Uygulama, güvenlik açısından kritik veriyi (kimlik, rol, yetki) istemcide tutulan ve doğrulanmayan bir cookie'ye dayandırır. İstemciden gelen veri güvenilir kabul edilmemelidir.

## Savunma

1. **Durumu sunucuda tut.** Cookie'de yalnızca opak (anlamsız, rastgele) bir session id bulunsun; rol/yetki gibi kritik veriyi cookie'ye koyma, sunucu tarafı oturumda tut.
2. **Cookie'ye veri konacaksa imzala/şifrele.** HMAC'li veya şifreli cookie kullan; istemci değiştirirse sunucu bunu anlar.
3. **Hassas veriyi cookie'de düz metin saklama** (cookie snooping'e karşı).
4. **Güvenli öznitelikler:** `HttpOnly` (JS erişimini engelleyip XSS ile çalınmayı zorlaştırır), `Secure`, `SameSite`.
5. **Her istekte sunucu tarafı yetki kontrolü** yap; cookie değerine göre yetki verme.
6. **Pass-the-cookie'ye karşı:** oturumu bağlama (cihaz/İP/parmak izi) bağla, kısa timeout uygula, anormal oturum kullanımını tespit et, hassas işlemde yeniden kimlik doğrulama iste.
