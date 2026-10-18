/* adsonus — homepage scroll story (GSAP + ScrollTrigger).
   Markup and CSS already describe the finished state; every tween here starts FROM
   an offset and settles there. Without GSAP, or with reduced motion, nothing runs. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Statement: wrap each word so it can brighten on its own (text stays selectable).
  var words = $('#words');
  if (words) {
    $$('#words').forEach(function (p) {
      var out = [];
      p.childNodes.forEach(function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(function (t) {
            out.push(/^\s+$/.test(t) || !t ? document.createTextNode(t) : Object.assign(document.createElement('span'), { className: 'w', textContent: t }));
          });
        } else { n.classList.add('w'); out.push(n); }
      });
      p.textContent = '';
      out.forEach(function (n) { p.appendChild(n); });
    });
  }

  var mm = gsap.matchMedia();

  mm.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 981px)' }, function (ctx) {
    if (!ctx.conditions.motion) return;
    var wide = ctx.conditions.wide;
    var ease = 'power3.out';

    // 1. Hero: lines rise from behind their baseline, then the copy, then the stage.
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.x-line > span', { yPercent: 115, duration: 1.1, stagger: 0.12 })
      .from('.x-hero [data-up]', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: ease }, '-=0.6')
      .from('.x-stage-mark', { scale: 0.6, rotate: -14, autoAlpha: 0, duration: 1.4, ease: 'expo.out' }, '-=0.9');

    // The report is tilted back and settles flat as you scroll, like a product shot.
    gsap.fromTo('#report',
      { rotateX: 32, scale: 0.84, y: 60 },
      { rotateX: 0, scale: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: '#stage', start: 'top 95%', end: 'top 25%', scrub: 0.8 } });
    gsap.to('.x-stage-mark', { rotate: 10, scale: 1.08, yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '#stage', start: 'top 80%', end: 'bottom top', scrub: 1 } });
    gsap.to('.x-glow', { yPercent: 30, ease: 'none',
      scrollTrigger: { trigger: '.x-hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Numbers count up and bars grow when the report arrives.
    ScrollTrigger.create({
      trigger: '#report', start: 'top 55%', once: true,
      onEnter: function () {
        $$('#report [data-count]').forEach(function (el) {
          var to = +el.dataset.count, pre = el.dataset.prefix || '', o = { v: 0 };
          gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out',
            onUpdate: function () { el.textContent = pre + Math.round(o.v).toLocaleString('en-US'); } });
        });
        gsap.from('.xr-bars span', { scaleY: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out' });
        gsap.from('.xr-right tbody tr', { x: 24, autoAlpha: 0, duration: 0.7, stagger: 0.12, ease: ease, delay: 0.3 });
      }
    });

    // 2. Statement: pinned while every word brightens in turn.
    if (words) {
      gsap.fromTo('#words .w', { opacity: 0.12 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: wide
          ? { trigger: '#statement', start: 'top top', end: '+=140%', pin: true, scrub: 0.6 }
          : { trigger: '#words', start: 'top 80%', end: 'bottom 40%', scrub: 0.6 }
      });
      gsap.from('.x-inline-mark', { rotate: -90, scale: 0.3, ease: 'none',
        scrollTrigger: { trigger: '#words', start: 'top 85%', end: 'top 30%', scrub: 1 } });
    }

    // 3. Bento tiles rise in, slightly scaled, one after another.
    ScrollTrigger.batch('[data-tile]', {
      start: 'top 88%', once: true,
      onEnter: function (els) { gsap.from(els, { y: 90, scale: 0.94, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out' }); }
    });

    // 4. Trial: the counter follows the step in view; the bar fills across all four.
    var dayK = $('#day-k'), dayV = $('#day-v');
    $$('[data-step]').forEach(function (li) {
      gsap.from(li, { y: 80, autoAlpha: 0, scale: 0.96, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: li, start: 'top 90%', once: true } });
      ScrollTrigger.create({
        trigger: li, start: 'top 60%', end: 'bottom 40%',
        onToggle: function (self) {
          li.classList.toggle('on', self.isActive);
          if (self.isActive && dayV) {
            dayK.textContent = li.dataset.k;
            gsap.fromTo(dayV, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: ease });
            dayV.textContent = li.dataset.v;
          }
        }
      });
    });
    gsap.fromTo('#trial-bar', { scaleX: 0 }, { scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.x-steps', start: 'top 60%', end: 'bottom 60%', scrub: true } });

    // 5. Rules: each card is pushed back and dimmed as the next one slides over it.
    var cards = $$('.x-card');
    cards.forEach(function (card, i) {
      var next = cards[i + 1];
      if (!next) return;
      var st = { trigger: next, start: 'top bottom', end: 'top 120px', scrub: true };
      gsap.to(card, { scale: 0.92, backgroundColor: '#111B33', ease: 'none', scrollTrigger: st });
      gsap.to(card.children, { opacity: 0.15, ease: 'none', scrollTrigger: { trigger: next, start: 'top 60%', end: 'top 140px', scrub: true } });
    });
    gsap.from('.x-mail', { y: 60, rotate: -3, autoAlpha: 0, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: '.x-mail', start: 'top 85%', once: true } });

    // 6. Founder: the portrait opens out of the shape; the photo drifts inside it.
    gsap.from('#portrait', { scale: 0.75, rotate: -6, ease: 'none',
      scrollTrigger: { trigger: '#portrait', start: 'top bottom', end: 'center center', scrub: 1 } });
    gsap.to('#portrait img', { yPercent: -12, ease: 'none',
      scrollTrigger: { trigger: '#portrait', start: 'top bottom', end: 'bottom top', scrub: true } });

    // Generic entrances outside the hero.
    $$('.v4 [data-up]').forEach(function (el) {
      if (el.closest('.x-hero')) return;
      gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    $$('.x-trial-sticky > *, .x-rules-sticky > .x-h2, .x-rules-sticky > .x-sub, .x-faq-side > *').forEach(function (el) {
      gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    // 8. Close: the word slides up into the band as it arrives.
    gsap.from('.cta-word', { yPercent: 55, ease: 'none',
      scrollTrigger: { trigger: '.cta-band', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
    gsap.from('.f-mark', { y: 80, autoAlpha: 0, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: '.site-footer', start: 'top 85%', once: true } });
  });

  // FAQ: open and close with a measured height animation (works with reduced motion too, instantly).
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('.x-acc details').forEach(function (d) {
    var s = d.querySelector('summary'), a = d.querySelector('.x-ans');
    s.addEventListener('click', function (e) {
      if (reduce) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(a, { height: 0, duration: 0.45, ease: 'power3.inOut', onComplete: function () { d.open = false; a.style.height = ''; } });
      } else {
        d.open = true;
        gsap.fromTo(a, { height: 0 }, { height: a.scrollHeight, duration: 0.55, ease: 'power3.out', onComplete: function () { a.style.height = ''; } });
      }
    });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
