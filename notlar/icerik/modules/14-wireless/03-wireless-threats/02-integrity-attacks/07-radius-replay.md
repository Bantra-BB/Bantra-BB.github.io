# RADIUS Replay

## Nedir?
RADIUS replay, saldırganın **AP (authenticator) ile arka plandaki RADIUS kimlik doğrulama sunucusu arasında giden mesajları yakalayıp tekrar göndermesidir.** Kurumsal kablosuz ağlarda (WPA2/WPA3-Enterprise) kimlik doğrulama kararını RADIUS sunucusu verir; bu trafiğin yeniden oynatılması, kimlik doğrulama sonucunu manipüle etmeyi hedefler.

## Kısa hatırlatma: RADIUS nerede?
802.1X mimarisinde üç taraf vardır: istemci (supplicant), AP (authenticator) ve **RADIUS sunucusu** (authentication server). İstemcinin kimliği doğrulandığında RADIUS sunucusu AP'ye bir **Access-Accept**, reddettiğinde **Access-Reject** mesajı gönderir. Bu mesajlaşma genelde AP ile sunucu arasındaki kablolu/ağ bağlantısı üzerinden yürür.

## Hedeflediği zafiyet
Eğer RADIUS mesajlaşması yeterince korunmuyorsa (zayıf paylaşılan gizli anahtar, korumasız taşıma), saldırgan daha önce yakaladığı geçerli bir mesajı (örneğin bir **Access-Accept**) tekrar göndererek sistemi yanıltmaya çalışabilir. Yine temel sorun, mesajların **tazeliğinin** güçlü biçimde doğrulanmamasıdır.

## Nasıl çalışır?
1. Saldırgan AP ↔ RADIUS trafiğine erişebildiği bir konumdan bu mesajları yakalar.
2. İşine yarayan geçerli bir mesajı (ör. bir kabul yanıtı) seçer.
3. Bu mesajı uygun anda yeniden gönderir; sistem replay koruması zayıfsa onu geçerli sayabilir.

## Diğer replay saldırılarından farkı
RADIUS replay, replay ailesinin **AP'nin arkasındaki sunucu trafiğini** hedefleyen üyesidir. Extensible AP replay istemci-AP arasındaki EAP çerçevelerini, data replay ise normal veri çerçevelerini tekrar eder. RADIUS replay'in ayırt edici yönü, hedefin **AP ↔ RADIUS sunucusu** kanalı olmasıdır.

## Savunma
- RADIUS için **güçlü paylaşılan gizli anahtarlar** kullanmak ve bu trafiği korunan bir kanaldan taşımak (ör. RadSec/TLS gibi taşımalar veya izole yönetim ağı).
- RADIUS sunucusu ve AP yapılandırmasında replay/zaman kontrollerini etkin tutmak.
- AP ↔ sunucu segmentini ağ tarafında izole edip izlemek; bu trafiğe saldırganın erişmesini zorlaştırmak.

> **Ayırt etmek için:** Tekrar gönderilen mesajlar **AP ile RADIUS sunucusu** arasındaki kimlik doğrulama trafiğiyse konu RADIUS replay'dir.
