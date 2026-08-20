/* =========================================================
   disclaimer.js — her sayfanın üstüne kısa yasal uyarı ekler.
   Metni değiştirmek istersen aşağıdaki yazıyı düzenlemen yeterli.
   ========================================================= */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    var wrap = document.querySelector(".wrap");
    if(!wrap) return;
    var d = document.createElement("div");
    d.className = "disclaimer";
    d.innerHTML = "⚠ Bu sitedeki içerikler yalnızca eğitim ve farkındalık amaçlıdır. "
      + "Anlatılan teknikler yalnızca <strong>izinli</strong> sistemlerde ve yasal sınırlar içinde "
      + "kullanılmalıdır; her türlü sorumluluk kullanıcıya aittir.";
    wrap.insertBefore(d, wrap.firstChild);
  });
})();
