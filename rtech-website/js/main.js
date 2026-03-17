// ============================================================
//  AXIS ALLIANCE — Main JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll behaviour ──────────────────────────────
  const navbar = document.querySelector('.navbar');
  const updateNav = () => {
    if (!navbar) return;
    if (navbar.classList.contains('solid')) return; // inner pages stay solid
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('transparent');
    }
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Mobile nav toggle ────────────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      toggle.classList.toggle('active');
      if (toggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity  = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // ── Hero video autoplay & subtle parallax ────────────────────
  const heroVideo = document.querySelector('.hero-video-wrap video');
  if (heroVideo) {
    // Ensure autoplay on all browsers (esp. Safari iOS)
    heroVideo.muted = true;
    heroVideo.playbackRate = 0.7; // Slow-motion cinematic effect
    heroVideo.play().catch(() => {
      // If autoplay blocked, play on first interaction
      document.addEventListener('touchstart', () => { heroVideo.play(); heroVideo.playbackRate = 0.5; }, { once: true });
      document.addEventListener('click', () => { heroVideo.play(); heroVideo.playbackRate = 0.5; }, { once: true });
    });

    // Subtle parallax: shift video slightly on scroll
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.25;
      heroVideo.style.transform = `scale(1.06) translateY(${offset}px)`;
    }, { passive: true });
  }

  // ── Floating particles ───────────────────────────────────
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      p.style.left      = `${Math.random() * 100}%`;
      p.style.width     = `${Math.random() * 3 + 1}px`;
      p.style.height    = p.style.width;
      p.style.animationDuration = `${Math.random() * 12 + 8}s`;
      p.style.animationDelay   = `${Math.random() * 8}s`;
      p.style.opacity   = `${Math.random() * 0.5 + 0.2}`;
      particleContainer.appendChild(p);
    }
  }

  // ── Intersection Observer (scroll reveal) ────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('revealed'), parseInt(delay));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el, idx) => {
    // auto-stagger siblings
    const parent = el.parentElement;
    if (parent && parent.classList.contains('stagger')) {
      const siblings = Array.from(parent.children);
      el.style.transitionDelay = `${siblings.indexOf(el) * 0.12}s`;
    }
    observer.observe(el);
  });

  // ── Counter animation ────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObs.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  // ── Smooth scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Typing effect on hero ────────────────────────────────
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const phrases = [
      'Lead with a Vision.',
      'Build with Confidence.',
      'Multiply Always.'
    ];
    let phIdx = 0, charIdx = 0, deleting = false;
    function typeLoop() {
      const phrase = phrases[phIdx];
      if (!deleting) {
        typingEl.textContent = phrase.slice(0, ++charIdx);
        if (charIdx === phrase.length) {
          deleting = true;
          setTimeout(typeLoop, 2200);
          return;
        }
      } else {
        typingEl.textContent = phrase.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          phIdx = (phIdx + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 55 : 95);
    }
    setTimeout(typeLoop, 1200);
  }
});
