/* shared.js v8 - AdsOnUs */

/* -- NAV SCROLL -- */
window.addEventListener('scroll', function(){
  var nav = document.getElementById('nav');
  if(nav) nav.classList.toggle('stuck', window.scrollY > 50);
}, { passive: true });

/* -- MOBILE MENU --
   Bug fixes:
   1. Height set to window.innerHeight px on open — bypasses 100dvh iOS unreliability
   2. Uses html.nav-open overflow:hidden — no body position:fixed scroll jump
*/
window.toggleMenu = function(){
  var m = document.getElementById('mobMenu');
  var b = document.getElementById('burger-btn');
  if(!m) return;
  var opening = !m.classList.contains('open');

  if(opening){
    /* FIX: Set exact pixel height at the moment of opening.
       window.innerHeight always returns the true visible viewport height
       regardless of iOS address bar state, scroll position, or OS version. */
    m.style.height = window.innerHeight + 'px';
    document.documentElement.classList.add('nav-open');
    m.classList.add('open');
  } else {
    document.documentElement.classList.remove('nav-open');
    m.classList.remove('open');
    m.style.height = '';
  }

  if(b) b.setAttribute('aria-expanded', String(opening));

  /* Hide floating elements while menu is open */
  ['wa-float','back-top','sp-toast','cta-bar'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.style.display = opening ? 'none' : '';
  });

  /* Burger → X animation */
  if(b){
    var s = b.querySelectorAll('span');
    if(opening){
      if(s[0]) s[0].style.cssText = 'transform:translateY(6.5px) rotate(45deg)';
      if(s[1]) s[1].style.cssText = 'opacity:0;transform:scaleX(0)';
      if(s[2]) s[2].style.cssText = 'transform:translateY(-6.5px) rotate(-45deg)';
    } else {
      for(var i=0;i<s.length;i++) s[i].style.cssText = '';
    }
  }
};

window.closeMenu = function(){
  var m = document.getElementById('mobMenu');
  if(!m || !m.classList.contains('open')) return;
  document.documentElement.classList.remove('nav-open');
  m.classList.remove('open');
  m.style.height = '';
  var b = document.getElementById('burger-btn');
  if(b){
    b.setAttribute('aria-expanded','false');
    var s = b.querySelectorAll('span');
    for(var i=0;i<s.length;i++) s[i].style.cssText = '';
  }
  ['wa-float','back-top','sp-toast','cta-bar'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.style.display = '';
  });
};

/* Close on Escape key */
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') window.closeMenu();
});

/* -- LANGUAGE SWITCHER --
   BUG FIX: Previously always redirected to the homepage of the target language.
   Now maps the current page to its equivalent in the target language.
   e.g. /pricing.html → /ru/pricing.html  (not just /ru/)
        /pages/qiymetler.html → /pricing.html  (not just /)
*/
window.switchLang = function(lang){
  localStorage.setItem('adsonus_lang', lang);

  var p = window.location.pathname;

  /* Page type detection */
  var isServices   = /service|xidmet/i.test(p);
  var isPricing    = /pricing|qiymet/i.test(p);
  var isCalculator = /calculator|hesablayici/i.test(p);
  var isAbout      = /about|haqqimizda/i.test(p);
  var isBlog       = /\/blog\//i.test(p);
  var isContact    = /elaqe|contact/i.test(p);
  var isPrivacy    = /mexfilik|privacy/i.test(p);

  /* Target URLs per language */
  var MAP = {
    az: {
      home:       '/az/',
      services:   '/pages/xidmetler.html',
      pricing:    '/pages/qiymetler.html',
      calculator: '/pages/hesablayici.html',
      about:      '/pages/haqqimizda.html',
      blog:       '/az/',
      contact:    '/pages/elaqe.html',
      privacy:    '/pages/mexfilik.html'
    },
    en: {
      home:       '/',
      services:   '/services.html',
      pricing:    '/pricing.html',
      calculator: '/calculator.html',
      about:      '/about.html',
      blog:       '/blog/',
      contact:    '/',
      privacy:    '/pages/mexfilik.html'
    },
    ru: {
      home:       '/ru/',
      services:   '/ru/services.html',
      pricing:    '/ru/pricing.html',
      calculator: '/ru/calculator.html',
      about:      '/ru/about.html',
      blog:       '/blog/',
      contact:    '/ru/',
      privacy:    '/pages/mexfilik.html'
    },
    tr: {
      home:       '/tr/',
      services:   '/tr/services.html',
      pricing:    '/tr/pricing.html',
      calculator: '/tr/calculator.html',
      about:      '/tr/about.html',
      blog:       '/blog/',
      contact:    '/tr/',
      privacy:    '/pages/mexfilik.html'
    }
  };

  var m = MAP[lang];
  if(!m){ window.location.href = '/'; return; }

  var dest = m.home;
  if(isServices)   dest = m.services;
  else if(isPricing)    dest = m.pricing;
  else if(isCalculator) dest = m.calculator;
  else if(isAbout)      dest = m.about;
  else if(isBlog)       dest = m.blog;
  else if(isContact)    dest = m.contact;
  else if(isPrivacy)    dest = m.privacy;

  window.location.href = dest;
};

/* -- FAQ -- */
window.toggleFaq = window.toggleFaq || function(el){
  var item = el.parentElement;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i){ i.classList.remove('open'); });
  if(!isOpen) item.classList.add('open');
};

/* -- SCROLL REVEAL FALLBACK (IntersectionObserver alongside GSAP) -- */
(function(){
  if(!window.IntersectionObserver) return;
  var ro = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target;
      el.classList.add('on');
      if(parseFloat(getComputedStyle(el).opacity) < 0.5){
        el.style.transition = 'opacity .7s ease, transform .7s ease, clip-path .7s ease';
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.clipPath = 'none';
      }
      ro.unobserve(el);
    });
  }, { threshold:0.05, rootMargin:'0px 0px -20px 0px' });

  function initReveal(){
    var main = document.getElementById('main');
    if(main && main.style.visibility === 'hidden'){
      main.style.opacity = '1';
      main.style.visibility = 'visible';
    }
    document.querySelectorAll('.au,.at,.ar,.title-anim,.rule-anim,.reveal,.reveal-l,.reveal-r').forEach(function(el){
      ro.observe(el);
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
  setTimeout(initReveal, 1500);
  setTimeout(function(){
    var main = document.getElementById('main');
    if(main){ main.style.opacity='1'; main.style.visibility='visible'; }
    document.querySelectorAll('.au,.at,.ar,.title-anim,.h1-inner').forEach(function(el){
      el.style.opacity='1'; el.style.transform='none'; el.style.clipPath='none';
    });
  }, 5000);
})();

/* -- COUNTER -- */
(function(){
  if(!window.IntersectionObserver) return;
  var co = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target;
      var t = parseInt(el.dataset.count), s = el.dataset.suf || '';
      if(isNaN(t)) return;
      var start = performance.now(), dur = 1500;
      function tick(n){
        var p = Math.min((n-start)/dur,1), ease = 1-Math.pow(1-p,3);
        el.textContent = Math.round(t*ease)+s;
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      co.unobserve(el);
    });
  }, { threshold:0.4 });
  function init(){
    document.querySelectorAll('[data-count]').forEach(function(el){ co.observe(el); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
