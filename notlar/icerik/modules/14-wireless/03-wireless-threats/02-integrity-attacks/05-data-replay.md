# Data Replay

## Nedir?
Data replay, saldırganın ağdan **geçerli veri çerçevelerini yakalayıp daha sonra olduğu gibi tekrar göndermesidir.** Paketin içeriği değiştirilmez; sadece eski bir geçerli mesaj yeniden oynatılır. Amaç, aynı işlemi tekrar ettirmek, sistemi yanıltmak ya da trafik üreterek başka bir saldırıyı beslemektir.

## Hedeflediği zafiyet
Temel zafiyet, verinin **tazeliğinin (freshness)** doğrulanmamasıdır. Eğer bir sistem "bu paketi daha önce görmüş müydüm?" kontrolünü yapmıyorsa (sıra numarası, zaman damgası veya paket sayacı yoksa), tekrar gönderilen eski bir paketi yeni ve geçerli sanar. Replay koruması olmayan ya da zayıf şifreleme (WEP gibi) kullanan ağlar buna açıktır.

## Nasıl çalışır?
1. Saldırgan hedef ağın veri trafiğini yakalar.
2. İlgilendiği geçerli bir veri çerçevesini seçer.
3. Bu çerçeveyi uygun bir anda ağa yeniden gönderir; sistem replay koruması yoksa onu işler.

Klasik bir kullanım, WEP kırmada görülür: yakalanan bir ARP paketi tekrar tekrar enjekte edilerek AP'nin çok sayıda yeni IV üretmesi sağlanır, böylece anahtarı kırmak için gereken IV'ler hızla toplanır.

## Diğer replay saldırılarından farkı
Data replay, **normal veri çerçevelerini** tekrar gönderir. Extensible AP replay EAP kimlik doğrulama çerçevelerini, RADIUS replay ise AP ile RADIUS sunucusu arasındaki mesajları hedefler. Üçü de "yakala ve tekrar gönder" mantığını paylaşır; fark, hangi trafiği tekrar ettikleridir. IV replay'den farkı ise, IV replay'in özel olarak WEP'in IV yeniden kullanımına odaklanmasıdır.

## Savunma
- **WPA2 (CCMP/AES) veya WPA3** kullanmak: bu protokoller her pakete artan bir **paket numarası (PN)** ekler ve tekrarlanan paketleri reddederek replay'i engeller.
- WEP ve replay koruması olmayan yapılandırmalardan kaçınmak.
- WIDS/WIPS ile tekrar eden/kopya paket örüntülerini izlemek.

> **Ayırt etmek için:** Değiştirilmeden tekrar gönderilen şey **normal veri çerçeveleri** ise konu data replay'dir.
