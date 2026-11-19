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
  function countUp(el, delay) {
    var end = parseFloat(el.getAttribute('data-count'));
    var dur = 1200, t0 = null;
    el.textContent = fmt(el, 0);
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = fmt(el, end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(el, end);
    }
    setTimeout(function () { requestAnimationFrame(step); }, delay || 0);
  }

  // Sections that scroll into view.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach(function (el) { io.observe(el); });

  // Numbers count up as they come into view (the hero ones start right away, after the bars begin to wipe).
  var co = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      var inHero = !!e.target.closest('.cs-hero');
      countUp(e.target, inHero ? 700 : (e.target.closest('.cs-receipt') ? 650 : 350));
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { co.observe(el); });

  // Printing: show everything.
  window.addEventListener('beforeprint', function () {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  });
})();
