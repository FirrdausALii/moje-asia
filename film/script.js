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
  const trailerStatus = document.getElementById('filmTrailerStatus');

  if (trailerSection && trailerVideo && 'IntersectionObserver' in window) {
    var userInteracted = false;
    var inView = false;
    var desiredPlay = true;
    var pauseTimer = null;
    var canPlayOnce = false;

    function setStatus(msg) {
      if (!trailerStatus) return;
      trailerStatus.textContent = msg || '';
    }

    function markUserInteracted() {
      userInteracted = true;
    }

    // Treat common user interactions as "interaction" so autoplay can be less strict later.
    trailerVideo.addEventListener('play', markUserInteracted);
    trailerVideo.addEventListener('pointerdown', markUserInteracted);
    trailerVideo.addEventListener('touchstart', markUserInteracted);
    trailerVideo.addEventListener('keydown', markUserInteracted);
    trailerVideo.addEventListener('volumechange', markUserInteracted);

    function attemptPlay() {
      if (!desiredPlay) return;
      if (!inView) return;
      if (trailerVideo.readyState < 2) return; // HAVE_CURRENT_DATA-ish

      if (!trailerVideo.paused && !trailerVideo.ended) return;

      // Most browsers require muted autoplay; once user interacts they can unmute.
      if (!userInteracted) trailerVideo.muted = true;

      var playPromise = trailerVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          // Keep it muted; user can press play/unmute manually.
          trailerVideo.muted = true;
          setStatus('Autoplay blocked — tap play.');
        });
      }
    }

    trailerVideo.addEventListener('canplay', function () {
      canPlayOnce = true;
      attemptPlay();
    });

    trailerVideo.addEventListener('loadedmetadata', function () {
      setStatus('Loading trailer…');
    });

    trailerVideo.addEventListener('playing', function () {
      setStatus('');
    });

    trailerVideo.addEventListener('error', function () {
      if (trailerVideo.error) {
        setStatus('Trailer error (code ' + trailerVideo.error.code + ').');
      } else {
        setStatus('Trailer error.');
      }
    });

    var trailerIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            inView = true;
            desiredPlay = true;
            if (pauseTimer) {
              clearTimeout(pauseTimer);
              pauseTimer = null;
            }
            attemptPlay();
          } else {
            inView = false;
            if (pauseTimer) clearTimeout(pauseTimer);
            // Debounce pause: avoid instantly pausing during layout shifts / tiny scroll changes.
            pauseTimer = setTimeout(function () {
              trailerVideo.pause();
            }, 250);
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
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
