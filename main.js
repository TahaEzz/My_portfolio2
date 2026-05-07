/* ═══════════════════════════════════════════════════════════
   TAHA EZZAAFRANI – Portfolio JS
   ═══════════════════════════════════════════════════════════ */

/* ─── THEME SYSTEM ───────────────────────────────────────── */
const themes = ['dark', 'light', 'ocean', 'gold'];
let currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
const themeIcons = { dark: '🌑', light: '☀️', ocean: '🌊', gold: '✦' };

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  currentTheme = theme;
  document.getElementById('theme-icon').textContent = themeIcons[theme] || '◐';
  initCanvas(); // re-init canvas with new colors
}
applyTheme(currentTheme);

// Theme dropdown
const switcher = document.getElementById('theme-switcher');
const dropdown = document.getElementById('theme-dropdown');
switcher.addEventListener('click', () => switcher.classList.toggle('open'));
document.addEventListener('click', e => {
  if (!switcher.contains(e.target)) switcher.classList.remove('open');
});
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    applyTheme(btn.dataset.theme);
    switcher.classList.remove('open');
  });
});

/* ─── CANVAS PARTICLES ───────────────────────────────────── */
let animFrame;
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Get accent color from CSS variable
  const style = getComputedStyle(document.documentElement);
  const accentRaw = style.getPropertyValue('--canvas-color').trim();

  const PARTICLE_COUNT = Math.min(70, Math.floor(window.innerWidth / 20));
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: Math.random() * 1.8 + 0.4,
    alpha: Math.random() * 0.5 + 0.2,
  }));

  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  }

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  if (animFrame) cancelAnimationFrame(animFrame);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const accent = getAccent();
    let rgb;
    try { rgb = hexToRgb(accent); } catch { rgb = [99, 179, 237]; }

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${p.alpha})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const a = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    animFrame = requestAnimationFrame(draw);
  }
  draw();
}

window.addEventListener('resize', () => {
  const canvas = document.getElementById('bg-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* ─── CUSTOM CURSOR ──────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  setTimeout(() => {
    trail.style.left = mouseX + 'px';
    trail.style.top = mouseY + 'px';
  }, 80);
});

document.querySelectorAll('a, button, .tc-card, .skill-category, .cert-card, .interest-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
});

/* ─── TYPED TEXT ─────────────────────────────────────────── */
const roles = [
  'Analyste Financier',
  'Gestionnaire du Risque de Change',
  'Expert en Produits Dérivés',
  'Passionné de Finance Moderne',
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-role');

function typeRole() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
    setTimeout(typeRole, 65);
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(typeRole, 300);
      return;
    }
    setTimeout(typeRole, 35);
  }
}
setTimeout(typeRole, 800);

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

function revealOnScroll() {
  const winH = window.innerHeight;
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const delay = parseFloat(el.dataset.delay || 0);
    if (rect.top < winH - 80) {
      setTimeout(() => el.classList.add('revealed'), delay * 120);
    }
  });
  // Animate skill bars when visible
  document.querySelectorAll('.sb-fill').forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < winH && !bar.style.width) {
      bar.style.width = bar.dataset.w + '%';
    }
  });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });
revealOnScroll(); // run on load

/* ─── COUNTER ANIMATION ──────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = target / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target; clearInterval(interval); return; }
      el.textContent = Math.floor(current);
    }, 30);
  });
}
// Trigger when hero stats are visible
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounters(); statsObserver.disconnect(); } });
}, { threshold: 0.4 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

/* ─── ACTIVE NAV ON SCROLL ───────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const h = sec.offsetHeight;
    if (scrollY >= top && scrollY < top + h) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ─── NAVBAR SCROLL EFFECT ───────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.borderBottomColor = window.scrollY > 50 ? 'var(--border-accent)' : 'var(--border)';
}, { passive: true });

/* ─── MOBILE NAV TOGGLE ──────────────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
navToggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => document.body.classList.remove('nav-open'));
});

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─── SCROLL TO TOP ──────────────────────────────────────── */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── CONTACT FORM ───────────────────────────────────────── */
function sendMessage(btn) {
  const note = document.getElementById('form-note');
  const inputs = document.querySelectorAll('.form-input');
  let valid = true;
  inputs.forEach(inp => {
    if (!inp.value.trim()) { inp.style.borderColor = 'rgba(255,80,80,0.6)'; valid = false; }
    else inp.style.borderColor = '';
  });
  if (!valid) { note.textContent = '⚠ Veuillez remplir tous les champs.'; return; }
  btn.textContent = 'Envoi en cours…';
  btn.disabled = true;
  setTimeout(() => {
    note.textContent = '✓ Message envoyé avec succès !';
    btn.textContent = 'Envoyer le message →';
    btn.disabled = false;
    inputs.forEach(inp => inp.value = '');
  }, 1200);
}

/* ─── DECORATIVE LINE ANIMATION ──────────────────────────── */
// Add animated underline to section titles
document.querySelectorAll('.section-title').forEach(title => {
  title.style.position = 'relative';
});

/* ─── PAGE LOAD ANIMATION ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});

/* ─── INTERACTIVE SKILL BARS HOVER ───────────────────────── */
document.querySelectorAll('.skill-bar-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const fill = item.querySelector('.sb-fill');
    if (fill) {
      fill.style.filter = 'brightness(1.3)';
    }
  });
  item.addEventListener('mouseleave', () => {
    const fill = item.querySelector('.sb-fill');
    if (fill) fill.style.filter = '';
  });
});

/* ─── FLOATING CARDS PARALLAX ────────────────────────────── */
document.addEventListener('mousemove', e => {
  const mx = (e.clientX / window.innerWidth - 0.5) * 12;
  const my = (e.clientY / window.innerHeight - 0.5) * 12;
  document.querySelectorAll('.float-card').forEach((card, i) => {
    const factor = i % 2 === 0 ? 1 : -1;
    card.style.transform = `translate(${mx * factor * 0.4}px, ${my * factor * 0.4}px)`;
  });
});

/* ─── CV DOWNLOAD TRACKING ───────────────────────────────── */
document.getElementById('cv-download')?.addEventListener('click', () => {
  console.log('CV downloaded');
});
 
