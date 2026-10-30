# Extensible AP Replay

## Nedir?
Extensible AP replay, saldırganın kablosuz ağ üzerinde taşınan **802.1X / EAP (Extensible Authentication Protocol) çerçevelerini yakalayıp daha sonra tekrar göndermesidir (replay).** Hedef, kimlik doğrulama sürecini manipüle etmek ya da yakalanan kimlik doğrulama mesajlarını yeniden oynatarak sistemi yanıltmaktır.

## Kısa hatırlatma: EAP / 802.1X
Kurumsal kablosuz ağlar (WPA2/WPA3-Enterprise) kimlik doğrulama için **802.1X** çerçevesini ve onun taşıdığı **EAP** mesajlarını kullanır. Bu süreçte istemci (supplicant), AP (authenticator) ve arka plandaki RADIUS sunucusu arasında bir dizi EAP mesajı gidip gelir. Bu mesajlar yeterince korunmazsa, yakalanıp tekrar gönderilebilir.

## Hedeflediği zafiyet
Replay saldırılarının genel mantığı burada da geçerli: bir mesajın **tazeliğini (freshness)** doğrulayan güçlü bir mekanizma yoksa, daha önce yakalanmış geçerli bir EAP mesajı tekrar gönderildiğinde sistem onu yeni ve geçerli sanabilir. Korumasız veya zayıf yapılandırılmış EAP yöntemleri bu tür replay'e açıktır.

## Nasıl çalışır?
1. Saldırgan, kimlik doğrulama sırasındaki EAP çerçevelerini pasif olarak yakalar.
2. Yakalanan geçerli EAP mesaj(lar)ını uygun anda ağa yeniden gönderir.
3. Sistem bu tekrar gönderilen mesajı geçerli sayarsa, saldırgan kimlik doğrulama akışını istismar edebilir veya süreci bozabilir.

## Diğer replay saldırılarından farkı
Bu kategoride üç replay türü var ve hedefleri farklıdır:

| Replay türü | Neyi tekrar gönderir |
|---|---|
| **Extensible AP Replay** | 802.1X / EAP kimlik doğrulama çerçeveleri |
| Data Replay | Normal veri çerçeveleri |
| RADIUS Replay | AP ↔ RADIUS sunucusu arasındaki mesajlar |

Extensible AP replay özellikle **istemci-AP arasındaki EAP katmanını** hedefler; RADIUS replay ise AP'nin arkasındaki sunucuyla olan trafiği.

## Savunma
- **Tünelli ve karşılıklı kimlik doğrulamalı EAP yöntemleri** kullanmak (ör. sunucu sertifikası doğrulayan güçlü yöntemler) — zayıf/korumasız EAP türlerinden kaçınmak.
- **WPA2/WPA3-Enterprise** ile kimlik doğrulama trafiğinin bütünlük ve tazelik korumasını sağlamak.
- WIDS/WIPS ile tekrarlanan/anormal EAP çerçevelerini tespit etmek.

> **Ayırt etmek için:** Tekrar gönderilen şey **EAP / 802.1X kimlik doğrulama** çerçeveleriyse konu extensible AP replay'dir.
