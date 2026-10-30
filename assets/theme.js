/* =========================================================
   theme.js — tema seçici (sağ altta renk noktaları)
   <head> içinde yüklenir: seçili temayı boyamadan ÖNCE uygular (flash yok),
   arayüzü DOM hazır olunca ekler. Seçim tarayıcıda (localStorage) saklanır.
   ========================================================= */
(function(){
  var THEMES = [
    { id:"amber", name:"Amber",  c:"#ffb000" },
    { id:"green", name:"Yeşil",  c:"#4ade80" },
    { id:"cyber", name:"Cyber",  c:"#22d3ee" },
    { id:"pro",   name:"Mavi",   c:"#58a6ff" },
    { id:"light", name:"Açık",   c:"#e8e0cc" }
  ];
  var KEY = "bb-theme";
  var saved = null;
  try{ saved = localStorage.getItem(KEY); }catch(e){}
  var current = saved || "amber";

  // erken uygula (boyama öncesi)
  document.documentElement.setAttribute("data-theme", current);

  function buildUI(){
    if(document.querySelector(".theme-switch")) return;
    var bar = document.createElement("div");
    bar.className = "theme-switch";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Tema seçimi");
    THEMES.forEach(function(t){
      var b = document.createElement("button");
      b.className = "theme-dot" + (current === t.id ? " active" : "");
      b.title = t.name;
      b.setAttribute("aria-label", "Tema: " + t.name);
      b.style.background = t.c;
      b.onclick = function(){
        current = t.id;
        document.documentElement.setAttribute("data-theme", current);
        try{ localStorage.setItem(KEY, current); }catch(e){}
        bar.querySelectorAll(".theme-dot").forEach(function(x){ x.classList.remove("active"); });
        b.classList.add("active");
      };
      bar.appendChild(b);
    });
    document.body.appendChild(bar);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", buildUI);
  }else{
    buildUI();
  }
})();
