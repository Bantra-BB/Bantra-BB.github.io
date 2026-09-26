# Önleme / Korunma

Öncelik sırasına göre:

1. **Mümkünse kullanıcı girdisini dosya yolunda hiç kullanma.** Dosyaları bir **ID/index'e eşle** (mapping). Kullanıcı `file=document.pdf` yerine `id=123` gönderir; gerçek yol sunucu tarafında veritabanından çözülür. Traversal payload'ı hiçbir zaman dosya sistemine ulaşmaz.

2. **Allowlist (beyaz liste) doğrulaması.** Girdiyi "kötü karakterleri temizleme" (blocklist) yerine **yalnızca bilinen iyi değerleri kabul et** mantığıyla doğrula. Blocklist yaklaşımı, kodlama varyantları yüzünden neredeyse her zaman atlatılır.

3. **Canonicalization + base directory kontrolü.** Yolu önce **tam/kanonik** hâline getir (`../`, sembolik linkler ve kodlamalar çözülür), sonra izin verilen kök dizinle başlayıp başlamadığını doğrula:

   ```python
   import os
   BASE_DIR = "/var/www/files"
   requested = os.path.realpath(os.path.join(BASE_DIR, user_input))
   if not requested.startswith(BASE_DIR + os.sep):
       raise SecurityException("Path traversal engellendi")
   ```

   Dil karşılıkları: Java `getCanonicalPath()`, PHP `realpath()`, Node.js `path.resolve()` + prefix kontrolü. **Doğrulama daima canonicalization'dan SONRA yapılmalı.**

4. **Kodlanmış varyantları da hesaba kat.** Girdiyi tam decode ettikten sonra kontrol et; çift kodlama (double decoding) tuzağına düşme.

5. **En az yetki (least privilege) + chroot jail.** Uygulama, ihtiyaç duyduğu minimum dosya izinleriyle çalışsın; erişim bir dizine hapsedilsin (chroot / container). Böylece zafiyet olsa bile erişilebilecek dosya kümesi sınırlı kalır.

6. **WAF ek bir katmandır, tek başına çözüm değildir.** Bilinen traversal desenlerini yakalar ama kodlama/normalizasyon varyantlarıyla atlatılabilir. Asıl savunma güvenli kodlamadır.

> **Yetersiz kontrol uyarısı:** Girdinin `..` ile başlayıp başlamadığını kontrol etmek yeterli değildir. `someFolder\..\..\admin\dosya` gibi girdiler kontrolü atlatır. Mutlak yol girişleri de ayrıca engellenmelidir.
