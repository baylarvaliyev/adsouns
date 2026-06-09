/* features.js — AdsOnUs v3
   Includes: page transitions, cookie banner, social proof toasts,
   reading progress bar, back-to-top, WA pre-fill, dark mode */
(function(){

var WA_MSG = encodeURIComponent('Salam! AdsOnUs saytından yazıram. Pulsuz sınaq barədə məlumat almaq istəyirdim.');
var WA_BASE = 'https://wa.me/994773698929?text=' + WA_MSG;

/* ══════════════════════════════════════════════
   1. PAGE TRANSITIONS
══════════════════════════════════════════════ */
var overlay = document.createElement('div');
overlay.id = 'pg-overlay';
overlay.style.cssText = [
  'position:fixed;inset:0;z-index:9500;pointer-events:none',
  'background:#060A12',
  'transform:translateY(100%)',
  'transition:transform .55s cubic-bezier(0.76,0,0.24,1)'
].join(';');
document.body.appendChild(overlay);

// Reveal on load: slide up from bottom
function revealPage(){
  overlay.style.transform = 'translateY(0)';
  overlay.style.transition = 'none';
  requestAnimationFrame(function(){
    overlay.style.transition = 'transform .65s cubic-bezier(0.76,0,0.24,1)';
    requestAnimationFrame(function(){
      overlay.style.transform = 'translateY(-100%)';
    });
  });
}

document.addEventListener('DOMContentLoaded', function(){ setTimeout(revealPage, 20); });

// On internal link click: slide in from bottom, then navigate
document.addEventListener('click', function(e){
  var a = e.target.closest('a[href]');
  if(!a) return;
  var href = a.getAttribute('href');
  // Skip: external, hash, tel, wa, mailto, blank target
  if(!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')
    || href.includes('wa.me') || a.target === '_blank' || href.startsWith('http') && !href.includes('adsonus.com'))
    return;
  e.preventDefault();
  overlay.style.transition = 'transform .5s cubic-bezier(0.76,0,0.24,1)';
  overlay.style.transform = 'translateY(0)';
  setTimeout(function(){ window.location.href = href; }, 520);
}, true);


/* ══════════════════════════════════════════════
   2. COOKIE CONSENT BANNER
══════════════════════════════════════════════ */
if(!localStorage.getItem('cookie_ok')){
  var cb = document.createElement('div');
  cb.id = 'cookie-banner';
  cb.innerHTML = [
    '<div id="cb-inner">',
    '<p>Bu sayt xidmət keyfiyyətini artırmaq və reklam effektivliyini ölçmək üçün cookie (Meta Pixel, analitika) istifadə edir.',
    ' <a href="/pages/mexfilik.html" style="color:#5B8EFF;text-decoration:none;">Ətraflı</a></p>',
    '<div id="cb-btns">',
    '<button id="cb-accept" onclick="acceptCookies()">Qəbul Et</button>',
    '<button id="cb-decline" onclick="declineCookies()">Rədd Et</button>',
    '</div></div>'
  ].join('');
  document.body.appendChild(cb);

  var cbStyle = document.createElement('style');
  cbStyle.textContent = [
    '#cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:800;background:rgba(10,14,28,.97);',
    'border-top:1px solid rgba(255,255,255,.08);padding:14px 5%;',
    'transform:translateY(100%);transition:transform .5s cubic-bezier(0.16,1,0.3,1);}',
    '#cookie-banner.show{transform:translateY(0);}',
    '#cb-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}',
    '#cb-inner p{font-size:13px;color:rgba(255,255,255,.55);line-height:1.7;flex:1;min-width:200px;}',
    '#cb-btns{display:flex;gap:8px;flex-shrink:0;}',
    '#cb-accept{background:#2563EB;color:#fff;border:none;padding:9px 20px;border-radius:50px;',
    'font-family:"Manrope",sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:box-shadow .3s;}',
    '#cb-accept:hover{box-shadow:0 0 18px rgba(37,99,235,.55);}',
    '#cb-decline{background:rgba(255,255,255,.06);color:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.1);',
    'padding:9px 20px;border-radius:50px;font-size:13px;cursor:pointer;transition:all .25s;font-family:"Noto Sans",sans-serif;}',
    '#cb-decline:hover{color:#fff;}'
  ].join('');
  document.head.appendChild(cbStyle);

  setTimeout(function(){ cb.classList.add('show'); }, 1800);
}

window.acceptCookies = function(){
  localStorage.setItem('cookie_ok','1');
  var b=document.getElementById('cookie-banner');
  if(b){b.style.transform='translateY(100%)';setTimeout(function(){b.remove();},600);}
};
window.declineCookies = function(){
  localStorage.setItem('cookie_ok','declined');
  var b=document.getElementById('cookie-banner');
  if(b){b.style.transform='translateY(100%)';setTimeout(function(){b.remove();},600);}
};


/* ══════════════════════════════════════════════
   3. SOCIAL PROOF NOTIFICATIONS
══════════════════════════════════════════════ */
var proofs = [
  {name:'Cavid M.',city:'Bakı',action:'pulsuz sınağa başladı',min:2},
  {name:'Aytən H.',city:'Sumqayıt',action:'WhatsApp-a yazdı',min:5},
  {name:'Elçin B.',city:'Bakı',action:'ROAS hesablayıcını istifadə etdi',min:8},
  {name:'Lala Q.',city:'Gəncə',action:'qiymət siyahısına baxdı',min:12},
  {name:'Tural A.',city:'Bakı',action:'sorğu göndərdi',min:19},
  {name:'Günel R.',city:'Bakı',action:'Google Ads paketi seçdi',min:25},
  {name:'Murad S.',city:'Sumqayıt',action:'Meta Growth planını seçdi',min:33},
  {name:'Sevinc K.',city:'Bakı',action:'pulsuz konsultasiya aldı',min:41},
  {name:'Fərid N.',city:'Bakı',action:'TikTok kampaniyası başlatdı',min:48},
  {name:'Nigar M.',city:'Bakı',action:'2 həftəlik sınağa başladı',min:55},
  {name:'Rauf H.',city:'Bakı',action:'SMM paketi sifariş etdi',min:3},
  {name:'Lalə İ.',city:'Lənkəran',action:'WhatsApp-dan əlaqə saxladı',min:14}
];

var spStyle = document.createElement('style');
spStyle.textContent = [
  '#sp-toast{position:fixed;bottom:120px;left:20px;z-index:790;',
  'background:rgba(10,16,32,.96);border:1px solid rgba(255,255,255,.1);',
  'border-radius:14px;padding:13px 16px;max-width:270px;',
  'box-shadow:0 8px 32px rgba(0,0,0,.4);backdrop-filter:blur(16px);',
  'transform:translateX(-110%);transition:transform .5s cubic-bezier(0.16,1,0.3,1);',
  'display:flex;align-items:center;gap:11px;}',
  '#sp-toast.show{transform:translateX(0);}',
  '.sp-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#2563EB,#38BDF8);',
  'display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;',
  'color:#fff;font-family:"Manrope",sans-serif;flex-shrink:0;}',
  '.sp-txt{font-size:12px;line-height:1.5;}',
  '.sp-name{font-family:"Manrope",sans-serif;font-weight:700;color:#fff;font-size:13px;}',
  '.sp-detail{color:rgba(255,255,255,.5);font-size:12px;margin-top:1px;}',
  '.sp-time{color:rgba(255,255,255,.28);font-size:11px;margin-top:2px;}',
  '@media(max-width:600px){#sp-toast{bottom:90px;left:12px;max-width:240px;}}'
].join('');
document.head.appendChild(spStyle);

var toast = document.createElement('div');
toast.id = 'sp-toast';
document.body.appendChild(toast);

var spIdx = 0, spTimer;
function showProof(){
  var p = proofs[spIdx % proofs.length];
  spIdx++;
  toast.innerHTML = [
    '<div class="sp-av">'+p.name[0]+p.name.split(' ')[1][0]+'</div>',
    '<div class="sp-txt">',
    '<div class="sp-name">'+p.name+', '+p.city+'</div>',
    '<div class="sp-detail">'+p.action+'</div>',
    '<div class="sp-time">'+p.min+' dəq. əvvəl</div>',
    '</div>'
  ].join('');
  toast.classList.add('show');
  spTimer = setTimeout(function(){
    toast.classList.remove('show');
    setTimeout(function(){
      var gap = 18000 + Math.random()*14000; // 18–32s between toasts
      spTimer = setTimeout(showProof, gap);
    }, 700);
  }, 4500);
}
// First toast after 12 seconds
setTimeout(showProof, 12000);


/* ══════════════════════════════════════════════
   4. READING PROGRESS BAR (blog articles only)
══════════════════════════════════════════════ */
if(document.querySelector('.article-wrap')){
  var rp = document.createElement('div');
  rp.id = 'read-prog';
  rp.style.cssText = 'position:fixed;top:0;left:0;height:3px;z-index:601;width:0;'+
    'background:linear-gradient(90deg,#2563EB,#38BDF8);transition:width .1s linear;pointer-events:none;';
  document.body.appendChild(rp);

  window.addEventListener('scroll',function(){
    var art = document.querySelector('.article-body');
    if(!art) return;
    var r = art.getBoundingClientRect();
    var start = art.offsetTop;
    var end = start + art.offsetHeight - window.innerHeight;
    var pct = Math.min(Math.max((window.scrollY - start + window.innerHeight*.4) / (end - start + window.innerHeight*.4), 0), 1);
    rp.style.width = (pct*100).toFixed(1)+'%';
  },{passive:true});
}


/* ══════════════════════════════════════════════
   5. BACK TO TOP BUTTON
══════════════════════════════════════════════ */
var btt = document.createElement('button');
btt.id = 'back-top';
btt.setAttribute('aria-label','Yuxarı qayıt');
btt.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/></svg>';
btt.style.cssText = [
  'position:fixed;bottom:28px;left:28px;z-index:791;',
  'width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.12);',
  'background:rgba(10,16,32,.92);backdrop-filter:blur(12px);',
  'display:flex;align-items:center;justify-content:center;cursor:pointer;',
  'opacity:0;transform:translateY(12px);pointer-events:none;',
  'transition:opacity .35s,transform .35s cubic-bezier(0.16,1,0.3,1),background .25s;'
].join('');
document.body.appendChild(btt);

btt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
window.addEventListener('scroll',function(){
  var show = window.scrollY > 400;
  btt.style.opacity = show ? '1' : '0';
  btt.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
  btt.style.pointerEvents = show ? 'auto' : 'none';
},{passive:true});
btt.addEventListener('mouseenter',function(){btt.style.background='rgba(37,99,235,.8)';});
btt.addEventListener('mouseleave',function(){btt.style.background='rgba(10,16,32,.92)';});


/* ══════════════════════════════════════════════
   6. UPDATE WHATSAPP LINKS WITH PRE-FILLED MESSAGE
      (except nav-cta which will open the form)
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('a[href="https://wa.me/994773698929"]').forEach(function(a){
    // Don't update the nav-cta — it'll open the form
    if(a.classList.contains('nav-cta')) return;
    a.href = WA_BASE;
  });
});

})();
