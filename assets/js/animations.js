/* ═══════════════════════════════════════════════════════════
   MBUILD DEVELOPERS — animations.js
   Premium animations inspired by Emil Kowalski's principles:
   spring physics · magnetic effects · staggered reveals ·
   number counters · parallax · smooth transitions

   DROP IN: assets/js/animations.js
   ADD TO EVERY PAGE before </body>:
     <script src="../assets/js/animations.js"></script>
     (index.html: <script src="assets/js/animations.js"></script>)

   Zero dependencies. Pure CSS + Vanilla JS.
   Works on all 8 pages automatically.
═══════════════════════════════════════════════════════════ */

(() => {
'use strict';

/* ══════════════════════════════════════
   1. SPRING PHYSICS ENGINE
   Emil's signature — real spring easing
══════════════════════════════════════ */
function spring(mass = 1, stiffness = 100, damping = 10, velocity = 0) {
  const w0     = Math.sqrt(stiffness / mass);
  const zeta   = damping / (2 * Math.sqrt(stiffness * mass));
  const wd     = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  const b      = velocity / (wd || 1) + zeta * w0;

  return function(t) {
    if (zeta < 1) {
      return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + b * Math.sin(wd * t));
    } else {
      return 1 - (1 + b * t) * Math.exp(-w0 * t);
    }
  };
}

const SPRING_SNAPPY = spring(1, 120, 14);
const SPRING_GENTLE = spring(1, 60, 10);
const SPRING_BOUNCY = spring(1, 200, 12);

function applySpring(el, from, to, duration = 600, springFn = SPRING_SNAPPY, onComplete) {
  const start  = performance.now();
  const update = (now) => {
    const t    = Math.min((now - start) / duration, 1);
    const ease = springFn(t);
    const cur  = from + (to - from) * ease;
    el.style.transform = cur;
    if (t < 1) requestAnimationFrame(update);
    else if (onComplete) onComplete();
  };
  requestAnimationFrame(update);
}

/* ══════════════════════════════════════
   2. INJECT GLOBAL CSS
══════════════════════════════════════ */
const style = document.createElement('style');
style.textContent = `

/* ── PAGE LOAD FADE-IN ── */
body { opacity: 0; }
body.loaded { opacity: 1; transition: opacity .45s ease; }

/* ── SCROLL REVEAL BASE ── */
.mb-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity .75s cubic-bezier(0.16,1,0.3,1),
              transform .75s cubic-bezier(0.16,1,0.3,1);
  will-change: opacity, transform;
}
.mb-reveal.mb-visible { opacity: 1; transform: translateY(0); }
.mb-reveal-left  { opacity: 0; transform: translateX(-40px); transition: opacity .75s cubic-bezier(0.16,1,0.3,1), transform .75s cubic-bezier(0.16,1,0.3,1); }
.mb-reveal-right { opacity: 0; transform: translateX(40px);  transition: opacity .75s cubic-bezier(0.16,1,0.3,1), transform .75s cubic-bezier(0.16,1,0.3,1); }
.mb-reveal-left.mb-visible,
.mb-reveal-right.mb-visible { opacity: 1; transform: translateX(0); }
.mb-reveal-scale { opacity: 0; transform: scale(0.9) translateY(20px); transition: opacity .7s cubic-bezier(0.16,1,0.3,1), transform .7s cubic-bezier(0.16,1,0.3,1); }
.mb-reveal-scale.mb-visible { opacity: 1; transform: scale(1) translateY(0); }

/* Stagger delays */
.mb-d1  { transition-delay: .08s !important; }
.mb-d2  { transition-delay: .16s !important; }
.mb-d3  { transition-delay: .24s !important; }
.mb-d4  { transition-delay: .32s !important; }
.mb-d5  { transition-delay: .40s !important; }
.mb-d6  { transition-delay: .48s !important; }
.mb-d7  { transition-delay: .56s !important; }
.mb-d8  { transition-delay: .64s !important; }

/* ── MAGNETIC BUTTON ── */
.mb-magnetic {
  display: inline-flex;
  position: relative;
  transition: box-shadow .3s ease;
}
.mb-magnetic:hover {
  box-shadow: 0 20px 60px rgba(201,168,76,.4);
}

/* ── CARD TILT ── */
.mb-tilt {
  transform-style: preserve-3d;
  transition: transform .1s ease-out, box-shadow .3s ease;
  will-change: transform;
}
.mb-tilt:hover {
  box-shadow: 0 24px 64px rgba(26,53,88,.22) !important;
}

/* ── IMAGE PARALLAX ── */
.mb-parallax-wrap { overflow: hidden; }
.mb-parallax-img  { transition: transform .1s linear; will-change: transform; }

/* ── SPLIT TEXT ── */
.mb-word { display: inline-block; overflow: hidden; }
.mb-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(110%);
  transition: opacity .5s cubic-bezier(0.16,1,0.3,1),
              transform .5s cubic-bezier(0.16,1,0.3,1);
  will-change: transform;
}
.mb-char.mb-char-visible { opacity: 1; transform: translateY(0); }

/* ── COUNTER ── */
.mb-counter { transition: none; }

/* ── HOVER SHIMMER on cards ── */
.mb-shimmer {
  position: relative;
  overflow: hidden;
}
.mb-shimmer::after {
  content: '';
  position: absolute;
  top: -60%;
  left: -100%;
  width: 60%;
  height: 220%;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255,255,255,.12) 50%,
    transparent 60%
  );
  transform: skewX(-20deg);
  transition: left .6s ease;
  pointer-events: none;
}
.mb-shimmer:hover::after { left: 160%; }

/* ── GOLD LINE DRAW ── */
.mb-line-draw {
  position: relative;
}
.mb-line-draw::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 0; height: 2px;
  background: linear-gradient(90deg, #c9a84c, #e2c97e);
  transition: width .5s cubic-bezier(0.16,1,0.3,1);
}
.mb-line-draw.mb-visible::after,
.mb-line-draw:hover::after { width: 100%; }

/* ── FLOATING NUMBERS ── */
@keyframes mbFloat {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}
.mb-float { animation: mbFloat 3s ease-in-out infinite; }
.mb-float-2 { animation: mbFloat 3s ease-in-out infinite .5s; }
.mb-float-3 { animation: mbFloat 3s ease-in-out infinite 1s; }

/* ── PULSE RING ── */
@keyframes mbPulseRing {
  0%   { transform: scale(.9);  opacity: .8; }
  100% { transform: scale(1.6); opacity: 0; }
}
.mb-pulse-ring {
  position: relative;
}
.mb-pulse-ring::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: inherit;
  background: rgba(201,168,76,.3);
  animation: mbPulseRing 2s ease-out infinite;
  pointer-events: none;
}

/* ── CURSOR GLOW ── */
.mb-cursor-glow {
  position: fixed;
  width: 350px; height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,.05) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: opacity .4s ease;
  opacity: 0;
}

/* ── HERO ENTRANCE ── */
@keyframes mbHeroFade {
  from { opacity: 0; transform: translateY(36px); }
  to   { opacity: 1; transform: translateY(0); }
}
.mb-hero-anim > * {
  opacity: 0;
  animation: mbHeroFade .8s cubic-bezier(0.16,1,0.3,1) forwards;
}
.mb-hero-anim > *:nth-child(1) { animation-delay: .15s; }
.mb-hero-anim > *:nth-child(2) { animation-delay: .28s; }
.mb-hero-anim > *:nth-child(3) { animation-delay: .40s; }
.mb-hero-anim > *:nth-child(4) { animation-delay: .52s; }
.mb-hero-anim > *:nth-child(5) { animation-delay: .64s; }

/* ── SECTION HEADER LINE ── */
.mb-heading-line {
  position: relative;
  display: inline-block;
}
.mb-heading-line::before {
  content: '';
  position: absolute;
  left: 0; bottom: -6px;
  width: 0; height: 3px;
  background: linear-gradient(90deg, #c9a84c, transparent);
  transition: width .9s cubic-bezier(0.16,1,0.3,1);
  border-radius: 2px;
}
.mb-heading-line.mb-visible::before { width: 100%; }

/* ── SCROLL PROGRESS ── */
#mb-progress {
  position: fixed; top: 0; left: 0; z-index: 9999;
  height: 2px; width: 0%;
  background: linear-gradient(90deg, #c9a84c, #e2c97e);
  transition: width .1s linear;
  pointer-events: none;
}

/* ── SMOOTH HOVER for nav links ── */
.navbar a {
  transition: color .25s ease !important;
  position: relative;
}

/* ── IMG REVEAL ── */
.mb-img-reveal {
  clip-path: inset(100% 0 0 0);
  transition: clip-path .9s cubic-bezier(0.16,1,0.3,1);
}
.mb-img-reveal.mb-visible {
  clip-path: inset(0% 0 0 0);
}

/* ── STAGGER CHILDREN ── */
.mb-stagger-children > * {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .6s cubic-bezier(0.16,1,0.3,1),
              transform .6s cubic-bezier(0.16,1,0.3,1);
}
.mb-stagger-children.mb-visible > *:nth-child(1) { opacity:1; transform:translateY(0); transition-delay: .05s; }
.mb-stagger-children.mb-visible > *:nth-child(2) { opacity:1; transform:translateY(0); transition-delay: .13s; }
.mb-stagger-children.mb-visible > *:nth-child(3) { opacity:1; transform:translateY(0); transition-delay: .21s; }
.mb-stagger-children.mb-visible > *:nth-child(4) { opacity:1; transform:translateY(0); transition-delay: .29s; }
.mb-stagger-children.mb-visible > *:nth-child(5) { opacity:1; transform:translateY(0); transition-delay: .37s; }
.mb-stagger-children.mb-visible > *:nth-child(6) { opacity:1; transform:translateY(0); transition-delay: .45s; }
.mb-stagger-children.mb-visible > *:nth-child(n+7) { opacity:1; transform:translateY(0); transition-delay: .53s; }

`;
document.head.appendChild(style);

/* ══════════════════════════════════════
   3. PAGE LOAD FADE-IN
══════════════════════════════════════ */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

/* ══════════════════════════════════════
   4. SCROLL PROGRESS BAR
══════════════════════════════════════ */
let progressBar = document.getElementById('mb-progress') || document.getElementById('progress-bar');
if (!progressBar) {
  progressBar = document.createElement('div');
  progressBar.id = 'mb-progress';
  document.body.prepend(progressBar);
}
window.addEventListener('scroll', () => {
  const s   = document.documentElement;
  const pct = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ══════════════════════════════════════
   5. CURSOR GLOW (desktop only)
══════════════════════════════════════ */
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.className = 'mb-cursor-glow';
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  function animGlow() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animGlow);
  }
  animGlow();
}

/* ══════════════════════════════════════
   6. AUTO-APPLY CLASSES TO ELEMENTS
   (no manual data-attributes needed)
══════════════════════════════════════ */
function autoApplyClasses() {
  // Hero content gets staggered entrance
  const heroContent = document.querySelector('.hero-content, .int-hero-content, .page-hero-content');
  if (heroContent) heroContent.classList.add('mb-hero-anim');

  // Section titles get line draw + reveal
  document.querySelectorAll('.sec-title, .section-title, .sec-eye, .section-eye').forEach((el, i) => {
    if (!el.classList.contains('mb-reveal')) {
      el.classList.add('mb-reveal', `mb-d${Math.min(i % 3 + 1, 5)}`);
    }
    if (el.tagName.match(/H[1-6]/)) el.classList.add('mb-heading-line');
  });

  // Cards get shimmer + tilt
  document.querySelectorAll(
    '.service-card, .proj-card, .int-card, .team-card, .award-card, .cert-card, .cert-badge, .why-point, .vm-card, .test-card, .renown-card, .contact-left-top, .contact-form-card, .hours-card'
  ).forEach(el => {
    el.classList.add('mb-shimmer', 'mb-tilt');
  });

  // Buttons get magnetic effect
  document.querySelectorAll(
    '.btn-hero-primary, .btn-hero-ghost, .btn-gold, .btn-cta-gold, .btn-cta-wa, .hero-cta, .int-hero-btn, .submit-btn, .btn-gold-fill, .wb-btn-gold'
  ).forEach(el => {
    el.classList.add('mb-magnetic');
  });

  // Images get parallax
  document.querySelectorAll('.story-img-block img, .why-img-block img, .why-right-panel img, .sb-image img').forEach(img => {
    const wrap = img.parentElement;
    wrap.classList.add('mb-parallax-wrap');
    img.classList.add('mb-parallax-img');
  });

  // Project & gallery grids — stagger children
  document.querySelectorAll(
    '.services-grid, .proj-grid, .int-grid, .team-grid, .awards-grid, .certs-strip, .stats-row, .trust-bar, .vm-grid, .renown-grid, .gallery-mosaic, .award-photos-grid, .info-cards, .quick-actions'
  ).forEach(el => {
    el.classList.add('mb-stagger-children');
  });

  // Stat numbers get counter animation
  document.querySelectorAll('.ts-num, .stat-num, .sn, .hfs-num, .hc-num').forEach(el => {
    el.classList.add('mb-counter');
  });

  // Floating elements
  document.querySelectorAll('.hero-float-card, .hc-card, .hfs').forEach((el, i) => {
    el.classList.add(`mb-float${i === 0 ? '' : i === 1 ? '-2' : '-3'}`);
  });

  // WhatsApp float pulse
  const waFloat = document.querySelector('.wa-float');
  if (waFloat) waFloat.classList.add('mb-pulse-ring');

  // Images reveal
  document.querySelectorAll('.award-photo-tile img, .g-tile img, .gallery-item img, .proj-thumb img').forEach(img => {
    img.parentElement.classList.add('mb-img-reveal');
  });

  // General reveals — anything not yet assigned
  document.querySelectorAll(
    '.sec-sub, .section-sub, .hero-sub, .card, .info-card, .contact-detail, .social-btn, .map-wrap, .map-actions, .owner-bio, .owner-skills, .owner-quote-block, .story-highlights, .story-text'
  ).forEach((el, i) => {
    if (!el.classList.contains('mb-reveal') && !el.classList.contains('mb-stagger-children')) {
      el.classList.add('mb-reveal', `mb-d${i % 4 + 1}`);
    }
  });
}

/* ══════════════════════════════════════
   7. INTERSECTION OBSERVER — REVEALS
══════════════════════════════════════ */
function initScrollReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('mb-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.mb-reveal, .mb-reveal-left, .mb-reveal-right, .mb-reveal-scale, .mb-heading-line, .mb-stagger-children, .mb-img-reveal, .mb-line-draw').forEach(el => {
    io.observe(el);
  });

  // Also handle existing .reveal classes from page CSS
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in', 'visible');
        io2.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => {
    io2.observe(el);
  });
}

/* ══════════════════════════════════════
   8. NUMBER COUNTER ANIMATION
══════════════════════════════════════ */
function animateCounter(el) {
  const text     = el.textContent.trim();
  const suffix   = text.replace(/[\d,\.]/g, '');  // e.g. '+', 'Cr+', '%'
  const numStr   = text.replace(/[^\d\.]/g, '');
  const target   = parseFloat(numStr);
  if (isNaN(target) || target === 0) return;

  const isDecimal = numStr.includes('.');
  const duration  = 1800;
  const start     = performance.now();

  function update(now) {
    const t       = Math.min((now - start) / duration, 1);
    const ease    = 1 - Math.pow(1 - t, 4); // ease-out-quart
    const current = target * ease;
    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('en-IN')) + suffix;
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = text; // restore exact original
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.mb-counter').forEach(el => io.observe(el));
}

/* ══════════════════════════════════════
   9. MAGNETIC BUTTON EFFECT
   Mouse moves button toward cursor
══════════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll('.mb-magnetic').forEach(btn => {
    const STRENGTH = 0.35;
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * STRENGTH;
      const dy = (e.clientY - cy) * STRENGTH;
      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1)';
      btn.style.transform  = 'translate(0,0) scale(1)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform .15s ease-out';
    });
  });
}

/* ══════════════════════════════════════
   10. CARD 3D TILT
   Smooth spring-based perspective tilt
══════════════════════════════════════ */
function initTilt() {
  document.querySelectorAll('.mb-tilt').forEach(card => {
    let raf;
    const MAX = 6;

    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r  = card.getBoundingClientRect();
        const x  = (e.clientX - r.left) / r.width  - 0.5;
        const y  = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * MAX}deg) rotateX(${-y * MAX}deg) scale(1.02)`;
        card.style.transition = 'transform .1s ease-out';
      });
    });

    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform  = '';
      card.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1)';
    });
  });
}

/* ══════════════════════════════════════
   11. PARALLAX IMAGES ON SCROLL
══════════════════════════════════════ */
function initParallax() {
  const imgs = document.querySelectorAll('.mb-parallax-img');
  if (!imgs.length) return;

  function update() {
    imgs.forEach(img => {
      const wrap = img.parentElement;
      const rect = wrap.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const offset   = (progress - 0.5) * 60;
      img.style.transform = `translateY(${offset}px) scale(1.08)`;
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ══════════════════════════════════════
   12. HERO IMAGE KEN BURNS
   (if not already animated)
══════════════════════════════════════ */
function initHeroKenBurns() {
  const heroImg = document.querySelector('.hero-img-bg, .hero-img');
  if (!heroImg || heroImg.style.animation) return;

  const ks = document.createElement('style');
  ks.textContent = `
    @keyframes mbKenBurns {
      0%   { transform: scale(1.04) translateX(0); }
      50%  { transform: scale(1.1)  translateX(-1%); }
      100% { transform: scale(1.04) translateX(0); }
    }`;
  document.head.appendChild(ks);
  heroImg.style.animation = 'mbKenBurns 14s ease-in-out infinite';
}

/* ══════════════════════════════════════
   13. SMOOTH ANCHOR SCROLL
══════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    if (a.dataset.scrollInit) return;
    a.dataset.scrollInit = '1';
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════
   14. NAVBAR SCROLL SHADOW
══════════════════════════════════════ */
function initNavbarScroll() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.style.boxShadow = '0 4px 24px rgba(0,0,0,.15)';
      header.style.transition = 'box-shadow .3s ease';
    } else {
      header.style.boxShadow = '';
    }
  }, { passive: true });
}

/* ══════════════════════════════════════
   15. FILTER PILL ANIMATIONS
   Smooth content transition on filter
══════════════════════════════════════ */
function initFilterAnimations() {
  document.querySelectorAll('.pill, .filter-tab, .cat-tab, .status-tab').forEach(pill => {
    pill.addEventListener('click', function() {
      // Animate out hidden items then in
      const grid = document.querySelector('.gallery-grid, .masonry-grid, .gallery-mosaic, #galleryGrid, #masonryGrid');
      if (!grid) return;
      grid.style.opacity    = '0';
      grid.style.transform  = 'translateY(8px)';
      grid.style.transition = 'opacity .2s ease, transform .2s ease';
      setTimeout(() => {
        grid.style.opacity   = '1';
        grid.style.transform = 'translateY(0)';
      }, 250);
    });
  });
}

/* ══════════════════════════════════════
   16. IMAGE LAZY LOAD FADE
══════════════════════════════════════ */
function initImageFade() {
  const imgObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && e.target.complete) {
        e.target.style.opacity = '1';
        imgObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (!img.complete) {
      img.style.opacity    = '0';
      img.style.transition = 'opacity .5s ease';
      img.addEventListener('load', () => { img.style.opacity = '1'; });
    }
    imgObs.observe(img);
  });
}

/* ══════════════════════════════════════
   17. HOVER LIFT for social icons
══════════════════════════════════════ */
function initSocialHover() {
  document.querySelectorAll('.social-icon, .social-btn').forEach(el => {
    el.style.transition = 'transform .3s cubic-bezier(0.16,1,0.3,1)';
    el.addEventListener('mouseenter', () => { el.style.transform = 'translateY(-4px) scale(1.1)'; });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ══════════════════════════════════════
   18. CTA SECTION ENTRANCE
   Gold radial glow pulse
══════════════════════════════════════ */
function initCtaGlow() {
  const cta = document.querySelector('.cta-banner, .cta-section');
  if (!cta) return;

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cta.style.transition = 'opacity .8s ease';
      cta.style.opacity    = '1';
      io.disconnect();
    }
  }, { threshold: 0.2 });

  cta.style.opacity = '0';
  io.observe(cta);
}

/* ══════════════════════════════════════
   19. FORM INPUT FOCUS ANIMATIONS
══════════════════════════════════════ */
function initFormAnimations() {
  document.querySelectorAll('.fg input, .fg textarea, .fg select, .form-group input, .form-group textarea').forEach(input => {
    const group = input.closest('.fg, .form-group');
    if (!group) return;

    const label = group.querySelector('label, .fg label, .form-label, .form-group label');

    input.addEventListener('focus', () => {
      input.style.transform  = 'scale(1.01)';
      input.style.transition = 'transform .2s cubic-bezier(0.16,1,0.3,1), border-color .2s, box-shadow .2s';
    });
    input.addEventListener('blur', () => {
      input.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════
   20. BACK-TO-TOP (auto-adds if missing)
══════════════════════════════════════ */
function initBackToTop() {
  if (document.querySelector('#mb-back-top')) return;

  const btn = document.createElement('button');
  btn.id = 'mb-back-top';
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  btn.style.cssText = `
    position:fixed; bottom:96px; right:28px; z-index:8999;
    width:40px; height:40px; border-radius:50%;
    background:rgba(26,53,88,.85); color:#c9a84c;
    border:1.5px solid rgba(201,168,76,.35);
    font-size:.9rem; display:flex; align-items:center; justify-content:center;
    cursor:pointer; backdrop-filter:blur(8px);
    opacity:0; transform:translateY(10px);
    transition:opacity .3s, transform .3s cubic-bezier(0.16,1,0.3,1), background .2s;
    pointer-events:none;
  `;
  btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(201,168,76,.9)'; btn.style.color = '#0d1f35'; });
  btn.addEventListener('mouseleave', () => { btn.style.background = 'rgba(26,53,88,.85)'; btn.style.color = '#c9a84c'; });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity       = show ? '1' : '0';
    btn.style.transform     = show ? 'translateY(0)' : 'translateY(10px)';
    btn.style.pointerEvents = show ? 'all' : 'none';
  }, { passive: true });
}

/* ══════════════════════════════════════
   21. PAGE TRANSITION (exit animation)
══════════════════════════════════════ */
function initPageTransitions() {
  document.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || a.target === '_blank') return;

    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity    = '0';
      document.body.style.transform  = 'translateY(-8px)';
      document.body.style.transition = 'opacity .3s ease, transform .3s ease';
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });
}

/* ══════════════════════════════════════
   INIT ALL — Run After DOM Ready
══════════════════════════════════════ */
function runAll() {
  autoApplyClasses();
  initScrollReveals();
  initCounters();
  initMagnetic();
  initTilt();
  initParallax();
  initHeroKenBurns();
  initSmoothScroll();
  initNavbarScroll();
  initFilterAnimations();
  initImageFade();
  initSocialHover();
  initCtaGlow();
  initFormAnimations();
  initBackToTop();
  initPageTransitions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAll);
} else {
  runAll();
}

// Re-run for dynamic content loaded after init (Supabase data)
window.addEventListener('mbuild:contentLoaded', runAll);

})();
