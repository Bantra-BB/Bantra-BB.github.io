/* =========================================================
   layout.js — 3 sütun docs düzeni (Layout C)
   Sol: klasör menüsü · Orta: içerik · Sağ: not içindekiler
   repo-notes.js'teki yardımcıları kullanır (ondan SONRA yüklenmeli).
   Sayfaya eklemek için:  <script>initLayout(NOTES_CONFIG)</script>
   ========================================================= */

/* Sol menü ağacını HTML'e çevirir (kompakt; sadece aktif konu vurgulu). */
function navTreeToHTML(node, prefix, active, depth){
  var html = "";
  Object.keys(node.dirs).sort().forEach(function(dir){
    var p = prefix ? prefix + "/" + dir : dir;
    var open = (depth === 0) || (active && active.indexOf(p + "/") === 0) ? " open" : "";
    html += '<details class="nav-f"'+ open +'>'
          +   '<summary>'+ pretty(dir) +'</summary>'
          +   '<div class="nav-sub">'+ navTreeToHTML(node.dirs[dir], p, active, depth + 1) +'</div>'
          + '</details>';
  });
  node.files.sort(function(a,b){ return a.name.localeCompare(b.name); }).forEach(function(f){
    var cls = (active && f.path === active) ? " active" : "";
    html += '<a class="nav-i'+ cls +'" href="view.html?f='+ encodeURIComponent(f.path) +'">'
          +   pretty(f.name)
          + '</a>';
  });
  return html;
}

/* Başlık metninden benzersiz bir id üretir (Türkçe karakterleri sadeleştirir). */
function slugify(t, used){
  var s = (t || "").toLowerCase()
    .replace(/ı/g,"i").replace(/ş/g,"s").replace(/ğ/g,"g")
    .replace(/ü/g,"u").replace(/ö/g,"o").replace(/ç/g,"c")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"") || "bolum";
  var base = s, n = 2;
  while(used[s]){ s = base + "-" + n; n++; }
  used[s] = 1;
  return s;
}

/* Sağ "içindekiler" panelini kurar + kaydırmaya göre aktif başlığı işaretler. */
function setupTOC(contentEl, tocEl, layout){
  function build(){
    var hs = contentEl.querySelectorAll("h2, h3");
    if(hs.length < 2){                       // çok az başlık → içindekiler gösterme
      layout.classList.remove("has-toc");
      if(tocEl) tocEl.style.display = "none";
      return;
    }
    var used = {}, html = '<div class="toc-title"># içindekiler</div>';
    hs.forEach(function(h){
      if(!h.id) h.id = slugify(h.textContent, used);
      var lvl = h.tagName === "H3" ? " lvl3" : "";
      html += '<a class="toc-link'+ lvl +'" href="#'+ h.id +'">'+ h.textContent +'</a>';
    });
    tocEl.innerHTML = html;
    spy(contentEl, tocEl);
  }

  // İçerik hazırsa hemen kur; değilse gelmesini bekle (renderNote async).
  if(contentEl.querySelector("h2, h3")){ build(); return; }
  var mo = new MutationObserver(function(){
    if(contentEl.querySelector("h2, h3")){ mo.disconnect(); build(); }
  });
  mo.observe(contentEl, { childList:true, subtree:true });
  setTimeout(function(){
    if(contentEl.querySelector("h2, h3")){ try{ mo.disconnect(); }catch(e){} build(); }
  }, 4000);
}

/* Kaydırdıkça o an okunan başlığı içindekilerde vurgular. */
function spy(contentEl, tocEl){
  var hs = [].slice.call(contentEl.querySelectorAll("h2, h3"));
  var links = tocEl.querySelectorAll(".toc-link");
  var map = {};
  links.forEach(function(a){ map[a.getAttribute("href").slice(1)] = a; });
  var ticking = false;
  function onScroll(){
    if(ticking) return; ticking = true;
    requestAnimationFrame(function(){
      ticking = false;
      var cur = null;
      for(var i=0;i<hs.length;i++){
        if(hs[i].getBoundingClientRect().top <= 140) cur = hs[i]; else break;
      }
      if(!cur) cur = hs[0];
      links.forEach(function(a){ a.classList.remove("active"); });
      if(cur && map[cur.id]) map[cur.id].classList.add("active");
    });
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();
}

/* Ana giriş: grid iskeletini kurar, menüyü ve (not sayfasında) içindekileri doldurur. */
function initLayout(cfg){
  var wrap = document.querySelector(".wrap");
  if(!wrap) return;
  var isView = !!document.getElementById("icerik");

  // bölüm etiketi (notlar / writeups)
  var sect = (cfg.root.split("/")[0] || "");
  var sectLabel = sect === "writeups" ? "// writeups" : "// bilgi bankası";

  // grid iskeleti
  var layout = document.createElement("div");
  layout.className = "doc-layout" + (isView ? " has-toc" : "");
  var side = document.createElement("aside");
  side.className = "doc-side";
  side.innerHTML =
      '<div class="doc-brand"><a href="../index.html">Bantra-BB</a></div>'
    + '<div class="doc-brand-sub"><a href="index.html">'+ sectLabel +'</a></div>'
    + '<div class="doc-nav" id="docNav"><p class="dim" style="padding:6px 8px"># yükleniyor…</p></div>';

  wrap.parentNode.insertBefore(layout, wrap);
  layout.appendChild(side);
  layout.appendChild(wrap);
  wrap.classList.add("doc-main");

  var tocEl = null;
  if(isView){
    tocEl = document.createElement("nav");
    tocEl.className = "doc-toc";
    layout.appendChild(tocEl);
  }

  // mobil menü düğmesi
  var btn = document.createElement("button");
  btn.className = "nav-toggle";
  btn.setAttribute("aria-label", "menü");
  btn.textContent = "☰";
  btn.onclick = function(){ layout.classList.toggle("nav-open"); };
  document.body.appendChild(btn);
  side.addEventListener("click", function(e){
    if(e.target.closest(".nav-i")) layout.classList.remove("nav-open");
  });

  // ağacı bir kez çek → menü + (liste sayfasında) ana ağaç
  fetchNotePaths(cfg).then(function(paths){
    var active = qp("f");
    var tree = buildTree(paths);
    var nav = document.getElementById("docNav");
    if(nav) nav.innerHTML = navTreeToHTML(tree, "", active, 0);
    var act = side.querySelector(".nav-i.active");
    if(act) act.scrollIntoView({ block:"center" });

    var agac = document.getElementById("agac");   // liste sayfasındaki ana ağaç
    if(agac) agac.innerHTML = treeToHTML(tree);
  }).catch(function(err){
    var nav = document.getElementById("docNav");
    if(nav) nav.innerHTML = '<p class="dim" style="padding:6px 8px">menü yüklenemedi</p>';
  });

  if(isView) setupTOC(document.getElementById("icerik"), tocEl, layout);
}
