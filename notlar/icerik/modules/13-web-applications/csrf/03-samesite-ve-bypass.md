# CSRF — SameSite Cookie ve Atlatma Senaryoları

Bu not, CSRF'ye karşı bir savunma mekanizması olan **SameSite cookie**
özniteliğini ve yanlış/eksik kullanıldığında nasıl atlatıldığını anlatır. Temel
saldırı için bkz. `01-saldiri-adimlari.md`, savunma için bkz.
`02-tespit-ve-savunma.md`.

## SameSite nedir?

SameSite, bir cookie'nin **cross-site (siteler arası) isteklerde** gönderilip
gönderilmeyeceğini kontrol eden bir cookie özniteliğidir. CSRF'nin temelinde
"tarayıcı cookie'yi her isteğe otomatik ekler" mantığı olduğu için, SameSite bu
otomatik gönderimi kısıtlayarak CSRF'yi doğrudan hedefler. Üç değeri vardır:

| Değer | Davranış | CSRF koruması |
|---|---|---|
| **Strict** | Cookie yalnızca **aynı site** kaynaklı isteklerde gönderilir | En yüksek; cross-site isteklerde cookie hiç gitmez |
| **Lax** | Cookie, cross-site **top-level navigation** + güvenli metotlarda (GET/HEAD/OPTIONS) gönderilir; cross-site POST'ta gönderilmez | Orta; GET ile yapılan işlemler hâlâ risklidir |
| **None** | Cookie tüm cross-site isteklerde gönderilir; `Secure` zorunludur | Yok; eski davranış |

## Senaryo 1 — Lax + GET ile CSRF

**Mantık:** Durum değiştiren bir işlem (ör. logout) **GET** ile tetiklenebiliyorsa
ve ilgili cookie `Lax` ise, cookie cross-site top-level GET navigasyonunda hâlâ
gönderilir. Yani Lax, GET ile yapılan işlemleri korumaz.

Örnek sunucu tarafı — belirli bir cookie değeri geldiğinde oturumu kapatır:

```php
if ($_COOKIE["logout"] == "xxxxxxx") {
    session_destroy();
    // ...
}
```

**Saldırı adımları:**
1. Durum değiştiren işlemin (logout) **GET** ile çağrılabildiğini tespit et.
2. İlgili cookie'nin `SameSite=Lax` (veya belirtilmemiş) olduğunu doğrula.
3. İşlemi tetikleyen basit bir bağlantı hazırla:

   ```html
   <a href="https://hedef-site.com/logout.php" target="_blank">Anket Linki</a>
   ```

4. Kurbanı sosyal mühendislikle bu bağlantıya tıklat. Top-level GET navigasyonu
   olduğu için `Lax` cookie gönderilir; sunucu isteği meşru sayar ve işlemi yapar
   (kurban oturumu kapatılır).

**Eksik olan:** Cookie `Strict` olsaydı cross-site istekte hiç gönderilmez ve
saldırı çalışmazdı. Ayrıca durum değiştiren işlem GET ile sunulmamalıydı.

## Senaryo 2 — Lax + POST (Chrome 2 dakika penceresi) zincirleme

**Arka plan:** Bir cookie `SameSite` özniteliği **belirtilmeden** set edilmişse,
Chrome bunu varsayılan olarak `Lax` kabul eder — **ancak bir istisnayla**: cookie
son **2 dakika** içinde set edilmişse, cross-site **top-level POST** isteğinde de
gönderilir (geçici "Lax+POST" davranışı). Yani yeni set edilmiş, SameSite'sız bir
cookie, kısa bir pencere boyunca `None` gibi davranır.

Bu, tek başına POST ile atlatılamayan bir korumayı, cookie'yi **taze set ettiren**
bir işlemle zincirleyerek aşmayı mümkün kılar.

Örnek hedef — POST ile bir cookie değerini güncelleyen, ama isteğin ilgili cookie'yi
taşımasını bekleyen bir uç nokta:

```php
if (!isset($_COOKIE['isBanned'])) { exit(); }      // cookie yoksa reddet
if (isset($_POST['isBanned'])) {
    $status = $_POST['isBanned'];
    // cookie değerini güncelle
}
```

Doğrudan cross-site POST'ta `isBanned` cookie'si gönderilmediği için istek
reddedilir. Çözüm, cookie'yi taze set ettiren bir işlemi tetikleyip 2 dakikalık
pencereyi kullanmaktır.

**Saldırı adımları:**
1. Hedef cookie'nin `SameSite` **belirtilmeden** set edildiğini doğrula.
2. Bu cookie'yi sunucunun **yeniden set ettiği** bir işlem bul (ör. login veya
   logout sırasında cookie güncelleniyor).
3. Payload'ı, önce o işlemi tetikleyip (cookie tazelenir) hemen ardından asıl POST
   isteğini atacak şekilde zincirle:

   ```html
   <script>
   function launchAttack() {
     let win = window.open("https://hedef-site.com/logout.php", "");  // cookie'yi tazeler
     setTimeout(function(){ win.close(); bank.submit(); }, 1000);     // 2 dk pencere içinde POST
   }
   </script>
   <form style="display:none" name="bank" method="post"
         action="https://hedef-site.com/index.php">
     <input name="isBanned" value="true">
   </form>
   ```

4. Kurban payload'ı açtığında: önce cookie'yi tazeleyen sayfa açılır, sonra 2
   dakikalık pencere içinde cross-site POST gönderilir. Chrome cookie'yi bu pencerede
   gönderdiği için istek kabul edilir ve cookie değeri güncellenir.

## Savunma

1. **Hassas/durum cookie'lerinde açıkça `SameSite=Strict` kullan.** Varsayılana
   (Lax) güvenme; durum değiştiren işlemlere ait cookie'lerde Strict en güvenlisidir.
2. **Durum değiştiren işlemi GET ile sunma** — yalnızca POST + anti-CSRF token.
3. **SameSite'ı tek savunma sayma.** SameSite defense-in-depth'tir; asıl koruma
   sunucu tarafı **CSRF token**'dır (bkz. `01` ve `02`). Token + Strict birlikte
   kullanılır.
4. **`Secure` ekle** ve cookie'leri yalnızca HTTPS üzerinden gönder.

> Not: Senaryo 2'deki "2 dakika / Lax+POST" davranışı Chrome'un geçiş dönemine ait
> bir toleranstır; tarayıcı sürümüne göre değişir ve zamanla sıkılaştırılmıştır.
> Güncel tarayıcılarda her zaman çalışmayabilir — ama SameSite'ı belirtmeden cookie
> set etmenin neden riskli olduğunu gösterir. Çözüm yine aynı: özniteliği açıkça
> ayarlamak.
