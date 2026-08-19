/* =========================================================
   repo-notes.js
   notlar/icerik/ klasöründeki .md dosyalarını GitHub API'den
   okuyup açılır-kapanır bir klasör ağacı olarak listeler,
   seçilen notu Markdown'dan render eder.
   ========================================================= */

function qp(name){ return new URLSearchParams(location.search).get(name); }

// "03-union-based.md" -> "Union Based"  (görünen ad için temizlik)
function pretty(name){
  return name.replace(/\.md$/i, "")
             .replace(/^\d+[-_]/, "")   // baştaki 00- 01- gibi sıra numarasını at
             .replace(/[-_]/g, " ")
             .trim();
}

// Düz dosya yolları listesini iç içe klasör ağacına çevirir.
// paths: ["modules/sql-injection/00-x.md", "cheatsheets/nmap.md", ...]
function buildTree(paths){
  var root = { dirs:{}, files:[] };
  paths.forEach(function(p){
    var parts = p.split("/");
    var file = parts.pop();
    var node = root;
    parts.forEach(function(seg){
      if(!node.dirs[seg]) node.dirs[seg] = { dirs:{}, files:[] };
      node = node.dirs[seg];
    });
    node.files.push({ name:file, path:p });
  });
  return root;
}

// Ağacı HTML'e çevirir (klasörler <details>, dosyalar link).
function treeToHTML(node){
  var html = "";
  Object.keys(node.dirs).sort().forEach(function(dir){
    html += '<details class="tree-folder" open>'
          +   '<summary>'+ pretty(dir) +'</summary>'
          +   '<div class="tree-inner">'+ treeToHTML(node.dirs[dir]) +'</div>'
          + '</details>';
  });
  node.files.sort(function(a,b){ return a.name.localeCompare(b.name); }).forEach(function(f){
    html += '<a class="tree-file" href="view.html?f='+ encodeURIComponent(f.path) +'">'
          +   pretty(f.name)
          + '</a>';
  });
  return html;
}

// GitHub API'den tüm dosya ağacını çeker (sadece .md ve icerik klasörü).
async function fetchNotePaths(cfg){
  var url = "https://api.github.com/repos/"+cfg.owner+"/"+cfg.repo
          + "/git/trees/"+cfg.branch+"?recursive=1&t="+Date.now();  // taze liste

  var res = await fetch(url, { cache: "no-store" });
  if(!res.ok) throw new Error("API "+res.status);
  var data = await res.json();
  var prefix = cfg.root + "/";
  var paths = (data.tree || [])
    .filter(function(x){ return x.type==="blob" && x.path.indexOf(prefix)===0 && /\.md$/i.test(x.path); })
    .map(function(x){ return x.path.slice(prefix.length); });  // icerik/ önekini at

  return paths;
}

// LİSTE sayfası: ağacı oluşturup containerId içine basar.
async function renderNotesTree(cfg, containerId){
  var box = document.getElementById(containerId);
  try{
    var paths = await fetchNotePaths(cfg);
    if(!paths.length){ box.innerHTML = '<p class="dim"># henüz not eklenmemiş</p>'; return; }
    box.innerHTML = treeToHTML(buildTree(paths));
  }catch(err){
    box.innerHTML = '<p class="dim">Liste yüklenemedi ('+err.message+'). '
      + 'Repo public mi ve '+cfg.root+' klasörü var mı diye kontrol et.</p>';
  }
}

// GÖRÜNTÜLEME sayfası: ?f= ile gelen notu çekip render eder.
async function renderNote(cfg, titleId, contentId, crumbId){
  var f = qp("f");
  var titleEl = document.getElementById(titleId);
  var contentEl = document.getElementById(contentId);
  var crumbEl = crumbId ? document.getElementById(crumbId) : null;

  if(!f){ titleEl.textContent = "not seçilmedi"; return; }

  var parts = f.split("/");
  var fileName = parts[parts.length-1];
  titleEl.textContent = pretty(fileName);
  document.title = pretty(fileName) + " // not";
  if(crumbEl) crumbEl.textContent = parts.map(pretty).join(" / ");

  try{
    // içerik aynı repoda olduğu için doğrudan (aynı origin) çekilir
    // ?t= ile her seferinde taze sürüm alınır (tarayıcı önbelleğini atla)
    var src = cfg.root.split("/").pop() + "/" + f + "?t=" + Date.now();
    var res = await fetch(src, { cache: "no-store" });
    if(!res.ok) throw new Error(res.status);
    var md = await res.text();
    contentEl.innerHTML = marked.parse(md);
  }catch(err){
    contentEl.innerHTML = '<p class="dim">İçerik yüklenemedi ('+err.message+').</p>';
  }
}
