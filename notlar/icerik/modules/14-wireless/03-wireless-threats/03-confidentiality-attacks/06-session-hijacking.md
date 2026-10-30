# Session Hijacking

## Nedir?
Session hijacking (oturum ele geçirme), saldırganın kurbanın **mevcut, kimlik doğrulaması yapılmış oturumunu devralmasıdır.** Saldırgan kullanıcının parolasını bilmese bile, oturumu temsil eden bilgiyi (çoğunlukla bir **oturum çerezi / token**) ele geçirip onun yerine geçebilir. Kablosuz ortamda bu bilgi, zayıf korunan trafikten dinlenerek elde edilir.

## Hedeflediği zafiyet
Web ve uygulama oturumları, kullanıcı giriş yaptıktan sonra bir oturum kimliğiyle (session ID/token) sürdürülür. Bu kimlik korunmasız bir kanaldan (ör. HTTP, ya da kırılmış kablosuz şifreleme üzerinden) geçerse, onu yakalayan saldırgan aynı kimliği kullanarak sunucuya kurban gibi görünebilir. Yani zafiyet, **oturum kimliğinin yolda korunmaması veya yakalanabilir olmasıdır.**

## Nasıl çalışır?
1. Saldırgan, kurbanla aynı kablosuz ortamda trafiği dinler (eavesdropping) ya da kurbanı sahte bir AP'ye çekip araya girer (evil twin → MITM).
2. Korunmasız bir oturumdan oturum çerezini/token'ını yakalar.
3. Bu token'ı kendi tarafında kullanarak kurbanın oturumuna devam eder — giriş yapması gerekmeden kurbanın hesabına erişir.

## Diğer saldırılardan farkı
Eavesdropping ve MITM, saldırganın oturum bilgisini **ele geçirmesini sağlayan** araçlardır; session hijacking ise bu bilgiyle **oturumun fiilen devralınmasıdır** — yani bir sonraki adım. Masquerading ile yakındır ama fark şudur: masquerading genelde çalınan **kimlik bilgileriyle (credential)** yetkili kullanıcı gibi davranmayı anlatır; session hijacking ise parolaya hiç gerek kalmadan **zaten açık bir oturumu** devralmaya odaklanır.

## Savunma
- **Uçtan uca HTTPS/TLS:** Oturum token'ı şifreli kanaldan gittiği için kablosuz şifreleme kırılsa bile yakalanamaz. Session hijacking'e karşı en belirleyici önlem budur.
- Oturum çerezlerinde **Secure** ve **HttpOnly** bayrakları; mümkünse token'ları IP/cihaza bağlamak ve kısa ömürlü tutmak.
- Kablosuz katmanda **WPA2/WPA3** ile trafiği şifrelemek; açık ağ ve WEP kullanmamak.
- Hassas işlemlerde yeniden kimlik doğrulama ve anormal oturum tespiti.

> **Ayırt etmek için:** Saldırgan parolayı değil, **zaten açık bir oturumun kimliğini (token/çerez)** ele geçirip oturumu devralıyorsa konu session hijacking'dir.
