# MAC Spoofing

## Nedir?
MAC spoofing, bir ağ arayüzünün donanıma gömülü MAC adresini yazılımla geçici olarak başka bir değerle değiştirmektir. İşletim sistemi, gönderdiği çerçevelerde gerçek MAC yerine bu sahte adresi kullanır. Erişim kontrolü bağlamında asıl amaç, **yetkili bir cihazın MAC adresini taklit edip MAC filtresini aşmaktır**.

## Hedeflediği zafiyet: MAC filtreleme
Birçok AP, "yalnızca şu MAC adreslerine izin ver" şeklinde bir filtre ile basit bir erişim kontrolü sunar. Bu önlemin kritik zayıflığı şudur: **MAC adresleri havada şifresiz taşınır.** Yani saldırgan ağa hiç bağlı olmadan, sadece trafiği dinleyerek (`airodump-ng`) izinli istemcilerin MAC adreslerini öğrenebilir. Sonrasında kendi kartının MAC'ini bunlardan biriyle değiştirir ve AP onu "tanıdık cihaz" sanıp içeri alır.

## Nasıl çalışır?
1. Saldırgan, hedef ağın trafiğini pasif olarak dinler ve ağa bağlı yetkili bir istemcinin MAC adresini tespit eder.
2. Kendi kablosuz kartının MAC adresini bu değerle değiştirir.
3. Gerçek cihaz ağdan düştüğünde (ya da deauth ile düşürüldüğünde) saldırgan onun kimliğiyle ağa katılır.

Linux'ta tipik komut dizisi:
```bash
ifconfig wlan0 down
macchanger -m 00:11:22:33:44:55 wlan0   # belirli bir MAC
# veya rastgele bir MAC için:
macchanger -r wlan0
ifconfig wlan0 up
```

## Önemli bir ayrım: kendi MAC'ini değiştiriyorsun
Sıkça karışan bir nokta: saldırgan karşı cihazın MAC'ini uzaktan değiştirmez. Sadece **kendi cihazının** gönderdiği çerçevelerde yazan adresi değiştirir. Yani fiziksel olarak hedefe dokunmaz, yalnızca kendini onun kimliğiyle tanıtır. Benzetmeyle: donanımdaki gerçek MAC pasaporttaki isim gibi kalıcıdır; spoofing ise üzerine başka bir isim yazılı sahte bir yaka kartı takmaktır. Kapıdaki görevli (AP) yaka kartına bakıyorsa, kartı değiştirince seni o kişi sanır.

## Çakışma sorunu
Gerçek cihaz da aynı anda ağdaysa, iki aynı MAC adresi çakışır ve bu durum genelde WIDS/WIPS tarafından "aynı MAC iki farklı yerde" olarak yakalanır. Bu yüzden saldırgan çoğunlukla hedef cihaz ağdan düştüğünde veya onu deauthentication ile düşürdükten sonra araya girer.

## Nerede kullanılır?
MAC spoofing tek başına bir saldırı olduğu kadar, başka saldırıların da parçasıdır: Evil Twin'de sahte AP'yi gerçek AP'nin BSSID'si gibi göstermek, captive portal / süre kotası atlatmak veya izleri gizlemek için de aynı teknik kullanılır.

## Önemli sınırı
MAC adresi yalnızca aynı yerel ağ (Layer 2) içinde geçerlidir; router'ı geçince değişir. Dolayısıyla spoofing internet üzerinde köken gizlemez, sadece yerel segmentte etkilidir.

## Savunma
- MAC filtrelemeyi **tek başına** bir güvenlik önlemi olarak görmemek — kolayca aşılır, olsa olsa ek bir katmandır.
- Gerçek erişim kontrolü için **802.1X** kimlik doğrulaması ve **WPA2/WPA3** şifrelemesi kullanmak.
- WIDS/WIPS ile aynı MAC'in iki noktadan görünmesi veya ani MAC değişimi gibi anomalileri izlemek.

> **Ayırt etmek için:** "MAC filtresini aşmak için ne yapılır?" → MAC spoofing. Konu yetkili bir cihazın **kimliğini** taklit etmekse bu saldırıdır.
