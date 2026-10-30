# Eavesdropping

## Nedir?
Eavesdropping (gizli dinleme), saldırganın kablosuz trafiği **pasif olarak yakalayıp okumasıdır.** Saldırgan ağa hiç bağlanmaz, hiçbir paket göndermez; sadece menzildeki havada akan çerçeveleri dinler. Bu yüzden tespit edilmesi çok zordur — ortada aktif bir iz yoktur.

## Hedeflediği zafiyet
Kablosuz ortamın doğası gereği, bir AP'nin menzilindeki herkes aynı sinyali alabilir. Trafik **şifresizse veya zayıf şifreliyse**, saldırgan onu doğrudan okuyabilir. Açık (şifresiz) ağlar, captive portal arkasındaki korumasız trafik ve kırık WEP bu saldırının birincil hedefleridir. Güçlü şifreleme (WPA2/WPA3) varsa saldırgan çerçeveleri yakalar ama içeriği okuyamaz — işte bu noktada eavesdropping, anahtar kırma gibi başka saldırılara dönüşmeye çalışır.

## Nasıl çalışır?
1. Saldırgan kablosuz kartını **monitor moda** alır (karta ulaşan tüm çerçeveleri, kendisine ait olmasa bile yakalar).
2. Hedef ağın kanalına kilitlenir ve trafiği bir yakalama aracıyla (ör. Wireshark, `airodump-ng`) kaydeder.
3. Şifresiz trafikte parolaları, çerezleri, e-postaları, DNS sorgularını vb. doğrudan okur; şifreli trafikte ise meta veriyi (bkz. traffic analysis) toplar veya şifreyi kırmaya çalışır.

## Diğer saldırılardan farkı
Eavesdropping bu kategorinin **en pasif ve en temel** biçimidir: sadece dinleme. Traffic analysis, içeriği okuyamadığında bile trafiğin desenlerinden bilgi çıkarmaya odaklanır — eavesdropping'in bir adım ötesidir. Man-in-the-middle ise pasif değil **aktiftir**: saldırgan araya girip trafiği yönlendirir. Yani "sadece dinliyorsa" eavesdropping, "araya girip yönlendiriyorsa" MITM'dir.

## Savunma
- **WPA2 (CCMP/AES) veya WPA3** ile kablosuz trafiği şifrelemek; açık ağ ve WEP kullanmamak.
- Uygulama katmanında **HTTPS/TLS** ve gerekiyorsa **VPN** kullanmak — kablosuz şifreleme kırılsa bile içerik korunur.
- Açık/misafir ağlarda kullanıcıları hassas işlemler için VPN'e yönlendirmek.
- Fiziksel olarak sinyal taşmasını (signal leakage) azaltmak, kritik ortamlarda kapsama alanını sınırlamak.

> **Ayırt etmek için:** Saldırgan ağa hiç müdahale etmeden **yalnızca trafiği dinliyorsa** konu eavesdropping'dir.
