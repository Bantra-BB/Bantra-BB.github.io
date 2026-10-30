# AP Misconfiguration

## Nedir?
AP misconfiguration, tek bir erişim noktasının **yanlış veya zayıf yapılandırılması** sonucu ağa açık bir kapı haline gelmesidir. Burada saldırgan sofistike bir teknik kullanmaz; sadece yöneticinin yaptığı bir yapılandırma hatasından faydalanır. İşin kötüsü, kurumsal bir ağda tek bir hatalı AP bile tüm ağı riske atmaya yeter — çünkü o AP, iç ağa doğrudan bir köprüdür.

## Tipik yapılandırma hataları
Bu saldırının "zafiyeti" aslında bir hatalar listesidir:

- **Varsayılan ayarlar:** AP'nin fabrika çıkışı SSID'si, varsayılan yönetici parolası veya açık yönetim arayüzünün değiştirilmemesi. Varsayılan parolalar internette herkese açık listelerde bulunur.
- **SSID'nin bilgi sızdırması:** SSID'ye kurum adı, departman, kat veya cihaz modeli yazmak (`Muhasebe-Kat3`, `CiscoAP-1041`). Bu, saldırgana hedef hakkında bedava keşif verisi verir.
- **SSID'yi "parola" gibi kullanmak:** Bazı yöneticiler gizli SSID'yi bir güvenlik önlemi sanır. Oysa SSID havada taşınır ve kolayca yakalanır — gizli SSID gerçek koruma değildir.
- **Zayıf veya hiç şifreleme:** AP'yi açık (şifresiz) bırakmak veya kırık WEP kullanmak.
- **Zayıf / tahmin edilebilir PSK:** WPA2-PSK kullanılıyor ama parola kısa ya da sözlükte bulunabilecek türden.

## Nasıl sömürülür?
Saldırgan çevredeki AP'leri tarar (`airodump-ng`), beacon çerçevelerinden her AP'nin SSID'sini, şifreleme tipini ve yapılandırmasını okur. Açık, varsayılan parolalı veya zayıf şifrelemeli bir AP gördüğünde doğrudan ona yönelir. Varsayılan yönetici paneline erişebilirse AP'nin tüm ayarlarını ele geçirebilir; açık/zayıf şifreli bir AP ise ona hiç uğraşmadan ağa giriş sağlar.

## Diğer saldırılardan farkı
Bu kategorideki diğer saldırılar bir cihazı kandırmayı veya bir kimliği taklit etmeyi içerir. AP misconfiguration ise **tamamen savunan tarafın hatasına** dayanır — saldırganın yapması gereken tek şey, zaten açık bırakılmış kapıyı fark etmektir. Bu yüzden en kolay ama en yaygın erişim kontrolü zafiyetlerinden biridir.

## Savunma
- Her AP'de varsayılan SSID ve **varsayılan yönetici parolasını** mutlaka değiştirmek.
- SSID'de kurum/konum/model bilgisi taşımamak; SSID'yi güvenlik önlemi olarak görmemek.
- En az **WPA2** (tercihen WPA3) ve güçlü, uzun bir PSK ya da kurumsal ortamda **802.1X** kullanmak.
- AP yönetim arayüzünü yalnızca kablolu/yönetim ağından erişilebilir kılmak, uzaktan yönetimi kapatmak.
- Düzenli yapılandırma denetimi ve WIPS ile politikaya uymayan (rogue/misconfigured) AP taraması yapmak.

> **Ayırt etmek için:** Zafiyet saldırganın bir tekniğinden değil, AP'nin **ayarlarından** kaynaklanıyorsa konu AP misconfiguration'dır.
