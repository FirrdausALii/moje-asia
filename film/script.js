(function () {
  'use strict';

  const header = document.querySelector('.film-header');
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  const backTop = document.getElementById('filmBackTop');
  if (backTop) {
    function toggleBackTop() {
      backTop.classList.toggle('is-visible', window.scrollY > 400);
    }
    window.addEventListener('scroll', toggleBackTop, { passive: true });
    toggleBackTop();
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const navbarCollapse = document.querySelector('#filmNav');
  if (navbarCollapse) {
    function hideNavMobile() {
      if (
        typeof bootstrap !== 'undefined' &&
        window.matchMedia('(max-width: 991.98px)').matches &&
        navbarCollapse.classList.contains('show')
      ) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
      }
    }
    document.querySelectorAll('#filmNav .nav-link').forEach(function (link) {
      link.addEventListener('click', hideNavMobile);
    });
  }

  if ('IntersectionObserver' in window) {
    const revealEls = document.querySelectorAll('.film-card, .film-poster-figure, .film-trailer-wrap');
    revealEls.forEach(function (el) {
      el.classList.add('film-reveal');
    });
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }
})();
