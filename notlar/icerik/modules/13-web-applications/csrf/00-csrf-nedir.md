# CSRF (Cross-Site Request Forgery)

CSRF, saldırganın kullanıcının tarayıcısını kandırarak, kullanıcının kimliği doğrulanmış (authenticated) oturumu üzerinden onun adına istem dışı işlemler yaptırmasıdır. Saldırı, tarayıcının bir siteye ait kimlik bilgilerini (cookie/credential) her istekte otomatik olarak göndermesi özelliğini sömürür; böylece saldırganın hazırladığı istek, kurbanın geçerli oturumuyla kimliği doğrulanmış şekilde web uygulamasına iletilir ve çalıştırılır.

## Nasıl Çalışır?

Bir CSRF saldırısının gerçekleşebilmesi için üç temel koşulun bir arada bulunması gerekir:

1. **Saldırganın hedef uygulamanın istek formatını bilmesi:** Zararlı isteği hazırlayabilmek için hedef web uygulamasının hangi parametreleri, hangi metodu (GET/POST) ve hangi yapıyı beklediğini biliyor olması gerekir. Saldırgan bu bilgiyle hazırladığı zararlı bağlantıyı/formu kurbana ulaştırır (e-posta, mesaj, sahte sayfa vb.).

2. **Kimliğin çerezlerle otomatik doğrulanması:** Kurbanın kimliği, her istekte tarayıcı tarafından otomatik olarak gönderilen oturum çerezleri (session cookie) üzerinden doğrulanır. Kurban hedef sitede açık bir oturuma sahipken saldırganın bağlantısına tıkladığında, bu çerezler isteğe otomatik eklenir.

3. **Uygulamanın gerçek ve sahte isteği ayırt edememesi:** Web uygulaması, kurbanın bilerek yaptığı istekler ile saldırgan tarafından tetiklenen sahte istekleri birbirinden ayırt edemiyor olmalıdır (ör. CSRF token, SameSite çerez ayarı gibi bir doğrulama mekanizması bulunmaması).

## CSRF Türleri

### Klasik CSRF

Klasik CSRF, genellikle form gönderimi gibi durum (state) değiştiren işlemleri hedef alır. Saldırgan, kurbanın kimliği doğrulanmış olduğu web uygulamasına otomatik gönderilecek bir HTML formu hazırlar. Kurban zararlı sayfayı açtığında, tarayıcısı bu formu uygulamaya gönderirken oturum çerezlerini (ve varsa URL parametrelerini) kurbanın haberi olmadan isteğe ekler. Bu formlar genellikle para transferi, hesap bilgilerini değiştirme, parola güncelleme gibi state değiştiren işlemler için oluşturulur.

### Asenkron CSRF

Asenkron CSRF, işlemlerin klasik form gönderimi yerine arka planda çalışan asenkron HTTP istekleriyle tetiklenmesidir. Bu tür, sunucu tarafı işlemleri için **XMLHttpRequest** veya **Fetch API** kullanan, JavaScript ağırlıklı (AJAX tabanlı) uygulamalarda görülür. Klasik CSRF'ten farkı, tam bir sayfa gönderimi/yönlendirmesi yapmadan, istek arka planda sessizce gönderilir.

Asenkron CSRF adımları:

1. Kurban, hedef uygulamada oturum açar; oturum çerezi tarayıcısına kaydedilir.
2. Saldırgan, kurbanı uygulamaya istek gönderebilen bir script barındıran kötü amaçlı web sitesine yönlendirir.
3. Kurban zararlı sayfayı açtığında, saldırganın scripti `uygulama/api/updateProfile` adresine bir AJAX çağrısı yaparak hesap bilgilerini değiştirmeye çalışır.
4. Tarayıcı, bu AJAX isteğine uygulamaya ait oturum çerezini otomatik olarak ekler.
5. Uygulamada herhangi bir CSRF koruması yoksa, istek geçerli sayılır ve kurbanın hesap bilgileri değiştirilir.
