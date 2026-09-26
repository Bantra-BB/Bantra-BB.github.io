# Path Traversal Nedir?
Path traversal, üzerinde uygulama çalıştıran bir sunucudan dosya okunmasına sebebiyet veren aynı zamanda "Directory Traversal" olarak da bilinen bir zafiyettir. Bazı durumlarda saldırganlara dosyaların üzerine yazarak uygulama veri veya davranışlarını değiştirerek sunucuda kontrol alma fırsatı da oluşturur.

## Path Traversal ile Dosya Okuma
Web uygulamalarının önemli bir kısmı, kullanıcıya sunucudaki belirli dosyaları (resim, PDF, döküman) göstermek zorundadır. Bunu yapmanın en basit yolu, kullanıcıdan bir dosya adı almak ve o adı sunucudaki gerçek dosya yoluna eklemektir.

Bir alışveriş uygulaması düşün — ürün resimlerini şu şekilde gösteriyor:
```html
<img src="/loadImage?filename=218.png">
```
`loadImage` endpoint'i, `filename` parametresini alıyor ve karşılığındaki dosyanın içeriğini döndürüyor. Resimler sunucuda `/var/www/images/` klasöründe tutuluyor. Uygulama, gelen `filename` değerini bu klasör yoluna ekleyerek gerçek dosya yolunu oluşturuyor:
```
/var/www/images/218.png
```

Eğer uygulama bu `filename` parametresini **hiç doğrulamıyorsa**, saldırgan normal bir resim adı yerine şunu gönderebilir:
```
https://site.com/loadImage?filename=../../../etc/passwd
```
Uygulama bunu aynı mantıkla klasör yoluna ekler:
```
/var/www/images/../../../etc/passwd
```

Şimdi bu yolun nasıl çözümlendiğine bak. `../` dizin ağacında **bir üst seviyeye çık** demek. Üç `../` art arda geldiğinde:
- 1. `../` → `/var/www/`
- 2. `../` → `/var/`
- 3. `../` → `/` (dosya sisteminin köküne çıkılır)

Kökten sonra gelen `etc/passwd` eklenince, işletim sistemi fiilen şu dosyayı okur:
```
/etc/passwd
```
Uygulamacının kastettiği `/var/www/images/` klasörünün tamamen dışına çıkılmış oldu — sunucudaki **herhangi bir dosyaya**, sadece doğru sayıda `../` ile erişilebilir hale geldi.

**Unix'te `/etc/passwd`** klasik hedef çünkü sunucudaki kayıtlı kullanıcıları listeleyen standart bir dosya — zafiyeti kanıtlamak için sık kullanılır (parola hash'i tutmaz artık, modern sistemlerde, ama zafiyetin varlığını net gösterir).

**Windows'ta** hem `/` hem `\` geçerli bir traversal ayırıcısı sayılır:
```
https://site.com/loadImage?filename=..\..\..\windows\win.ini
```

**Etki neden ciddi?** Sadece resim dosyası okuma zafiyeti gibi görünse de, aynı mekanizma ile şunlara erişilebilir:
- Uygulamanın kendi kaynak kodu ve config dosyaları (içinde DB şifreleri, API anahtarları olabilir)
- Arka uç sistemlere ait kimlik bilgileri
- Hassas işletim sistemi dosyaları

Bazı durumlarda uygulama sadece okumakla kalmayıp **yazmaya** da izin veriyorsa (dosya yükleme, log yazma gibi), saldırgan aynı `../` mantığıyla rastgele bir dosyaya **yazabilir** — bu da uygulama davranışını değiştirmekten sunucunun tamamen ele geçirilmesine kadar gidebilir. Bu ikinci senaryo (write) daha nadir ama fark edildiğinde etkisi read'den çok daha büyük.

## Lab
Bu labda amaç `/etc/passwd` dosyasını okumak. Bunun için burp uygulamasını proxy olarak açıp bir sayfaya girdim.
<img width="1239" height="1075" alt="image" src="Path-Traversal-Imags/PathT1.png" />

Giden isteklerde `/image?filename=60.jpg` ifadesi vardı.
<img width="1596" height="892" alt="PathT2" src="Path-Traversal-Imags/PathT2.png" />

Bu istekte bulunan filename parametresi manipüle edilip `/etc/passwd` okundu. 
<img width="1597" height="893" alt="PathT3" src="Path-Traversal-Imags/PathT3.png" />
