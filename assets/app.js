/* =========================================================
   app.js — writeup / not listeleme ve gösterme mantığı.
   Hem liste sayfası hem de görüntüleme sayfası bunu kullanır.
   marked.js dosyayı Markdown'dan HTML'e çevirir.
   ========================================================= */

// URL'den ?p=slug parametresini okur (görüntüleme sayfası için)
function getParam(name){
  return new URLSearchParams(window.location.search).get(name);
}

// Liste sayfasında kartları oluşturur.
// posts: her biri {slug, title, desc, tags, src} olan bir dizi (posts.js'te tanımlı)
function renderList(posts, containerId){
  var box = document.getElementById(containerId);
  if(!box) return;
  box.innerHTML = posts.map(function(p){
    var tags = (p.tags || []).map(function(t){
      return '<span class="tag">'+t+'</span>';
    }).join('');
    return ''
      + '<a class="card" href="view.html?p='+encodeURIComponent(p.slug)+'">'
      +   '<h3>'+p.title+' <span class="arrow">→</span></h3>'
      +   (p.desc ? '<p>'+p.desc+'</p>' : '')
      +   '<div class="tags">'+tags+'</div>'
      + '</a>';
  }).join('');
}

// Görüntüleme sayfasında seçili yazıyı bulur, Markdown'ı çeker ve render eder.
async function renderPost(posts, titleId, contentId){
  var slug = getParam('p');
  var post = posts.find(function(p){ return p.slug === slug; });
  var titleEl = document.getElementById(titleId);
  var contentEl = document.getElementById(contentId);

  if(!post){
    titleEl.textContent = '404 — bulunamadı';
    contentEl.innerHTML = '<p class="dim">Bu yazı listede yok. <a href="index.html">← geri dön</a></p>';
    return;
  }

  titleEl.textContent = post.title;
  document.title = post.title + ' // writeup';

  try{
    var res = await fetch(post.src);
    if(!res.ok) throw new Error(res.status);
    var md = await res.text();
    // marked ile Markdown -> HTML
    contentEl.innerHTML = marked.parse(md);
  }catch(err){
    contentEl.innerHTML = '<p class="dim">İçerik yüklenemedi ('+err.message+'). '
      + 'Kaynak: <code>'+post.src+'</code></p>';
  }
}
