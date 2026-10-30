# Ad Hoc Associations

## Nedir?
Ad hoc association, bir saldırganın merkezi bir AP'yi hiç kullanmadan, **ad-hoc (cihazdan cihaza, peer-to-peer) modda çalışan bir istemciye doğrudan bağlanarak** ağa sızması veya o istemciyi ele geçirmesidir. Ad-hoc mod (IBSS), iki cihazın AP olmadan birbirine bağlandığı yapıdır; dosya paylaşımı, oyun veya geçici bağlantılar için kullanılır.

## Hedeflediği zafiyet
Ad-hoc bağlantıların temel sorunu, **genelde çok az güvenlik içermesi veya hiç içermemesidir.** AP tabanlı bir ağda kurumun uyguladığı şifreleme, 802.1X, MAC filtresi gibi politikalar ad-hoc bağlantıda devrede olmaz — çünkü ortada o politikaları uygulayan bir AP yoktur. Dahası, bu bağlantıyı istemci başlatır; yani kurumun AP üzerinde aldığı önlemler bu kanalı hiç görmez bile.

## Nasıl çalışır?
1. Bir kullanıcının cihazı, farkında olarak veya olmayarak ad-hoc modu açık bırakır (örneğin eski bir paylaşım ayarı, bir oyun ya da yanlış yapılandırma).
2. Saldırgan menzilde bu ad-hoc istemciyi tespit eder ve ona doğrudan bağlanır — araya bir AP girmediği için kurumsal güvenlik kontrolleri devreye girmez.
3. Eğer o istemci aynı anda kurumsal ağa da bağlıysa, saldırgan istemciyi bir **köprü** olarak kullanıp iç ağa geçebilir; değilse doğrudan istemcideki veriyi/hizmetleri hedefler.

## Diğer saldırılardan farkı
Buradaki kilit nokta **ad-hoc modun kendisi**: saldırı, bir AP'yi veya bir kimliği değil, AP'siz kurulan güvensiz bir eş bağlantıyı kullanır. Client mis-association'da kurban yanlış bir **AP'ye** bağlanır; ad hoc association'da ise AP hiç yoktur, bağlantı doğrudan iki cihaz arasındadır.

## Savunma
- Kurumsal cihazlarda **ad-hoc modu grup politikasıyla (GPO) tamamen devre dışı bırakmak** — en etkili önlem budur.
- Uç cihazlarda yalnızca "infrastructure" (AP üzerinden) bağlantıya izin vermek.
- Host tabanlı güvenlik (endpoint firewall, cihaz güvenlik politikaları) ile istenmeyen eş bağlantıları engellemek.
- WIPS ile ad-hoc yayın yapan cihazları tespit etmek.

> **Ayırt etmek için:** Saldırı AP olmadan, doğrudan bir istemciye kurulan **ad-hoc (peer-to-peer)** bağlantı üzerinden gerçekleşiyorsa konu ad hoc association'dır.
