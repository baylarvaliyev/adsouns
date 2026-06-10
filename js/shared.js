/* shared.js v6 - AdsOnUs */

/* -- NAV SCROLL -- */
window.addEventListener('scroll', function(){
  var nav = document.getElementById('nav');
  if(nav) nav.classList.toggle('stuck', window.scrollY > 50);
}, { passive: true });

/* -- MOBILE MENU --
   iOS Safari fix: when body has overflow:hidden after scroll,
   the page shifts and fixed elements appear at wrong position.
   Solution: use position:fixed + negative top = scroll offset.
*/
var _menuScrollY = 0;

window.toggleMenu = function(){
  var m = document.getElementById('mobMenu');
  var b = document.getElementById('burger-btn');
  if(!m) return;
  var opening = !m.classList.contains('open');

  if(opening){
    /* Save scroll position BEFORE locking */
    _menuScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position   = 'fixed';
    document.body.style.top        = '-' + _menuScrollY + 'px';
    document.body.style.left       = '0';
    document.body.style.right      = '0';
    document.body.style.overflow   = 'hidden';
    document.body.style.width      = '100%';
  } else {
    /* Restore scroll position AFTER unlocking */
    document.body.style.position   = '';
    document.body.style.top        = '';
    document.body.style.left       = '';
    document.body.style.right      = '';
    document.body.style.overflow   = '';
    document.body.style.width      = '';
    window.scrollTo(0, _menuScrollY);
  }

  m.classList.toggle('open', opening);
  if(b) b.setAttribute('aria-expanded', String(opening));

  /* Hide/show floating elements */
  ['wa-float','back-top','sp-toast','cta-bar'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.style.opacity = opening ? '0' : '';
    el.style.pointerEvents = opening ? 'none' : '';
  });

  /* Burger X animation */
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

  /* Restore scroll */
  document.body.style.position   = '';
  document.body.style.top        = '';
  document.body.style.left       = '';
  document.body.style.right      = '';
  document.body.style.overflow   = '';
  document.body.style.width      = '';
  window.scrollTo(0, _menuScrollY);

  m.classList.remove('open');

  var b = document.getElementById('burger-btn');
  if(b){
    b.setAttribute('aria-expanded','false');
    var s = b.querySelectorAll('span');
    for(var i=0;i<s.length;i++) s[i].style.cssText = '';
  }
  ['wa-float','back-top','sp-toast','cta-bar'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.style.opacity = '';
    el.style.pointerEvents = '';
  });
};

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') window.closeMenu();
});

/* -- LANGUAGE SWITCHER -- */
window.switchLang = function(lang){
  localStorage.setItem('adsonus_lang', lang);
  var paths = { az:'/az/', en:'/', ru:'/ru/', tr:'/tr/' };
  window.location.href = paths[lang] || '/';
};

/* -- FAQ -- */
window.toggleFaq = window.toggleFaq || function(el){
  var item = el.parentElement;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i){ i.classList.remove('open'); });
  if(!isOpen) item.classList.add('open');
};

/* -- SCROLL REVEAL FALLBACK --
   Runs alongside GSAP. If GSAP ScrollTrigger doesn't fire
   (e.g. CDN slow, desktop rendering issue), IntersectionObserver
   still reveals .au/.at/.ar elements as they enter the viewport.
*/
(function(){
  if(!window.IntersectionObserver) return;
  var ro = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target;
      var st = getComputedStyle(el);
      /* Only intervene if GSAP hasn't already animated this element */
      if(parseFloat(st.opacity) < 0.5){
        el.style.transition = el.style.transition || 'opacity .7s ease, transform .7s ease, clip-path .7s ease';
        el.style.opacity    = '1';
        el.style.transform  = 'none';
        el.style.clipPath   = 'none';
      }
      ro.unobserve(el);
    });
  }, { threshold:0.08, rootMargin:'0px 0px -30px 0px' });

  function initReveal(){
    document.querySelectorAll('.au,.at,.ar,.title-anim,.rule-anim').forEach(function(el){
      ro.observe(el);
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
  /* Re-run after 1s to catch elements hidden after initial load */
  setTimeout(initReveal, 1200);
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
