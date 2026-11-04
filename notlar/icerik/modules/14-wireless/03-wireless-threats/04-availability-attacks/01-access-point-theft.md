# Access Point Theft

## Nedir?
Access point theft, bir AP'nin **fiziksel olarak yerinden sökülüp çalınmasıdır.** En "düşük teknoloji" availability saldırısıdır ama etkisi doğrudandır: AP ortadan kalkınca o bölgedeki kablosuz hizmet tamamen kesilir. Availability (erişilebilirlik) kategorisinde ele alınır çünkü sonuç, meşru kullanıcıların ağa erişememesidir.

## Hedeflediği zafiyet
Zafiyet dijital değil **fizikseldir:** AP'lerin erişilebilir, korumasız yerlere monte edilmesi. Duvarda, tavanda ya da açık bir alanda kolayca ulaşılabilen bir AP; sökülebilir, çalınabilir veya kurcalanabilir. Küçük/taşınabilir AP'ler özellikle risklidir.

## Nasıl bir etki yaratır?
- **Hizmet kesintisi:** O AP'nin kapsadığı alanda Wi-Fi erişimi durur.
- **Bilgi sızıntısı riski:** Çalınan AP'nin yapılandırması incelenerek SSID, parola, yönetim bilgileri veya ağ topolojisi ele geçirilebilir. Yani saldırı sadece availability değil, dolaylı olarak confidentiality riskine de dönüşebilir.
- **Kurcalama (tampering):** Çalınmak yerine AP'ye fiziksel müdahale edilip zararlı firmware yüklenmesi de aynı fiziksel zafiyetten doğar.

## Diğer saldırılardan farkı
Bu kategorideki diğer saldırılar (deauth, jamming, flood'lar) uzaktan, yazılım/radyo ile hizmeti keser. Access point theft ise **fiziksel erişime** dayanır — saldırgan cihaza elle ulaşır. Bu yüzden savunması da fiziksel güvenlik meselesidir.

## Savunma
- AP'leri **ulaşılması zor yerlere** (yüksek tavan, kilitli muhafaza) monte etmek; kolay sökülmeyecek şekilde sabitlemek.
- AP'leri **envanterde takip etmek** ve düzenli fiziksel kontrol yapmak.
- Yapılandırmayı korumak: AP yönetim parolalarını güçlü tutmak, hassas bilgileri cihazda düz metin bırakmamak, mümkünse merkezi denetleyici (controller) mimarisi kullanmak ki çalınan AP tek başına az işe yarasın.
- Çalınma/kurcalama tespiti için fiziksel alarm veya izleme.
