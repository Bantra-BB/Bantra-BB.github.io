# Authenticate Flood

## Nedir?
Authenticate flood, saldırganın bir AP'ye **çok sayıda sahte kimlik doğrulama (authentication) isteği göndererek** onu boğmasıdır. AP, gelen her isteği işlemeye ve bir duruma (association table) kaydetmeye çalışır; istekler sel gibi gelince kaynakları tükenir ve AP meşru istemcilere hizmet veremez hale gelir. Bir DoS türüdür.

## Hedeflediği zafiyet
Bir AP'nin aynı anda işleyebileceği kimlik doğrulama/istemci sayısı **sınırlıdır.** Her yeni authentication isteği için AP bellek ve işlem ayırır. Saldırgan bu sınırı, genellikle **rastgele/sahte MAC adreslerinden** gelen binlerce istekle doldurursa, AP'nin tablosu şişer ve yeni (gerçek) istemciler kabul edilemez.

## Nasıl çalışır?
1. Saldırgan, injection destekleyen kartıyla hedef AP'ye sürekli 802.11 authentication çerçeveleri gönderir.
2. Her çerçeve farklı (sahte) bir kaynak MAC adresi taşır, böylece AP her birini yeni bir istemci sanır.
3. AP'nin istemci/association tablosu dolar; kaynaklar tükenince meşru kullanıcılar bağlanamaz.

## Diğer flood/DoS saldırılarından farkı
Bu kategoride birkaç "flood" vardır; farkları hangi çerçeveyi kötüye kullandıklarıdır:

| Saldırı | Sel yapılan çerçeve | Etki |
|---|---|---|
| **Authenticate Flood** | Authentication istekleri | AP'nin istemci tablosunu doldurur |
| Deauthenticate Flood | Deauth çerçeveleri | Mevcut istemcileri ağdan düşürür |
| Disassociation | Disassociation çerçeveleri | Mevcut istemcilerin bağlantısını koparır |
| Beacon Flood | Sahte beacon'lar | Çok sayıda sahte AP göstererek istemcileri şaşırtır |

Authenticate ve beacon flood **kaynak tüketme/karıştırma** mantığıyla çalışırken, deauth ve disassociation **mevcut bağlantıları koparmaya** odaklanır.

## Savunma
- **WIDS/WIPS:** Aynı anda çok sayıda farklı MAC'ten gelen anormal authentication selini tespit edip engellemek.
- AP/denetleyici tarafında **oran sınırlama (rate limiting)** ve istemci başına kaynak limitleri.
- Kurumsal donanımda DoS koruması/anormallik tespiti özelliklerini etkinleştirmek.
- Genel MAC-katmanı sertleştirmesi (802.11w bazı sahte çerçeve türlerine yardımcı olur, ama authentication flood'u tek başına tamamen durdurmaz; asıl çözüm oran sınırlama + tespittir).

> **Ayırt etmek için:** Sel yapılan şey **authentication istekleri** ve amaç AP'nin istemci tablosunu doldurmaksa konu authenticate flood'dur.
