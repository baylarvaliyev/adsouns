/* nav.js — inject nav & footer into every page */
(function(){
  var NAV=`
<nav id="nav">
  <div class="nav-inner">
    <a class="logo" href="/" aria-label="AdsOnUs Ana Səhifə">
      <div class="logo-box"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="white" stroke-width="1.5"/></svg></div>
      <span class="logo-name"><em>Ads</em>OnUs</span>
    </a>
    <div class="nav-links">
      <a href="/">Ana Səhifə</a>
      <a href="/pages/xidmetler.html">Xidmətlər</a>
      <a href="/pages/qiymetler.html">Qiymətlər</a>
      <a href="/blog/">Blog</a>
      <a href="/pages/haqqimizda.html">Haqqımızda</a>
      <a href="https://wa.me/994773698929" class="nav-cta" rel="noopener">Pulsuz Sınaq →</a>
    </div>
    <button class="burger" onclick="toggleMenu()" aria-label="Menyu" aria-expanded="false" id="burger-btn"><span></span><span></span><span></span></button>
  </div>
  <div class="mob-menu" id="mobMenu">
    <a href="/" onclick="closeMenu()">Ana Səhifə</a>
    <a href="/pages/xidmetler.html" onclick="closeMenu()">Xidmətlər</a>
    <a href="/pages/qiymetler.html" onclick="closeMenu()">Qiymətlər</a>
    <a href="/blog/" onclick="closeMenu()">Blog</a>
    <a href="/pages/haqqimizda.html" onclick="closeMenu()">Haqqımızda</a>
    <a href="https://wa.me/994773698929" onclick="closeMenu()" rel="noopener">Pulsuz Sınaq →</a>
  </div>
</nav>`;

  var FOOTER=`
<footer>
  <div class="ft-inner">
    <div class="ft-top">
      <div class="ft-brand">
        <a class="logo" href="/">
          <div class="logo-box" style="width:32px;height:32px;border-radius:8px;"><svg width="15" height="15" fill="white" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="white" stroke-width="1.5"/></svg></div>
          <span class="logo-name" style="font-size:16px;"><em>Ads</em>OnUs</span>
        </a>
        <p>Azərbaycanda Meta, Google, TikTok və LinkedIn reklamlarında nəticəyə yönümlü agentlik.</p>
      </div>
      <div class="ft-col">
        <h5>Xidmətlər</h5>
        <a href="/pages/xidmetler.html#meta">Meta Reklam</a>
        <a href="/pages/xidmetler.html#google">Google Ads</a>
        <a href="/pages/xidmetler.html#tiktok">TikTok Ads</a>
        <a href="/pages/xidmetler.html#smm">SMM</a>
      </div>
      <div class="ft-col">
        <h5>Şirkət</h5>
        <a href="/pages/haqqimizda.html">Haqqımızda</a>
        <a href="/blog/">Blog</a>
        <a href="/pages/qiymetler.html">Qiymətlər</a>
        <a href="/pages/elaqe.html">Əlaqə</a>
      </div>
      <div class="ft-col">
        <h5>Əlaqə</h5>
        <a href="https://wa.me/994773698929" rel="noopener">WhatsApp</a>
        <a href="tel:+994773698929">+994 77 369 89 29</a>
        <a href="#">Bakı, Azərbaycan</a>
        <a href="#">Instagram</a>
      </div>
    </div>
    <div class="ft-bottom">
      <p>© 2025 AdsOnUs. Bütün hüquqlar qorunur.</p>
      <span class="ft-contact">Meta Business Partner · <a href="/pages/mexfilik.html">Məxfilik Siyasəti</a></span>
    </div>
  </div>
</footer>`;

  document.addEventListener('DOMContentLoaded',function(){
    var navEl=document.getElementById('nav-placeholder');
    var ftEl=document.getElementById('footer-placeholder');
    if(navEl)navEl.outerHTML=NAV;
    if(ftEl)ftEl.outerHTML=FOOTER;
  });
})();
