// Category snapshot sample page: time-based fallback for scroll-driven reveals (Safari, Firefox).
// Browsers with animation-timeline: view() and users with reduced motion never run this.
(function () {
  if (!('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supported = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  if (reduce || supported) return;
  document.documentElement.classList.add('cs-io');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.cs-reveal').forEach(function (el) { io.observe(el); });
})();
