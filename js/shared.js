/* shared.js v5 — AdsOnUs */

/* ── NAV SCROLL ── */
window.addEventListener('scroll', function(){
  var nav = document.getElementById('nav');
  if(nav) nav.classList.toggle('stuck', window.scrollY > 50);
}, { passive: true });

/* ── MOBILE MENU ── */
window.toggleMenu = function(){
  var m = document.getElementById('mobMenu');
  var b = document.getElementById('burger-btn');
  if(!m) return;
  var opening = !m.classList.contains('open');
  m.classList.toggle('open', opening);
  if(b) b.setAttribute('aria-expanded', String(opening));
  document.body.style.overflow = opening ? 'hidden' : '';
  /* Hide floating elements when menu opens */
  ['wa-float','back-top','sp-toast'].forEach(function(id){
    var el = document.getElementById(id);
    if(el){
      el.style.display   = opening ? 'none' : '';
      el.style.opacity   = opening ? '0'    : '';
    }
  });
  var ctaBar = document.getElementById('cta-bar');
  if(ctaBar) ctaBar.classList.toggle('visible', !opening && ctaBar.classList.contains('visible'));
  /* Burger animation */
  if(b){
    var s = b.querySelectorAll('span');
    if(opening){
      s[0] && (s[0].style.cssText = 'transform:translateY(7px) rotate(45deg)');
      s[1] && (s[1].style.cssText = 'opacity:0;transform:scaleX(0)');
      s[2] && (s[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)');
    } else {
      s[0] && (s[0].style.cssText = '');
      s[1] && (s[1].style.cssText = '');
      s[2] && (s[2].style.cssText = '');
    }
  }
};

window.closeMenu = function(){
  var m = document.getElementById('mobMenu');
  if(!m || !m.classList.contains('open')) return;
  m.classList.remove('open');
  document.body.style.overflow = '';
  var b = document.getElementById('burger-btn');
  if(b){
    b.setAttribute('aria-expanded','false');
    b.querySelectorAll('span').forEach(function(s){ s.style.cssText = ''; });
  }
  ['wa-float','back-top','sp-toast'].forEach(function(id){
    var el = document.getElementById(id);
    if(el){ el.style.display = ''; el.style.opacity = ''; }
  });
};

/* Close on Escape */
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') window.closeMenu();
});

/* ── LANGUAGE SWITCHER (all pages) ── */
window.switchLang = function(lang){
  localStorage.setItem('adsonus_lang', lang);
  var paths = { az:'/', en:'/en/', ru:'/ru/', tr:'/tr/' };
  window.location.href = paths[lang] || '/';
};

/* ── FAQ ── */
window.toggleFaq = window.toggleFaq || function(el){
  var item = el.parentElement;
  var open = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i){ i.classList.remove('open'); });
  if(!open) item.classList.add('open');
};

/* ── COUNTER ── */
(function(){
  if(!window.IntersectionObserver) return;
  var co = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target;
      var t = parseInt(el.dataset.count), s = el.dataset.suf || '';
      var start = performance.now(), dur = 1500;
      function tick(n){
        var p = Math.min((n-start)/dur,1), ease = 1-Math.pow(1-p,3);
        el.textContent = Math.round(t*ease)+s;
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      co.unobserve(el);
    });
  }, { threshold:0.5 });
  function init(){ document.querySelectorAll('[data-count]').forEach(function(el){ co.observe(el); }); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
