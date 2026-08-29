const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* NAVBAR */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* SMOOTH SCROLL (Lenis) */
if (!prefersReducedMotion && window.Lenis) {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
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
  el.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.animationDelay = `${0.3 + i * 0.045}s`;
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
