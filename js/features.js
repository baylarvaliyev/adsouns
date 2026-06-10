/* features.js v6 - AdsOnUs */
(function(){

var WA_MSG = encodeURIComponent('Salam! AdsOnUs saytından yazıram. Pulsuz sınaq barədə məlumat almaq istəyirdim.');
var WA_BASE = 'https://wa.me/994773698929?text=' + WA_MSG;

/* Detect language */
var lp = window.location.pathname.match(/^\/(az|en|ru|tr)\//);
var hl = (document.documentElement.lang||'').slice(0,2).toLowerCase();
var L  = lp ? lp[1] : (['az','en','ru','tr'].indexOf(hl)>-1 ? hl : 'az');


/* ══════════════════════════════════════════
   2. BURGER BUTTON — explicit touch support
   iOS Safari belt-and-suspenders fix
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('burger-btn');
  if(!btn) return;

  /* 44×44 tap target via CSS — don't touch display via JS */

  /* touchend fires before click — handle it explicitly */
  btn.addEventListener('touchend', function(e){
    e.preventDefault();   /* stop ghost click */
    e.stopPropagation();
    if(typeof window.toggleMenu === 'function') window.toggleMenu();
  }, { passive: false });
});


/* ══════════════════════════════════════════
   3. COOKIE CONSENT BANNER
══════════════════════════════════════════ */
if(!localStorage.getItem('cookie_ok')){
  var cbStyle = document.createElement('style');
  cbStyle.textContent = [
    '#cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:810;',
    'background:rgba(8,12,24,.98);border-top:1px solid rgba(255,255,255,.08);',
    'padding:14px 5%;transform:translateY(100%);',
    'transition:transform .5s cubic-bezier(0.16,1,0.3,1);}',
    '#cookie-banner.show{transform:translateY(0);}',
    '#cb-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;',
    'justify-content:space-between;gap:16px;flex-wrap:wrap;}',
    '#cb-inner p{font-size:13px;color:rgba(255,255,255,.5);line-height:1.7;flex:1;min-width:200px;margin:0;}',
    '#cb-btns{display:flex;gap:8px;flex-shrink:0;}',
    '#cb-accept{background:#2563EB;color:#fff;border:none;padding:9px 20px;border-radius:50px;',
    'font-family:"Manrope",sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:box-shadow .3s;}',
    '#cb-accept:hover{box-shadow:0 0 18px rgba(37,99,235,.55);}',
    '#cb-decline{background:rgba(255,255,255,.06);color:rgba(255,255,255,.5);',
    'border:1px solid rgba(255,255,255,.1);padding:9px 20px;border-radius:50px;',
    'font-size:13px;cursor:pointer;font-family:"Noto Sans",sans-serif;}'
  ].join('');
  document.head.appendChild(cbStyle);
  var cb = document.createElement('div');
  cb.id = 'cookie-banner';
  cb.innerHTML = '<div id="cb-inner"><p>Bu sayt Meta Pixel, analitika və xidmət üçün cookie istifadə edir. <a href="/pages/mexfilik.html" style="color:#5B8EFF;text-decoration:none;">Ətraflı</a></p>'
    + '<div id="cb-btns"><button id="cb-accept" onclick="acceptCookies()">Qəbul Et</button>'
    + '<button id="cb-decline" onclick="declineCookies()">Rədd Et</button></div></div>';
  document.body.appendChild(cb);
  setTimeout(function(){ cb.classList.add('show'); }, 2200);
}
window.acceptCookies = function(){
  localStorage.setItem('cookie_ok','1');
  var b = document.getElementById('cookie-banner');
  if(b){ b.style.transform='translateY(100%)'; setTimeout(function(){b.remove();},600); }
};
window.declineCookies = function(){
  localStorage.setItem('cookie_ok','declined');
  var b = document.getElementById('cookie-banner');
  if(b){ b.style.transform='translateY(100%)'; setTimeout(function(){b.remove();},600); }
};


/* ══════════════════════════════════════════
   4. SOCIAL PROOF TOASTS — multilingual
══════════════════════════════════════════ */
var ALL_PROOFS = {
  az:[
    {name:'Cavid M.',city:'Bakı',action:'pulsuz sınağa başladı',min:2},
    {name:'Aytən H.',city:'Sumqayıt',action:'WhatsApp-a yazdı',min:5},
    {name:'Elçin B.',city:'Bakı',action:'ROAS kalkulyatorunu istifadə etdi',min:9},
    {name:'Lala Q.',city:'Gəncə',action:'qiymət siyahısına baxdı',min:14},
    {name:'Tural A.',city:'Bakı',action:'sorğu göndərdi',min:21},
    {name:'Günel R.',city:'Bakı',action:'Google Ads paketi seçdi',min:28},
    {name:'Murad S.',city:'Sumqayıt',action:'Meta Growth planını aldı',min:35},
    {name:'Nigar M.',city:'Bakı',action:'2 həftəlik sınağa başladı',min:16},
    {name:'Rauf H.',city:'Bakı',action:'SMM paketi sifariş etdi',min:31},
    {name:'Lalə İ.',city:'Lənkəran',action:'WhatsApp-dan əlaqə saxladı',min:47}
  ],
  en:[
    {name:'James R.',city:'London',action:'started free trial',min:3},
    {name:'Sarah K.',city:'Dubai',action:'sent a WhatsApp inquiry',min:7},
    {name:'Michael T.',city:'New York',action:'used the ROAS calculator',min:11},
    {name:'Emma W.',city:'Berlin',action:'viewed pricing plans',min:18},
    {name:'David L.',city:'Toronto',action:'submitted a request',min:25},
    {name:'Sophia M.',city:'Amsterdam',action:'selected Growth plan',min:33},
    {name:'Oliver B.',city:'Sydney',action:'started 2-week trial',min:40},
    {name:'Chloe P.',city:'Paris',action:'booked free consultation',min:14},
    {name:'Ryan S.',city:'Singapore',action:'started free trial',min:22},
    {name:'Anna F.',city:'Stockholm',action:'requested SMM package',min:37}
  ],
  ru:[
    {name:'Иван К.',city:'Москва',action:'начал бесплатный тест',min:4},
    {name:'Анна С.',city:'Алматы',action:'написал в WhatsApp',min:8},
    {name:'Михаил Д.',city:'Тбилиси',action:'использовал калькулятор ROAS',min:12},
    {name:'Елена В.',city:'Минск',action:'просмотрел тарифы',min:19},
    {name:'Сергей П.',city:'Баку',action:'отправил заявку',min:26},
    {name:'Наталья Р.',city:'Ташкент',action:'выбрал Growth план',min:34},
    {name:'Мария Ф.',city:'Ереван',action:'получил консультацию',min:15},
    {name:'Дмитрий Л.',city:'Баку',action:'начал 2-недельный тест',min:23},
    {name:'Ольга К.',city:'Тбилиси',action:'заказал SMM пакет',min:38}
  ],
  tr:[
    {name:'Ahmet Y.',city:'İstanbul',action:'ücretsiz deneme başlattı',min:3},
    {name:'Fatma K.',city:'Ankara',action:"WhatsApp'a yazdı",min:8},
    {name:'Mehmet D.',city:'İzmir',action:'ROAS hesaplayıcısını kullandı',min:13},
    {name:'Ayşe T.',city:'Bakü',action:'fiyat listesini inceledi',min:20},
    {name:'Mustafa S.',city:'Bursa',action:'talep gönderdi',min:27},
    {name:'Zeynep A.',city:'İstanbul',action:'Growth planı seçti',min:35},
    {name:'Elif B.',city:'Bakü',action:'ücretsiz danışmanlık aldı',min:16},
    {name:'Can O.',city:'İstanbul',action:'2 haftalık deneme başlattı',min:24}
  ]
};
var proofs = ALL_PROOFS[L] || ALL_PROOFS.az;

var spCSS = document.createElement('style');
spCSS.textContent = [
  '#sp-toast{position:fixed;bottom:130px;left:16px;z-index:795;',
  'background:rgba(10,16,32,.97);border:1px solid rgba(255,255,255,.09);',
  'border-radius:14px;padding:12px 15px;max-width:260px;',
  'box-shadow:0 8px 32px rgba(0,0,0,.45);',
  'transform:translateX(-110%);transition:transform .5s cubic-bezier(0.16,1,0.3,1);',
  'display:flex;align-items:center;gap:11px;pointer-events:none;}',
  '#sp-toast.show{transform:translateX(0);}',
  '.sp-av{width:34px;height:34px;border-radius:50%;',
  'background:linear-gradient(135deg,#2563EB,#38BDF8);',
  'display:flex;align-items:center;justify-content:center;',
  'font-size:12px;font-weight:800;color:#fff;font-family:"Manrope",sans-serif;flex-shrink:0;}',
  '.sp-name{font-family:"Manrope",sans-serif;font-weight:700;color:#fff;font-size:12.5px;display:block;}',
  '.sp-detail{color:rgba(255,255,255,.48);font-size:11.5px;display:block;margin-top:1px;}',
  '.sp-time{color:rgba(255,255,255,.26);font-size:10.5px;display:block;margin-top:1px;}',
  '@media(max-width:600px){#sp-toast{bottom:100px;left:10px;max-width:230px;}}'
].join('');
document.head.appendChild(spCSS);

var spToast = document.createElement('div');
spToast.id = 'sp-toast';
document.body.appendChild(spToast);

var spIdx = 0;
function showProof(){
  var menu = document.getElementById('mobMenu');
  if(menu && menu.classList.contains('open')){ setTimeout(showProof,5000); return; }
  var p = proofs[spIdx % proofs.length]; spIdx++;
  spToast.innerHTML = '<div class="sp-av">'+p.name[0]+(p.name.split(' ')[1]||'?')[0]+'</div>'
    + '<div><span class="sp-name">'+p.name+', '+p.city+'</span>'
    + '<span class="sp-detail">'+p.action+'</span>'
    + '<span class="sp-time">'+p.min+' min ago</span></div>';
  spToast.classList.add('show');
  setTimeout(function(){
    spToast.classList.remove('show');
    setTimeout(showProof, 20000 + Math.random()*12000);
  }, 4800);
}
setTimeout(showProof, 15000);


/* ══════════════════════════════════════════
   5. READING PROGRESS BAR
══════════════════════════════════════════ */
if(document.querySelector('.article-wrap')){
  var rp = document.createElement('div');
  rp.id = 'read-prog';
  rp.style.cssText = 'position:fixed;top:0;left:0;height:3px;z-index:601;width:0;'
    + 'background:linear-gradient(90deg,#2563EB,#38BDF8);pointer-events:none;';
  document.body.appendChild(rp);
  window.addEventListener('scroll', function(){
    var art = document.querySelector('.article-body');
    if(!art) return;
    var start = art.offsetTop;
    var end = start + art.offsetHeight - window.innerHeight;
    var pct = Math.max(0, Math.min((window.scrollY - start + window.innerHeight*.3) / Math.max(end - start + window.innerHeight*.3, 1), 1));
    rp.style.width = (pct * 100).toFixed(1) + '%';
  }, { passive: true });
}


/* ══════════════════════════════════════════
   6. BACK TO TOP
══════════════════════════════════════════ */
var bttCSS = document.createElement('style');
bttCSS.textContent = '#back-top{position:fixed;bottom:28px;left:24px;z-index:792;'
  + 'width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.11);'
  + 'background:rgba(10,16,32,.92);display:flex;align-items:center;justify-content:center;cursor:pointer;'
  + 'opacity:0;transform:translateY(10px);pointer-events:none;'
  + 'transition:opacity .35s,transform .35s cubic-bezier(0.16,1,0.3,1),background .25s;}'
  + '#back-top:hover{background:rgba(37,99,235,.8);}'
  + '@media(max-width:600px){#back-top{bottom:20px;left:14px;width:40px;height:40px;}}';
document.head.appendChild(bttCSS);
var btt = document.createElement('button');
btt.id = 'back-top';
btt.setAttribute('aria-label','Top');
btt.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/></svg>';
document.body.appendChild(btt);
btt.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
btt.addEventListener('touchend', function(e){ e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }, { passive: false });
window.addEventListener('scroll', function(){
  var show = window.scrollY > 450;
  btt.style.opacity = show ? '1' : '0';
  btt.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
  btt.style.pointerEvents = show ? 'auto' : 'none';
}, { passive: true });


/* ══════════════════════════════════════════
   7. WA LINK PRE-FILL
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('a[href="https://wa.me/994773698929"]').forEach(function(a){
    if(a.classList.contains('nav-cta')) return;
    a.href = WA_BASE;
  });
});

})();
