/* =========================================================
   disclaimer.js — sayfanın en altına kısa, sade bir yasal uyarı ekler.
   Yalnızca bu script'i çağıran sayfalarda görünür.
   Metni değiştirmek istersen aşağıdaki yazıyı düzenlemen yeterli.
   ========================================================= */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    var wrap = document.querySelector(".wrap");
    if(!wrap) return;
    var d = document.createElement("p");
    d.className = "disclaimer";
    d.innerHTML = "Bu sitedeki içerikler yalnızca eğitim ve farkındalık amaçlıdır. "
      + "Anlatılan teknikler yalnızca izinli sistemlerde ve yasal sınırlar içinde kullanılmalıdır.";
    var footer = wrap.querySelector("footer");
    if(footer) wrap.insertBefore(d, footer);   // footer'ın hemen üstüne
    else wrap.appendChild(d);                   // yoksa en sona
  });
})();
