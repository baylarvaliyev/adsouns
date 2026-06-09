/* AdsOnUs — shared.js v4 */

/* ── NAV SCROLL ── */
window.addEventListener('scroll', function(){
  var nav = document.getElementById('nav');
  if(nav) nav.classList.toggle('stuck', window.scrollY > 50);
}, { passive: true });

/* ── MOBILE MENU — fixed version ── */
window.toggleMenu = function(){
  var m = document.getElementById('mobMenu');
  var b = document.getElementById('burger-btn');
  if(!m) return;
  var opening = !m.classList.contains('open');
  m.classList.toggle('open', opening);
  if(b) b.setAttribute('aria-expanded', opening.toString());

  // Lock/unlock body scroll
  document.body.style.overflow = opening ? 'hidden' : '';

  // Hide/show floating elements when menu opens
  var waFloat = document.getElementById('wa-float');
  var ctaBar  = document.getElementById('cta-bar');
  var backTop = document.getElementById('back-top');
  var spToast = document.getElementById('sp-toast');
  if(opening){
    if(waFloat) waFloat.style.display = 'none';
    if(ctaBar)  ctaBar.classList.remove('visible');
    if(backTop) backTop.style.opacity = '0';
    if(spToast) spToast.classList.remove('show');
  } else {
    if(waFloat) waFloat.style.display = '';
    if(backTop) backTop.style.opacity = '';
  }

  // Animate burger bars
  if(b){
    var spans = b.querySelectorAll('span');
    if(opening){
      if(spans[0]) spans[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
      if(spans[1]) spans[1].style.cssText = 'opacity:0;transform:scaleX(0)';
      if(spans[2]) spans[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
    } else {
      if(spans[0]) spans[0].style.cssText = '';
      if(spans[1]) spans[1].style.cssText = '';
      if(spans[2]) spans[2].style.cssText = '';
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
  var waFloat = document.getElementById('wa-float');
  if(waFloat) waFloat.style.display = '';
  var backTop = document.getElementById('back-top');
  if(backTop) backTop.style.opacity = '';
};

/* Close menu on Escape key */
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') window.closeMenu();
});

/* ── SCROLL REVEAL ── */
(function(){
  var obs = new IntersectionObserver(function(en){
    en.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });
  function init(){
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.stagger').forEach(function(el){ obs.observe(el); });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ── FAQ ── */
window.toggleFaq = window.toggleFaq || function(el){
  var item = el.parentElement;
  var open = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i){ i.classList.remove('open'); });
  if(!open) item.classList.add('open');
};

/* ── COUNTER ── */
(function(){
  var co = new IntersectionObserver(function(en){
    en.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target;
      var t = parseInt(el.dataset.count), s = el.dataset.suf || '';
      var start = performance.now(), dur = 1500;
      function tick(n){
        var p = Math.min((n - start) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(t * ease) + s;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      co.unobserve(el);
    });
  }, { threshold: 0.5 });
  function init(){
    document.querySelectorAll('[data-count]').forEach(function(el){ co.observe(el); });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ── LANGUAGE SWITCHER (available on every page) ── */
window.switchLang = function(lang){
  localStorage.setItem('adsonus_lang', lang);
  var paths = { az:'/', en:'/en/', ru:'/ru/', tr:'/tr/' };
  window.location.href = paths[lang] || '/';
};
