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
    const revealEls = document.querySelectorAll('.film-card, .film-peer-target, .film-trailer-wrap');
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

  /* —— Interactive: disturb hero poster —— */
  const disturbBtn = document.getElementById('filmDisturbPoster');
  if (disturbBtn) {
    var disturbTimer = null;
    function triggerDisturb() {
      if (disturbTimer) clearTimeout(disturbTimer);
      disturbBtn.classList.remove('is-disturbed');
      void disturbBtn.offsetWidth;
      disturbBtn.classList.add('is-disturbed');
      disturbTimer = setTimeout(function () {
        disturbBtn.classList.remove('is-disturbed');
        disturbTimer = null;
      }, 900);
    }
    disturbBtn.addEventListener('click', triggerDisturb);
  }

  /* —— Stir the static (title glitch) —— */
  const stirBtn = document.getElementById('filmStirStatic');
  const heroTitle = document.getElementById('filmHeroTitle');
  const staticHint = document.getElementById('filmStaticHint');
  var glitchHintTimer = null;

  function runStirStatic() {
    if (!heroTitle) return;
    if (glitchHintTimer) clearTimeout(glitchHintTimer);
    heroTitle.classList.remove('film-title-glitch');
    void heroTitle.offsetWidth;
    heroTitle.classList.add('film-title-glitch');
    if (staticHint) {
      staticHint.textContent = 'Signal unstable…';
      glitchHintTimer = setTimeout(function () {
        staticHint.textContent = '';
        glitchHintTimer = null;
      }, 1600);
    }
    setTimeout(function () {
      heroTitle.classList.remove('film-title-glitch');
    }, 800);
  }

  if (stirBtn) {
    stirBtn.addEventListener('click', runStirStatic);
  }

  /* Autoplay stir once after first paint */
  if (heroTitle) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setTimeout(runStirStatic, 420);
      });
    });
  }

  /* —— Trailer: play in view, pause out of view (resume on return) —— */
  const trailerSection = document.getElementById('trailer');
  const trailerVideo = document.getElementById('filmTrailerVideo');
  if (trailerSection && trailerVideo && 'IntersectionObserver' in window) {
    var trailerIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            trailerVideo.play().catch(function () {
              if (trailerVideo.muted) return;
              trailerVideo.muted = true;
              trailerVideo.play().catch(function () {});
            });
          } else {
            trailerVideo.pause();
          }
        });
      },
      {
        root: null,
        threshold: 0.22,
        rootMargin: '0px 0px -8% 0px'
      }
    );
    trailerIo.observe(trailerSection);
  }

  /* —— Interactive: peer closer (gallery posters) —— */
  document.querySelectorAll('[data-film-peer]').forEach(function (el) {
    function togglePeer() {
      var on = !el.classList.contains('is-peering');
      el.classList.toggle('is-peering', on);
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    el.addEventListener('click', function (e) {
      e.preventDefault();
      togglePeer();
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePeer();
      }
    });
  });
})();
