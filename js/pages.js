/* adsonus — inner page motion (GSAP + ScrollTrigger), the homepage's vocabulary on every page.
   Everything starts FROM an offset and settles on the CSS state; without GSAP or with reduced
   motion nothing runs and the page is complete as written. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    var ease = 'expo.out';

    // Hero: the headline rises from behind its edge, then the sentence and crumbs.
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.p-title .x-line > span', { yPercent: 110, duration: 1.1 })
      .from('.p-lead, .p-crumbs', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, '-=0.6')
      .from('.p-stage-bg', { y: 60, autoAlpha: 0, duration: 1.2, ease: ease }, '-=0.7');
    gsap.to('.p-glow', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.p-hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Product card: tilted back, settles flat as you scroll; its parts arrive in turn.
    if (document.querySelector('.p-card')) {
      gsap.fromTo('.p-card', { rotateX: 28, scale: 0.88, y: 50 }, { rotateX: 0, scale: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: '.p-stage', start: 'top 98%', end: 'top 30%', scrub: 0.8 } });
      gsap.fromTo('.p-stage-bg', { scaleX: 0.9 }, { scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.p-stage', start: 'top 98%', end: 'top 30%', scrub: 0.8 } });
      ScrollTrigger.create({ trigger: '.p-card', start: 'top 70%', once: true, onEnter: function () {
        $$('.p-card [data-count]').forEach(function (el) {
          var to = +el.dataset.count, pre = el.dataset.prefix || '', o = { v: 0 };
          gsap.to(o, { v: to, duration: 1.5, ease: 'power2.out', onUpdate: function () { el.textContent = pre + Math.round(o.v).toLocaleString('en-US'); } });
        });
        gsap.from('.pc-bars span', { scaleY: 0, duration: 1, stagger: 0.08, ease: ease });
        gsap.from('.p-card tbody tr, .pc-mail dl, .pc-mail .msg, .pc-acts, .pc-total', { x: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
      } });
    }

    // Headings and prose blocks rise in.
    $$('.v4p .section h2, .v4p .section-head .lead, .v4p .prose > p, .v4p .prose > .lead, .v4p .prose > ul:not(.checks), .v4p .founder-copy > *').forEach(function (el) {
      gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, ease: ease, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    // Lists, tiles, steps and rule cards arrive one after another.
    ['.v4p .checks > li', '.v4p .cards > .card', '.v4p .how-steps > li', '.v4p .rules > li', '.v4p .table tbody tr'].forEach(function (sel) {
      ScrollTrigger.batch(sel, { start: 'top 90%', once: true,
        onEnter: function (els) { gsap.from(els, { y: 60, scale: 0.96, autoAlpha: 0, duration: 1, stagger: 0.09, ease: ease }); } });
    });
    $$('.v4p .side-box, .v4p .table-wrap, .v4p #quote-form, .v4p .anchor-nav').forEach(function (el) {
      gsap.from(el, { y: 70, autoAlpha: 0, duration: 1.2, ease: ease, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });

    // About: the drawing sketches itself in from the top.
    var photo = document.querySelector('.v4p .founder .photo img');
    if (photo) {
      gsap.fromTo(photo, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
        scrollTrigger: { trigger: photo, start: 'top 100%', end: 'top 30%', scrub: 0.6 } });
    }

    // Close: the word slides up into the band.
    gsap.from('.cta-word', { yPercent: 55, ease: 'none', scrollTrigger: { trigger: '.cta-band', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
    gsap.from('.f-mark', { y: 80, autoAlpha: 0, duration: 1.2, ease: ease, scrollTrigger: { trigger: '.site-footer', start: 'top 85%', once: true } });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
