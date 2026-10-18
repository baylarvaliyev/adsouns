/* adsonus — homepage scroll story (GSAP + ScrollTrigger).
   Markup and CSS already describe the finished state; every tween here starts FROM
   an offset and settles there. Without GSAP, or with reduced motion, nothing runs. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Cash flow: each lane draws hop by hop, a glowing head rides the tip of the line,
  // and each card lights up as the head reaches it. Returns a timeline for scrubbing.
  function flowTimeline(svg) {
    var tl = gsap.timeline({ paused: true });
    var origin = function (g) { var b = g.getBBox(); return (b.x + b.width / 2) + ' ' + (b.y + b.height / 2); };
    var node = function (id) { return svg.querySelector('[data-node="' + id + '"]'); };
    $$('[data-node]', svg).forEach(function (g) { gsap.set(g, { svgOrigin: origin(g), opacity: 0.22, scale: 0.9 }); });
    gsap.set(node('hub'), { scale: 0.7, opacity: 0.3 });

    ['in', 'out'].forEach(function (lane, li) {
      var edges = $$('.edge-' + lane, svg), head = svg.querySelector('.head-' + lane);
      var at = li * 0.9;                       // the out lane starts a little later
      var first = lane === 'in' ? 'ads' : 'bill';
      tl.to(node(first), { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, at);
      tl.to(head, { opacity: 1, duration: 0.2 }, at + 0.3);
      at += 0.4;
      edges.forEach(function (edge) {
        var len = edge.getTotalLength(), p = { v: 0 };
        gsap.set(edge, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(edge, { strokeDashoffset: 0, duration: 1, ease: 'none' }, at);
        tl.to(p, { v: 1, duration: 1, ease: 'none', onUpdate: function () {
          var pt = edge.getPointAtLength(len * p.v); head.setAttribute('cx', pt.x); head.setAttribute('cy', pt.y);
        } }, at);
        at += 1;
        var to = edge.dataset.to;
        if (to === 'hub') {
          tl.to(node('hub'), { opacity: 1, scale: 1.12, duration: 0.25, ease: 'power2.out' }, at - 0.05)
            .to(node('hub'), { scale: 1, duration: 0.35, ease: 'power2.inOut' }, at + 0.2);
        } else {
          tl.to(node(to), { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, at - 0.1);
        }
      });
      tl.to(head, { opacity: 0, duration: 0.3 }, at);
    });

    // Once fully drawn, small dots keep flowing along both lanes.
    var started = false;
    tl.eventCallback('onUpdate', function () {
      // dots only while the diagram is fully drawn; hidden again when scrolling back up
      svg.classList.toggle('live', tl.progress() >= 0.999);
      if (started || tl.progress() < 0.999) return;
      started = true;
      $$('animateMotion', svg).forEach(function (m) {
        var dur = parseFloat(m.getAttribute('dur')), k = +(m.dataset.delay || 0);
        setTimeout(function () { try { m.beginElement(); } catch (e) {} }, k * dur * 1000 / 3);
      });
    });
    return tl;
  }

  var mm = gsap.matchMedia();

  mm.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 981px)', phone: '(max-width: 620px)' }, function (ctx) {
    if (!ctx.conditions.motion) return;
    var wide = ctx.conditions.wide;
    var ease = 'power3.out';

    // 1. Hero: lines rise from behind their baseline, then the copy, then the stage.
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.x-line > span', { yPercent: 115, duration: 1.1, stagger: 0.12 })
      .from('.x-hero [data-up]', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: ease }, '-=0.6')
      .from('.x-stage-bg', { autoAlpha: 0, y: 60, duration: 1.2, ease: 'expo.out' }, '-=0.8');

    // The report is tilted back and settles flat as you scroll, like a product shot.
    gsap.fromTo('#report',
      { rotateX: 32, scale: 0.84, y: 60 },
      { rotateX: 0, scale: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: '#stage', start: 'top 95%', end: 'top 25%', scrub: 0.8 } });
    // The blue stage opens out a little as the report lands; it stays inside the hero.
    gsap.fromTo('.x-stage-bg', { scaleX: 0.9, borderRadius: 64 }, { scaleX: 1, borderRadius: 40, ease: 'none',
      scrollTrigger: { trigger: '#stage', start: 'top 95%', end: 'top 25%', scrub: 0.8 } });
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

    // 2. Cash flow: pinned on wide screens while the diagram draws; scrubbed in place on smaller ones.
    var flowSvg = $(ctx.conditions.phone ? '.flow-v' : '.flow-h');
    if (flowSvg) {
      var ftl = flowTimeline(flowSvg);
      gsap.from('.x-flow-head > *', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: '#flow', start: 'top 75%', once: true } });
      ScrollTrigger.create({
        trigger: wide ? '#flow' : '.x-flow-stage',
        start: wide ? 'top top' : 'top 80%',
        end: wide ? '+=160%' : 'bottom 45%',
        pin: wide, scrub: 0.8, animation: ftl
      });
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
