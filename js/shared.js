/* AdsOnUs — shared.js */

/* NAV */
function toggleMenu(){
  var m=document.getElementById('mobMenu'),b=document.getElementById('burger-btn');
  m.classList.toggle('open');
  b.setAttribute('aria-expanded',m.classList.contains('open').toString());
}
function closeMenu(){
  document.getElementById('mobMenu').classList.remove('open');
  var b=document.getElementById('burger-btn');if(b)b.setAttribute('aria-expanded','false');
}
window.addEventListener('scroll',function(){
  var nav=document.getElementById('nav');if(!nav)return;
  nav.style.background=window.scrollY>50?'rgba(2,6,16,.97)':'rgba(5,13,31,.92)';
},{passive:true});

/* SCROLL REVEAL */
(function(){
  var obs=new IntersectionObserver(function(en){
    en.forEach(function(e){if(e.isIntersecting)e.target.classList.add('on');});
  },{threshold:.1,rootMargin:'0px 0px -28px 0px'});
  function init(){document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.stagger').forEach(function(el){obs.observe(el);});}
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();

/* FAQ */
function toggleFaq(el){
  var item=el.parentElement,open=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');});
  if(!open)item.classList.add('open');
}
document.addEventListener('keydown',function(e){
  if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('faq-q')){e.preventDefault();toggleFaq(e.target);}
});

/* COUNTER */
function animCnt(el){
  var t=parseInt(el.dataset.count),s=el.dataset.suf||'',n=0,dur=1500;
  var iv=setInterval(function(){n+=16;var p=Math.min(n/dur,1),ease=1-Math.pow(1-p,3);
    el.textContent=Math.round(t*ease)+s;if(p>=1){el.textContent=t+s;clearInterval(iv);}},16);
}
(function(){
  var co=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){animCnt(e.target);co.unobserve(e.target);}});},{threshold:.5});
  function init(){document.querySelectorAll('.num[data-count]').forEach(function(el){co.observe(el);});}
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();

/* ACTIVE NAV LINK */
(function(){
  var path=window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function(a){
    if(a.getAttribute('href')===path||a.getAttribute('href')===path.replace(/\/$/,''))a.classList.add('active');
  });
})();
