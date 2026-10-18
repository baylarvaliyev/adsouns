/* adsonus — site v3 motion and the Baku / New York clock.
   Every effect is an enhancement: without this file the page is complete and visible. */
(function () {
  window.__motion = true;
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero: masked headline, then the copy, the shape and the report.
  var hero = document.getElementById('hero');
  // rAF is paused in background tabs, so a timer backs it up.
  var go = function () { if (hero) hero.classList.add('go'); };
  if (hero) { requestAnimationFrame(function () { requestAnimationFrame(go); }); setTimeout(go, 120); }

  // Section entrances, once each.
  var targets = document.querySelectorAll('[data-r], [data-dots]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  // Header pill tightens once the page scrolls.
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // The time in Baku and New York right now, and the visitor's own if different.
  var clock = document.querySelector('[data-clock]');
  if (clock && window.Intl) {
    var fmt = function (tz) {
      try { return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(new Date()); }
      catch (e) { return null; }
    };
    var here = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var tick = function () {
      var baku = fmt('Asia/Baku'), ny = fmt('America/New_York');
      if (!baku || !ny) return;
      var s = 'Right now it is <b>' + baku + '</b> in Baku and <b>' + ny + '</b> in New York';
      if (here && here !== 'Asia/Baku' && here !== 'America/New_York') {
        var mine = fmt(here);
        if (mine && mine !== ny) s += ', <b>' + mine + '</b> where you are';
      }
      clock.innerHTML = s + '.';
    };
    tick();
    setInterval(tick, 30000);
  }
})();
