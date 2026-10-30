# Masquerading

## Nedir?
Masquerading (kimliğe bürünme), saldırganın **çalınan veya ele geçirilen kimlik bilgileriyle yetkili bir kullanıcı gibi davranarak** ağa/kaynaklara erişmesidir. Saldırgan, meşru bir kullanıcının kimliğini üstlenir; sistem onu geçerli kullanıcı sandığı için ona o kullanıcının yetkilerini verir. Bu, gizlilik kategorisinde ele alınır çünkü sonuç, saldırganın yetkisiz biçimde gizli veriye/kaynağa erişmesidir.

## Hedeflediği zafiyet
Temel zafiyet, kimliğin **yeterince güçlü doğrulanmamasıdır.** Eğer erişim yalnızca kolay çalınabilen/taklit edilebilen bir bilgiye (parola, MAC adresi, zayıf kimlik bilgisi) dayanıyorsa, saldırgan o bilgiyi ele geçirdiğinde kullanıcının yerine geçebilir. Kimlik bilgileri eavesdropping, sahte portal (evil twin/honeypot) veya başka yollarla elde edilmiş olabilir.

## Nasıl çalışır?
1. Saldırgan bir kullanıcının kimlik bilgilerini ele geçirir (dinleme, sahte giriş sayfası, sosyal mühendislik vb.).
2. Bu bilgileri kullanarak kendini o kullanıcı olarak tanıtır ve ağa/sisteme erişir.
3. Artık o kullanıcının yetkileriyle hareket eder; gizli veriye ulaşabilir veya başka saldırılar için dayanak kurabilir.

## Diğer saldırılardan farkı
Masquerading, bir **kullanıcı kimliğini** üstlenmeye odaklanır. MAC spoofing (access control kategorisinde) bunun donanım kimliği düzeyindeki özel bir biçimi sayılabilir — orada taklit edilen bir cihazın MAC'idir. Evil twin bir **AP'yi** taklit eder, masquerading ise bir **kullanıcıyı**. Session hijacking'den farkı ise, orada parolaya gerek kalmadan açık bir oturumun devralınması, burada ise çalınan **kimlik bilgileriyle** yetkili kullanıcı gibi davranılmasıdır.

## Savunma
- **Çok faktörlü kimlik doğrulama (MFA):** Çalınan tek bir kimlik bilgisi tek başına yeterli olmaz; masquerading'i ciddi biçimde zorlaştırır.
- **WPA2/WPA3-Enterprise (802.1X)** ile güçlü, kullanıcı bazlı kimlik doğrulama; paylaşılan tek parolaya (PSK) bağımlılığı azaltmak.
- Kimlik bilgisi sızıntısını önlemek: açık ağ/WEP kullanmamak, uygulama katmanında TLS, sahte portallara karşı farkındalık.
- Anormal giriş davranışını (beklenmedik konum/saat/cihaz) tespit eden izleme.

> **Ayırt etmek için:** Saldırgan, çalınan **kimlik bilgileriyle yetkili bir kullanıcı gibi davranıyorsa** konu masquerading'dir.
