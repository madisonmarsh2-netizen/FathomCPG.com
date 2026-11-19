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

  // Other numbers (stat cards, the ask) count up on a timer once they are on screen.
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

  // Hero bars animate on load.
  document.querySelectorAll('.cs-hero .cs-bar [data-count]').forEach(trackBar);

  // Sections that scroll into view.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
      var bars = e.target.querySelectorAll('.cs-bar [data-count]');
      if (bars.length) requestAnimationFrame(function () { bars.forEach(trackBar); });
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach(function (el) { io.observe(el); });

  var co = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      countUp(e.target, e.target.closest('.cs-receipt') ? 650 : 350);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { if (!el.closest('.cs-bar')) co.observe(el); });

  // Printing: show everything and the final figures.
  window.addEventListener('beforeprint', function () {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    counters.forEach(function (el) { el.textContent = fmt(el, endOf(el)); });
  });
})();
