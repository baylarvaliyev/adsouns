/* cta.js — Floating WhatsApp + scroll CTA bar — multilingual */
(function(){

  /* Detect language FIRST */
  var lp = window.location.pathname.match(/^\/(en|ru|tr)\//);
  var hl = (document.documentElement.lang || '').slice(0,2).toLowerCase();
  var L  = lp ? lp[1] : (['en','ru','tr'].indexOf(hl) > -1 ? hl : 'az');

  /* Language-matched WhatsApp pre-fill */
  var WA_TEXTS = {
    az: 'Salam! AdsOnUs saytından yazıram. Pulsuz sınaq barədə məlumat almaq istəyirdim.',
    en: 'Hi! I found AdsOnUs online and I\'m interested in a free trial. Can you tell me more?',
    ru: 'Здравствуйте! Нашёл AdsOnUs в интернете. Хотел бы узнать о бесплатном тесте.',
    tr: 'Merhaba! AdsOnUs\'u çevrimiçi buldum. Ücretsiz deneme hakkında bilgi almak istiyorum.'
  };
  var WA = 'https://wa.me/994773698929?text=' + encodeURIComponent(WA_TEXTS[L] || WA_TEXTS.az);

  var TX = {
    az:{ tip:'Pulsuz Sınaq üçün yazın', bar:'<strong>2 Həftəlik Pulsuz Sınaq</strong> — Kredit kartı tələb olunmur.', btn:'Pulsuz Başla →' },
    en:{ tip:'Start your free trial', bar:'<strong>2-Week Free Trial</strong> — No credit card required. Cancel anytime.', btn:'Start Free →' },
    ru:{ tip:'Начать бесплатный тест', bar:'<strong>2-недельный бесплатный тест</strong> — Карта не нужна. Отмена в любое время.', btn:'Начать бесплатно →' },
    tr:{ tip:'Ücretsiz deneme başlatın', bar:'<strong>2 Haftalık Ücretsiz Deneme</strong> — Kart gerekmez. İstediğiniz zaman iptal edin.', btn:'Ücretsiz Başla →' }
  };
  var t = TX[L] || TX.az;

  /* ── Styles ── */
  var style = document.createElement('style');
  style.textContent = `
    #wa-float{position:fixed;bottom:28px;right:28px;z-index:800;display:flex;flex-direction:column;align-items:flex-end;gap:10px;}
    #wa-btn{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#25D366,#128C7E);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 24px rgba(37,211,102,.45),0 2px 8px rgba(0,0,0,.25);cursor:pointer;text-decoration:none;transition:transform .3s cubic-bezier(0.16,1,0.3,1),box-shadow .3s;animation:wa-pulse 2.5s ease-in-out infinite 3s;}
    #wa-btn:hover{transform:scale(1.12) translateY(-2px);box-shadow:0 12px 36px rgba(37,211,102,.6);animation:none;}
    #wa-btn svg{width:28px;height:28px;fill:#fff;}
    @keyframes wa-pulse{0%,100%{box-shadow:0 6px 24px rgba(37,211,102,.45),0 0 0 0 rgba(37,211,102,.5);}50%{box-shadow:0 6px 24px rgba(37,211,102,.45),0 0 0 10px rgba(37,211,102,0);}}
    #wa-tooltip{background:rgba(8,14,28,.95);border:1px solid rgba(255,255,255,.1);border-radius:50px;padding:9px 16px;font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;color:#fff;white-space:nowrap;backdrop-filter:blur(12px);box-shadow:0 8px 24px rgba(0,0,0,.3);opacity:0;transform:translateX(8px) scale(.95);transition:opacity .3s,transform .3s cubic-bezier(0.16,1,0.3,1);pointer-events:none;}
    #wa-float:hover #wa-tooltip{opacity:1;transform:translateX(0) scale(1);}
    #wa-tooltip::after{content:'';position:absolute;right:-6px;top:50%;transform:translateY(-50%);border:6px solid transparent;border-left-color:rgba(8,14,28,.95);border-right:none;}
    #cta-bar{position:fixed;bottom:0;left:0;right:0;z-index:700;background:linear-gradient(90deg,#1a1f35,#0e1628);border-top:1px solid rgba(255,255,255,.08);padding:14px 5%;display:flex;align-items:center;justify-content:space-between;gap:16px;transform:translateY(100%);transition:transform .5s cubic-bezier(0.16,1,0.3,1);backdrop-filter:blur(16px);}
    #cta-bar.visible{transform:translateY(0);}
    #cta-bar p{font-family:'Manrope',sans-serif;font-size:13.5px;font-weight:600;color:rgba(255,255,255,.7);margin:0;}
    #cta-bar p strong{color:#fff;}
    #cta-bar-actions{display:flex;align-items:center;gap:10px;flex-shrink:0;}
    #cta-bar a.cb-cta{background:#2563EB;color:#fff;padding:10px 22px;border-radius:50px;font-family:'Manrope',sans-serif;font-size:13px;font-weight:700;text-decoration:none;white-space:nowrap;transition:box-shadow .3s,transform .3s;display:inline-block;}
    #cta-bar a.cb-cta:hover{box-shadow:0 0 24px rgba(37,99,235,.55);transform:translateY(-1px);}
    #cta-bar-close{background:none;border:none;color:rgba(255,255,255,.3);font-size:18px;cursor:pointer;padding:4px;line-height:1;transition:color .2s;}
    #cta-bar-close:hover{color:rgba(255,255,255,.7);}
    #wa-float{bottom:90px;}
    body.bar-dismissed #cta-bar{display:none;}
    body.bar-dismissed #wa-float{bottom:28px;}
    @media(max-width:600px){#cta-bar{flex-wrap:wrap;gap:10px;padding:12px 5%;}#cta-bar p{font-size:12px;}#wa-float{bottom:86px;right:16px;}body.bar-dismissed #wa-float{bottom:20px;}#wa-btn{width:52px;height:52px;}}
  `;
  document.head.appendChild(style);

  /* ── WhatsApp button ── */
  var waFloat = document.createElement('div');
  waFloat.id = 'wa-float';
  waFloat.innerHTML = '<div id="wa-tooltip">' + t.tip + '</div>'
    + '<a id="wa-btn" href="' + WA + '" target="_blank" rel="noopener" aria-label="WhatsApp">'
    + '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
    + '</a>';
  document.body.appendChild(waFloat);

  /* ── CTA bar ── */
  var ctaBar = document.createElement('div');
  ctaBar.id = 'cta-bar';
  ctaBar.innerHTML = '<p>' + t.bar + '</p>'
    + '<div id="cta-bar-actions">'
    + '<a href="' + WA + '" class="cb-cta" target="_blank" rel="noopener">' + t.btn + '</a>'
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
