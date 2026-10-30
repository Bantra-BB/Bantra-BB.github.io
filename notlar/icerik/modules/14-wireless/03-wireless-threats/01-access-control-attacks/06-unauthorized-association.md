# Unauthorized Association

## Nedir?
Unauthorized association, saldırganın genellikle bir **soft AP** (bir dizüstü/cihaz üzerinde yazılımla oluşturulmuş sahte erişim noktası) kullanarak kurbanın cihazını kendine bağlamasıdır. Bu, erişim kontrolü saldırıları içinde en ciddi tehditlerden biri sayılır, çünkü saldırgan fiziksel bir cihaz kurmadan, sadece yazılımla ortamda meşru görünen bir AP yaratabilir.

## İki türü
Bu saldırı iki şekilde ortaya çıkar:

- **Accidental association (kazara):** Kurbanın cihazı, menzildeki açık ya da tanıdık görünen soft AP'ye istemsizce bağlanır. Niyetten bağımsız olarak yetkisiz bir bağlantı doğmuş olur.
- **Malicious association (kasıtlı):** Saldırgan, soft AP'sini kurbanın "gerçek AP" sanacağı şekilde ayarlar. Kurban bağlandığında saldırgan kimlik bilgilerini çalabilir, istemciye zararlı yazılım bulaştırabilir ya da onu iç ağa sıçramak için kullanabilir.

## Hedeflediği zafiyet
Temelde yine istemcinin, bağlandığı AP'nin **gerçekten kim olduğunu doğrulamaması** zafiyetidir. Soft AP'ler sıradan donanımla kolayca kurulabildiği ve meşru bir AP gibi SSID yayınlayabildiği için, karşılıklı kimlik doğrulaması olmayan bir ortamda istemciyi kandırmak kolaydır.

## Nasıl çalışır?
1. Saldırgan kendi cihazında bir soft AP çalıştırır ve genelde ortamdaki meşru AP ile uyumlu/cazip bir SSID yayınlar.
2. Kurbanın cihazı bu AP'ye bağlanır — kazara ya da onu gerçek sanarak.
3. Bağlantı kurulduğunda saldırgan, kurbanın trafiğini izleyebilir, sahte giriş sayfalarıyla kimlik bilgisi toplayabilir veya istemciyi iç ağa erişim için bir dayanak olarak kullanır.

## Diğer saldırılardan farkı
Bu saldırının merkezinde **saldırganın kurduğu soft AP ve kurbanın ona katılması** vardır. Client mis-association daha çok istemcinin kazara yanlış bir AP'ye kaymasını ve köprü riskini anlatır; unauthorized association ise saldırganın bu bağlantıyı (özellikle malicious association'da) bilinçli olarak kurgulamasına odaklanır. Promiscuous client sinyal gücüyle cezbetmeye vurgu yaparken, burada vurgu yetkisiz cihazın ağa/istemciye **katılması** olgusundadır.

## Savunma
- **Karşılıklı kimlik doğrulama:** WPA2/WPA3-Enterprise (802.1X) ve istemci tarafında sunucu sertifikası doğrulaması — istemci yalnızca sertifikası geçerli olan gerçek AP'ye bağlanır.
- İstemci cihazlarda soft AP / hosted network özelliklerini politikayla kısıtlamak.
- Kullanıcı farkındalığı: tanıdık görünen açık ağlara otomatik bağlanmanın riskini anlatmak.
- WIPS ile ortamda beliren yetkisiz soft AP'leri ve beklenmedik SSID'leri tespit edip engellemek.

> **Ayırt etmek için:** Saldırgan bir **soft AP** kurup kurbanın cihazını (kazara ya da kasıtlı) kendine bağlıyorsa konu unauthorized association'dır.
