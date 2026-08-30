/* ==========================================================================
   main.js
   Three behaviors, in order of importance:
     1. Scroll reveal   — elements fade up as they enter the viewport
     2. Path progress   — the flight-plan line fills as you scroll it
     3. Nav state       — the header gets a background once you leave the hero

   Everything checks prefers-reduced-motion first.
   ========================================================================== */

(function () {
  'use strict';

  // Does the visitor's OS ask for reduced motion? If so we show everything
  // immediately instead of animating it in.
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ------------------------------------------------------------------------
     1. SCROLL REVEAL

     IntersectionObserver tells us when an element enters the viewport. It is
     far cheaper than listening to every scroll event and measuring positions
     ourselves — the browser does the work off the main thread.
     ------------------------------------------------------------------------ */

  const revealItems = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  } else {
    // Stagger: within any one parent, each .reveal child waits a little longer
    // than the one before it. This is what makes a group feel choreographed
    // rather than all snapping in at once.
    const groups = new Map();

    revealItems.forEach((el) => {
      const parent = el.parentElement;
      const index = groups.get(parent) || 0;
      // Cap the delay so long lists don't end with a visible lag.
      el.style.animationDelay = Math.min(index * 80, 400) + 'ms';
      groups.set(parent, index + 1);
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          // Reveal once, then stop watching. Re-animating on every scroll
          // past is distracting.
          revealObserver.unobserve(entry.target);
        });
      },
      {
        // Fire slightly before the element reaches the bottom edge, so the
        // animation is already underway by the time it's properly in view.
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.1,
      }
    );

    revealItems.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
     2. FLIGHT-PLAN PROGRESS LINE

     We can't do this with IntersectionObserver because we need a continuous
     0–1 value, not a yes/no. So we measure on scroll — but we throttle with
     requestAnimationFrame so we never do the math more than once per frame.
     ------------------------------------------------------------------------ */

  const track = document.getElementById('path-track');

  if (track) {
    const waypoints = track.querySelectorAll('.path__wpt');

    if (prefersReducedMotion) {
      track.style.setProperty('--path-progress', '1');
      waypoints.forEach((wpt) => wpt.classList.add('is-active'));
    } else {
      let ticking = false;

      function updatePath() {
        const rect = track.getBoundingClientRect();
        const viewportH = window.innerHeight;

        // Start filling when the top of the track reaches 70% down the screen.
        const startOffset = viewportH * 0.7;
        const travelled = startOffset - rect.top;

        // Clamp to 0–1. Math.max/Math.min is the simplest clamp in JS.
        const progress = Math.max(0, Math.min(1, travelled / rect.height));

        track.style.setProperty('--path-progress', progress.toFixed(4));

        // Light up each waypoint dot as the line reaches it.
        waypoints.forEach((wpt) => {
          const dotY = wpt.getBoundingClientRect().top;
          wpt.classList.toggle('is-active', dotY < startOffset);
        });

        ticking = false;
      }

      function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updatePath);
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      updatePath(); // run once on load in case the page opens mid-scroll
    }
  }

  /* ------------------------------------------------------------------------
     3. NAV BACKGROUND ON SCROLL
     ------------------------------------------------------------------------ */

  const nav = document.querySelector('.nav');

  if (nav) {
    let navTicking = false;

    function updateNav() {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
      navTicking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (navTicking) return;
        navTicking = true;
        window.requestAnimationFrame(updateNav);
      },
      { passive: true }
    );

    updateNav();
  }
})();
