# UNION-based SQL Injection

## Mekanik
SQL dilinde `UNION` keyword'ü birden fazla `SELECT` sorgusunu çalıştırmak için kullanılır. 
Örnek:
```sql
SELECT a, b FROM table1 UNION SELECT c, d FROM table2
```
Bu sorgu ile hem table1'den a ve b sütunları hem de table2'den c ve d sütunları çekilir.

Bir UNION sorgusunun çalışması için 2 şartın sağlanması gerekmektedir. Bunlar:
1. Ayrı sorgular aynı sayıda sonuç döndürmeli. Örnekte olduğu gibi table1 ve 2 den ikişer sonuç döndü.
2. Her bir sütundaki veri türleri ayrı sorgularda uyumlu olmalıdır.

UNION based SQL injection için:
1. Orijinal sorgudan döndürülen sonuç sayısı.
2. Orijinal sorgudan döndürülen sütunlardan hangileri, enjekte edilen sorgunun sonuçlarını barındırabilecek uygun veri türüne sahip?
bilgilerinin bilinmesi gerekmektedir.

## PoC / Payload

### Sütun Sayısının Tespiti
Sütun sayısının tespitinde 2 ana metod vardır bunlardan birincisi. `ORDER BY` keyword'ü ile yapılır. Bunun için ORDER BY şartı arttırmalı şekilde hata vermeyene kadar veya farklı sonuç alınana kadar denenir. Uygulamanın hata vermediği noktada sütun sayısı belirlenmiş olunur.

```sql
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--
      .
      .
```

Diğer bir yol olarak da `'UNION SELECT NULL` sorgusu kullanılarak tespit edilir. Bu yolda `NULL` sayısı her denemede arttırılır ve yine diğer yolda olduğu gibi farklı bir cevap alana kadar devam ettirilir.

```sql
'UNION SELECT NULL --
'UNION SELECT NULL, NULL --
'UNION SELECT NULL, NULL, NULL --
```
ORDER BY yönteminde olduğu gibi, uygulama HTTP yanıtında aslında veritabanı hatasını döndürebilir, ancak genel bir hata mesajı verebilir ya da hiç sonuç döndürmeyebilir. Null değerlerin sayısı sütun sayısıyla eşleştiğinde, veritabanı sonuç kümesinde her sütunda null değerler içeren ek bir satır döndürür. Bunun HTTP yanıtı üzerindeki etkisi, uygulamanın koduna bağlıdır. 
Şanslıysanız, yanıtta HTML tablosundaki fazladan bir satır gibi bazı ek içerikler görebilirsiniz. Aksi takdirde, null değerler NullPointerException gibi farklı bir hataya neden olabilir. En kötü durumda, yanıt, yanlış sayıda null değerinden kaynaklanan bir yanıtla aynı görünebilir. Bu da bu yöntemi etkisiz hale getirir. 

### Kullanışlı Veri Tipi İçeren Sütunun Tespiti

Orijinal sorguda kullanılan sütun sayısının tespitinden sonra uygulama hakkında veya veri tabanında bulunan verilerin çıkartılması için kullanılabilinecek sütunun tespit edilmesi gerekir. Bunun için de bir önceki adımda kullanılan NULL parametresi yerine bir string değer yazılır ve uygulamada değişiklikler gözlemlenir
```sql
' UNION SELECT 'a',NULL,NULL,NULL--
' UNION SELECT NULL,'a',NULL,NULL--
' UNION SELECT NULL,NULL,'a',NULL--
' UNION SELECT NULL,NULL,NULL,'a'--
```
Veri tabanı ve generic bir hata mesajı görüntülenebilir o durumda bir sonraki NULL değeri yerine string ifade yazılır ve tekrar denenir.

İlgili sütunlar da tespit edildikten sonra artık veri tabanı ve tablolar hakkında bilgi toplanmabilinir.

## Lab Walktrough

### Sütun Sayısı Tespiti

Bu lab ortamında UNION SELECT NULL sorgusu ile sütun sayısı tespiti yapıldı. Sayfada bulunan kategori sorgusu `'UNION SELECT NULL -- -` ile manipüle edildi ve hata verdiği gözlemlendi.  
<img width="1185" height="401" alt="{B24E0654-9FF1-4D80-B78D-96C4B6048E78}" src="images/union-sql1.png" />

NULL sayısı arttırıldığında yani `'UNION SELECT NULL, NULL, NULL -- -` sorgusu yapıldığında hata vermediği ve başarılı bir şekilde sorguda 3 sütun olduğu tespit edildi.
<img width="1260" height="648" alt="{48845B01-9D67-49E1-9683-ACFB1FFC77B3}" src="images/union-sql2.png" />

### Kullanışlı Sütunun Tespiti

Bir önceki lab'da olduğu gibi sütun sayısı tespit edildi ardından NULL değerleri yerine string ifade yazıldı ve uygulamanın hata verdiği gözlemlendi.
<img width="971" height="351" alt="{DD995729-76B4-484C-8D9A-FF4486C83039}" src="images/union-sql3.png" />

Ardından bir sonraki NULL değeri ile değiştirilerek tekrar tekrar denendi ve sonunda doğru sonuca ulaşıldı.
<img width="1221" height="736" alt="{BCCA6263-8F37-4DFD-AFE3-B02C543B8392}" src="images/union-sql4.png" />

### Bilgi Toplama

Bu uygulamada da öncelikle sütun sayısı tespit edildi ve ardından ilgili sütunlar tespit edildi. (Enumeration için birden fazla sütun da kullanılabilinir) 

<img width="1261" height="719" alt="{1769D40F-D522-46F2-817D-CED3FA398334}" src="images/union-sql5.png" />

Bu sütunlar kullanılarak enumeration işlemine başlandı öncelikle information_schema.tables ile tablo isimleri öğrenildi ve users tablosu tespit edildi.

<img width="1206" height="989" alt="{DAF814D5-94BF-48D9-A5B4-CD749836FB52}" src="images/union-sql6.png" />

Ardından users tablosuna ait sütun isimleri öğrenildi.
`'UNION SELECT column_name, 'b' FROM information_schema.columns WHERE table_name='users'--`

<img width="1339" height="873" alt="{22A43710-DB51-4802-BE4A-FC0BC7CC4542}" src="images/union-sql7.png" />

Son olarak kullanıcı bilgileri users tablosundan elde edildi.

<img width="1229" height="865" alt="{28C74637-8229-426C-A5F8-A97DEDFB211E}" src="images/union-sql8.png" />

Admin olarak giriş yapıldığından lab tamamlandı.

### Aynı Sütunda Birden Çok Veri Almak

Diğer lab'larda olduğu gibi öncelikle sütun sayısı ve string ifadesi döndüren sütun tespit edildi. Ardından veri döndüren sütundan kullanıcı adı ve şifre bilgilerini elde etmek için `'UNION SELECT NULL, username || ':' || password FROM users --` payload'ı kullanıldı ve admin kullanıcı bilgileri elde edildi.
<img width="1213" height="774" alt="{E3D7466D-E7B8-42B1-88CC-05F3E755D28C}" src="images/union-sql9.png" />
