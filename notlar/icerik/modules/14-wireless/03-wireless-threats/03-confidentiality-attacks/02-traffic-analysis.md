# Traffic Analysis

## Nedir?
Traffic analysis, saldırganın trafiğin **içeriğini okuyamasa bile**, trafiğin kendisinden (kim kiminle konuşuyor, ne zaman, ne kadar sık, ne büyüklükte) anlamlı bilgi çıkarmasıdır. Şifreleme içeriği gizler ama trafiğin var olduğu gerçeğini, taraflarını ve desenlerini her zaman gizleyemez — traffic analysis tam olarak bu "kalıntı" bilgiyi kullanır.

## Hedeflediği zafiyet
Şifreleme, paketin **içini** korur; ama paketin başlıklarındaki bazı bilgiler (MAC adresleri, paket boyutları, zamanlama, yön) çoğu zaman gözlemlenebilir kalır. Saldırgan bu meta veriyi toplayıp örüntü analizi yaparak çok şey öğrenebilir — üstelik hiçbir şifre kırmadan.

## Neler çıkarılabilir?
- **Kim aktif, kim kiminle haberleşiyor:** MAC adresleri ve bağlantı örüntülerinden cihazlar ve ilişkileri.
- **Ne zaman yoğunluk var:** Trafiğin zamanlaması, çalışma saatlerini veya belirli olayları ele verebilir.
- **Ne tür bir aktivite:** Paket boyutu ve akış deseni, video akışı mı, dosya aktarımı mı, kısa mesajlaşma mı olduğunu tahmin ettirebilir.
- **Ağ topolojisi:** Hangi istemcilerin hangi AP'ye bağlı olduğu, hangi cihazın "merkez" olduğu.

Bu bilgiler tek başına masum görünse de, bir saldırının keşif (reconnaissance) aşamasını besler ve sonraki aktif saldırıları hedefler.

## Diğer saldırılardan farkı
Eavesdropping trafiğin **içeriğini** okumayı hedefler; traffic analysis ise içerik okunamasa bile **meta veriden** bilgi çıkarır. Bu yüzden traffic analysis, güçlü şifreleme karşısında bile kısmen işe yarayan, daha "dolaylı" bir gizlilik saldırısıdır. İkisi genelde birlikte yürür: saldırgan önce dinler, okuyabildiğini okur, okuyamadığından da desen çıkarır.

## Savunma
- Güçlü şifreleme (WPA2/WPA3 + uygulama katmanında TLS) temel koruma olsa da meta veriyi tamamen gizlemez; bu yüzden ek önlemler gerekir.
- **VPN/tünelleme:** Trafiği tek bir şifreli tünele toplayarak iç desenleri gizlemeye yardımcı olur.
- Kritik ortamlarda **trafik dolgusu (padding)** ve sabit hızlı iletim gibi ileri teknikler, boyut/zamanlama sızıntısını azaltır.
- Sinyal taşmasını sınırlamak, dış konumdan pasif gözlemi zorlaştırır.

> **Ayırt etmek için:** Saldırgan içeriği çözemediği halde **trafiğin deseninden/meta verisinden** bilgi çıkarıyorsa konu traffic analysis'tir.
