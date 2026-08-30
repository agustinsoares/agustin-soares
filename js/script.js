const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let alreadyVisited = false;
try {
  alreadyVisited = sessionStorage.getItem('as-loaded') === '1';
  sessionStorage.setItem('as-loaded', '1');
} catch (err) {
  /* storage unavailable — fall back to always showing the loader */
}

const willShowLoader = !prefersReducedMotion && !alreadyVisited;

/* LOADER — number counter intro, inspired by gauthamui.com */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  if (!willShowLoader) {
    loader.remove();
    return;
  }

  document.body.classList.add('is-loading');
  const numEl = document.getElementById('loaderNum');
  const barFill = document.getElementById('loaderBarFill');
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(100, Math.round((elapsed / duration) * 100));
    numEl.textContent = progress;
    if (barFill) barFill.style.width = `${progress}%`;

    if (progress < 100) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => {
        loader.classList.add('loader-done');
        document.body.classList.remove('is-loading');
        loader.addEventListener('transitionend', () => loader.remove(), { once: true });
      }, 250);
    }
  }
  requestAnimationFrame(tick);
})();

/* NAVBAR */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* NAV MENU (hamburger dropdown) */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.classList.contains('open')) return;
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* SCROLL REVEAL with per-group stagger */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach((el) => {
  const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('fade-in'));
  const index = siblings.indexOf(el);
  el.style.transitionDelay = `${Math.min(index, 6) * 90}ms`;
  observer.observe(el);
});

/* HERO NAME — split into characters and reveal on load */
function splitIntoChars(el) {
  const text = el.textContent;
  const baseDelay = willShowLoader ? 1.65 : 0.2;
  el.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.animationDelay = `${baseDelay + i * 0.045}s`;
    span.textContent = ch === ' ' ? ' ' : ch;
    el.appendChild(span);
  });
}

document.querySelectorAll('[data-split]').forEach(splitIntoChars);

/* CUSTOM CURSOR */
const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsFinePointer && !prefersReducedMotion) {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

  document.body.classList.add('cursor-active');

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorDot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactiveSelector = 'a, button, .project-card, .edu-card, .cert-card';
  document.querySelectorAll(interactiveSelector).forEach((elm) => {
    elm.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
    elm.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
  });
}
