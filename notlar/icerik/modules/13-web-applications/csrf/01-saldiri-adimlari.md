# CSRF - Saldırı Adımları

## Hidden Link/Image Exploitation

Bu saldırıda genel mantık tarayıcının cookie'leri otomatik gönermesi üzerine kuruludur. Bir siteye giriş yapıldığında artık o siteye giden her istekte tarayıcı oturum cookie'sini otomatik ekler. Saldırgan oturum ele geçirmez, kurban adına istek gönderttirir. 

Teknikte saldırgan, bir sayfaya veya e-postaya `src`/`href` değeri hedef işlemiyapan bir URL'e ayarlanmış bir görsel ya da bağlantı yerleştirir. Görsel çoğu zaman göze görünmeyecek şekilde (0x0 piksel) gizlenir; kurban farkında olmadan
istek gider.

```html
<!-- Gizli bağlantı / görsel örneği -->
<a href="https://hedef-site.com/transfer" target="_blank">Click Here</a>
<img src="https://hedef-site.com/transfer?to=ATTACKER&amount=1000" width="0" height="0">
```

## Saldırının ön koşulları

Bir CSRF saldırısının çalışması için üç şart gerekir:

| Şart | Açıklama |
|---|---|
| Değer taşıyan bir eylem | Tetiklenecek bir işlem olmalı — şifre değiştirme, e-posta güncelleme, para transferi |
| Cookie tabanlı oturum | İstek sadece session cookie'siyle doğrulanıyor, kaynağı başka yolla doğrulanmıyor olmalı |
| Öngörülebilir parametreler | Saldırgan isteğin tüm parametrelerini önceden bilebilmeli; tahmin edemeyeceği gizli bir değer (CSRF token) olmamalı |

## Saldırı adımları

1. **Hedef isteği tespit et.** Durum değiştiren (state-changing) bir işlem bul; örneğin para transferi veya şifre değiştirme. İsteğin yapısını ve parametrelerini incele.
2. **Korumasızlığı doğrula.** İstekte benzersiz/tahmin edilemez bir anti-CSRF değeri (CSRF token) gönderilip gönderilmediğine bak. Böyle bir parametre yoksa istek CSRF'ye açıktır. Örnek korumasız form:

   ```html
   <form action="/transfer" method="post">
     <input type="text"   name="to_account">
     <input type="number" name="amount">
     <button type="submit">Transfer</button>
   </form>
   ```

   Burada isteği "meşru" yapan tek şey oturum cookie'sidir; sunucu isteğin gerçekten kullanıcının kendi formundan mı geldiğini doğrulamaz.

3. **Zararlı HTML'i hazırla.** Hedef endpoint'e, saldırganın seçtiği parametrelerle giden bir bağlantı, görsel veya otomatik gönderilen form oluştur.

   - İşlem **GET** ile kabul ediliyorsa tek bir bağlantı/görsel yeterlidir:

     ```html
     <a href="https://hedef-site.com/transfer?to_account=ATTACKER&amount=1000">
        Ödülü Al</a>
     ```

   - İşlem **POST** gerektiriyorsa otomatik gönderilen gizli bir form kullanılır:

     ```html
     <form action="https://hedef-site.com/transfer" method="POST">
       <input type="hidden" name="to_account" value="ATTACKER">
       <input type="hidden" name="amount" value="1000">
     </form>
     <script>document.forms[0].submit();</script>
     ```

4. **Kurbana ulaştır.** Sosyal mühendislikle (ör. cazip bir e-posta) kurbanı saldırganın sayfasına/bağlantısına çek. Kurban hedef sitede oturumu açıkken bu içeriği açar.

5. **İstek otomatik gider.** Kurbanın tarayıcısı hedef siteye isteği atar ve oturum cookie'sini otomatik ekler. Sunucu geçerli cookie'yi görür, isteği kurbanın kendisi yapmış sayar ve işlemi gerçekleştirir (örn. parayı transfer eder).

## Eksik olan kontrol

Formdaki tüm alan doğrulamaları (zorunlu alanlar, tipler) doğru olsa bile eksik olan tek şey şudur: **sunucu, isteğin meşru kaynaktan/kullanıcının niyeti e gelip gelmediğini doğrulamaz.** Kimlik doğrulama (cookie geçerli mi?) vardır; ama niyet/kaynak doğrulaması (bu isteği gerçekten kullanıcı mı başlattı?) yoktur. CSRF'nin kök nedeni tam olarak bu boşluktur.

## Temel savunma: CSRF token

Çözüm, durum değiştiren her isteğe **benzersiz ve tahmin edilemez bir CSRF token** eklemektir. Token, forma gizli alan olarak gömülür; sunucu her istekte token'ın varlığını ve doğruluğunu kontrol eder, yoksa/yanlışsa isteği reddeder. Saldırgan token'ı önceden bilemeyeceği için hazırladığı istek reddedilir.

İki yaygın uygulama hatası (detay `02-tespit-ve-savunma.md`):

1. **Token'ı cookie'den okumak** ("double submit" zayıf hali) — saldırganın cookie set edebildiği senaryolarda atlatılabilir. Doğrusu: token'ı sunucu tarafında, oturuma bağlı (synchronizer token) üretmek.
2. **Durum değiştiren işlemi GET ile sunmak** — bu işlemler yalnızca POST + CSRF token (mümkünse `SameSite` cookie ve `Origin`/`Referer` kontrolü) ile yapılmalıdır.
