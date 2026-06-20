/* cta.js — Floating "Free Trial" button + scroll CTA bar — multilingual
   WhatsApp removed entirely. All CTAs route to /get-started.html (lead form).
*/
(function(){

  /* Detect language */
  var lp = window.location.pathname.match(/^\/(en|ru|tr)\//);
  var hl = (document.documentElement.lang || '').slice(0,2).toLowerCase();
  var L  = lp ? lp[1] : (['en','ru','tr'].indexOf(hl) > -1 ? hl : 'az');

  var TX = {
    az:{ tip:'Pulsuz Sınaq üçün müraciət et', bar:'<strong>2 Həftəlik Pulsuz Sınaq</strong> — Kredit kartı tələb olunmur.', btn:'Pulsuz Başla →' },
    en:{ tip:'Request your free trial', bar:'<strong>2-Week Free Trial</strong> — No credit card required. Cancel anytime.', btn:'Start Free →' },
    ru:{ tip:'Подать заявку на бесплатный тест', bar:'<strong>2-недельный бесплатный тест</strong> — Карта не нужна. Отмена в любое время.', btn:'Начать бесплатно →' },
    tr:{ tip:'Ücretsiz deneme için başvurun', bar:'<strong>2 Haftalık Ücretsiz Deneme</strong> — Kart gerekmez. İstediğiniz zaman iptal edin.', btn:'Ücretsiz Başla →' }
  };
  var t = TX[L] || TX.az;

  /* Lead form URL per language - AZ/RU/TR pages still route to the EN form for now
     since it's the only one wired to Web3Forms; update if localized forms are built. */
  var LEAD_URL = '/get-started.html';

  /* ── Styles ── */
  var style = document.createElement('style');
  style.textContent = `
    #cta-float{position:fixed;bottom:28px;right:28px;z-index:800;display:flex;flex-direction:column;align-items:flex-end;gap:10px;}
    #cta-btn{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#2563EB,#38BDF8);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 24px rgba(37,99,235,.45),0 2px 8px rgba(0,0,0,.25);cursor:pointer;text-decoration:none;transition:transform .3s cubic-bezier(0.16,1,0.3,1),box-shadow .3s;animation:cta-pulse 2.5s ease-in-out infinite 3s;}
    #cta-btn:hover{transform:scale(1.12) translateY(-2px);box-shadow:0 12px 36px rgba(37,99,235,.6);animation:none;}
    #cta-btn svg{width:26px;height:26px;stroke:#fff;fill:none;}
    @keyframes cta-pulse{0%,100%{box-shadow:0 6px 24px rgba(37,99,235,.45),0 0 0 0 rgba(37,99,235,.5);}50%{box-shadow:0 6px 24px rgba(37,99,235,.45),0 0 0 10px rgba(37,99,235,0);}}
    #cta-tooltip{background:rgba(8,14,28,.95);border:1px solid rgba(255,255,255,.1);border-radius:50px;padding:9px 16px;font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;color:#fff;white-space:nowrap;backdrop-filter:blur(12px);box-shadow:0 8px 24px rgba(0,0,0,.3);opacity:0;transform:translateX(8px) scale(.95);transition:opacity .3s,transform .3s cubic-bezier(0.16,1,0.3,1);pointer-events:none;}
    #cta-float:hover #cta-tooltip{opacity:1;transform:translateX(0) scale(1);}
    #cta-tooltip::after{content:'';position:absolute;right:-6px;top:50%;transform:translateY(-50%);border:6px solid transparent;border-left-color:rgba(8,14,28,.95);border-right:none;}
    #cta-bar{position:fixed;bottom:0;left:0;right:0;z-index:700;background:linear-gradient(90deg,#1a1f35,#0e1628);border-top:1px solid rgba(255,255,255,.08);padding:14px 5%;display:flex;align-items:center;justify-content:space-between;gap:16px;transform:translateY(100%);transition:transform .5s cubic-bezier(0.16,1,0.3,1);backdrop-filter:blur(16px);}
    #cta-bar.visible{transform:translateY(0);}
    #cta-bar p{font-family:'Manrope',sans-serif;font-size:13.5px;font-weight:600;color:rgba(255,255,255,.7);margin:0;}
    #cta-bar p strong{color:#fff;}
    #cta-bar-actions{display:flex;align-items:center;gap:10px;flex-shrink:0;}
    #cta-bar a.cb-cta{background:#2563EB;color:#fff;padding:10px 22px;border-radius:50px;font-family:'Manrope',sans-serif;font-size:13px;font-weight:700;text-decoration:none;white-space:nowrap;transition:box-shadow .3s,transform .3s;display:inline-block;}
    #cta-bar a.cb-cta:hover{box-shadow:0 0 24px rgba(37,99,235,.55);transform:translateY(-1px);}
    #cta-bar-close{background:none;border:none;color:rgba(255,255,255,.3);font-size:18px;cursor:pointer;padding:4px;line-height:1;transition:color .2s;}
    #cta-bar-close:hover{color:rgba(255,255,255,.7);}
    #cta-float{bottom:90px;}
    body.bar-dismissed #cta-bar{display:none;}
    body.bar-dismissed #cta-float{bottom:28px;}
    @media(max-width:600px){#cta-bar{flex-wrap:wrap;gap:10px;padding:12px 5%;}#cta-bar p{font-size:12px;}#cta-float{bottom:86px;right:16px;}body.bar-dismissed #cta-float{bottom:20px;}#cta-btn{width:52px;height:52px;}}
  `;
  document.head.appendChild(style);

  /* ── Floating "Free Trial" button (replaces WhatsApp bubble) ── */
  var ctaFloat = document.createElement('div');
  ctaFloat.id = 'cta-float';
  ctaFloat.innerHTML = '<div id="cta-tooltip">' + t.tip + '</div>'
    + '<a id="cta-btn" href="' + LEAD_URL + '" aria-label="Free Trial">'
    + '<svg viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>'
    + '</a>';
  document.body.appendChild(ctaFloat);

  /* ── Bottom scroll CTA bar ── */
  var ctaBar = document.createElement('div');
  ctaBar.id = 'cta-bar';
  ctaBar.innerHTML = '<p>' + t.bar + '</p>'
    + '<div id="cta-bar-actions">'
    + '<a href="' + LEAD_URL + '" class="cb-cta">' + t.btn + '</a>'
    + '<button id="cta-bar-close" onclick="dismissBar()" aria-label="Close">✕</button>'
    + '</div>';
  document.body.appendChild(ctaBar);

  var barDismissed = sessionStorage.getItem('cta_bar_dismissed');
  if(barDismissed) document.body.classList.add('bar-dismissed');

  var barShown = false;
  window.addEventListener('scroll', function(){
    if(barDismissed) return;
    var pct = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
    if(!barShown && pct > 0.38){
      barShown = true;
      setTimeout(function(){ ctaBar.classList.add('visible'); }, 200);
    }
  }, { passive: true });

  window.dismissBar = function(){
    ctaBar.classList.remove('visible');
    document.body.classList.add('bar-dismissed');
    sessionStorage.setItem('cta_bar_dismissed', '1');
    barDismissed = true;
  };

})();
