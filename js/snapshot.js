// Category snapshot sample work: scroll reveals and number count-ups.
// Skipped entirely when the visitor has reduced motion turned on; the page then shows its final state with no animation.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var reveals = document.querySelectorAll('.cs-reveal');
  var counters = document.querySelectorAll('[data-count]');
  if (reduce || !('IntersectionObserver' in window)) {
    // No animation: make sure nothing is left hidden.
    root.classList.remove('cs-js');
    return;
  }

  function fmt(el, v) {
    return (el.getAttribute('data-pre') || '') + v.toFixed(+(el.getAttribute('data-dec') || 0)) + (el.getAttribute('data-suf') || '');
  }
  function endOf(el) { return parseFloat(el.getAttribute('data-count')); }

  // Every number starts at zero before it is ever shown, so the final figure never flashes up before it counts.
  counters.forEach(function (el) {
    el.textContent = fmt(el, 0);
    el.classList.add('cs-set');
  });

  // Numbers inside a growth bar follow that bar's wipe animation frame by frame, so they count up as the bar fills.
  function trackBar(el) {
    var bar = el.closest('.cs-bar');
    var end = endOf(el), waited = 0;
    function tick() {
      var anim = null;
      if (bar && bar.getAnimations) {
        var list = bar.getAnimations();
        for (var i = 0; i < list.length; i++) { if (list[i].animationName === 'csWipe') { anim = list[i]; break; } }
      }
      if (!anim) {
        // Animation not created yet; give it a second, then just show the final figure.
        if (++waited > 60) { el.textContent = fmt(el, end); return; }
        requestAnimationFrame(tick);
        return;
      }
      var t = anim.effect.getComputedTiming();
      if (t.phase === 'after') { el.textContent = fmt(el, end); return; }
      var p = t.progress == null ? 0 : t.progress;
      el.textContent = fmt(el, end * Math.max(0, Math.min(1, p)));
      requestAnimationFrame(tick);
    }
    tick();
  }

  // Other numbers (stat cards, the ask) count up once their section is revealed, timed to when their card pops in.
  function countUp(el, delay) {
    var end = endOf(el), dur = 1200, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = fmt(el, end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(el, end);
    }
    setTimeout(function () { requestAnimationFrame(step); }, delay || 0);
  }
  function startCounters(section) {
    section.querySelectorAll('[data-count]').forEach(function (el) {
      if (el.closest('.cs-bar')) return; // bar numbers follow their bar (trackBar)
      var card = el.closest('.cs-stagger > *');
      var delay = card ? 250 + 120 * Array.prototype.indexOf.call(card.parentNode.children, card) + 250
                       : (el.closest('.cs-receipt') ? 650 : 350);
      countUp(el, delay);
    });
  }

  // Hero bars animate on load.
  document.querySelectorAll('.cs-hero .cs-bar [data-count]').forEach(trackBar);

  // One animation at a time, only for what the visitor is looking at.
  // Nothing below the hero starts until they scroll; a section starts once its top is in the upper part of the screen,
  // and if several qualify together (a fast scroll, a tall screen) they play in page order, one after another.
  var GAP = 900;                 // ms between the start of one section's animation and the next
  var scrolled = window.scrollY > 8;
  var waiting = [];              // sections that are in view and waiting their turn
  var lastStart = -Infinity, timer = null;

  function reveal(el) {
    el.classList.add('is-visible');
    startCounters(el);
    var bars = el.querySelectorAll('.cs-bar [data-count]');
    if (bars.length) requestAnimationFrame(function () { bars.forEach(trackBar); });
  }
  function pump() {
    timer = null;
    if (!scrolled || !waiting.length) return;
    var wait = lastStart + GAP - Date.now();
    if (wait > 0) { timer = setTimeout(pump, wait); return; }
    waiting.sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
    reveal(waiting.shift());
    lastStart = Date.now();
    if (waiting.length) timer = setTimeout(pump, GAP);
  }
  function onScroll() {
    if (scrolled) return;
    if (window.scrollY > 8) { scrolled = true; pump(); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('wheel', function () { if (!scrolled) { scrolled = true; pump(); } }, { passive: true });
  window.addEventListener('touchmove', function () { if (!scrolled) { scrolled = true; pump(); } }, { passive: true });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting || waiting.indexOf(e.target) !== -1) return;
      io.unobserve(e.target);
      waiting.push(e.target);
    });
    pump();
  }, { threshold: 0, rootMargin: '0px 0px -28% 0px' });
  reveals.forEach(function (el) { io.observe(el); });

  // Printing: show everything and the final figures.
  window.addEventListener('beforeprint', function () {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    counters.forEach(function (el) { el.textContent = fmt(el, endOf(el)); });
  });
})();
