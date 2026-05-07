/* ═══════════════════════════════════════════════════════════
   TAHA EZZAAFRANI – Portfolio JS (Optimisé)
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialisation immédiate
  document.body.style.opacity = '1';
  initTheme();
  initCanvas();
  initReveal(); // Correction opacité
  initTypewriter();
  initCounters();
  initNavigation();
  initCursor();
});

/* ─── SYSTÈME DE THÈME ───────────────────────────────────── */
function initTheme() {
  const themes = ['dark', 'light', 'ocean', 'gold'];
  let currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
  const themeIcons = { dark: '🌑', light: '☀️', ocean: '🌊', gold: '✦' };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    const iconEl = document.getElementById('theme-icon');
    if (iconEl) iconEl.textContent = themeIcons[theme] || '◐';
    // On relance le canvas pour adapter les couleurs
    initCanvas();
  };

  applyTheme(currentTheme);

  const switcher = document.getElementById('theme-switcher');
  if (switcher) {
    switcher.addEventListener('click', (e) => {
      e.stopPropagation();
      switcher.classList.toggle('open');
    });
  }

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      applyTheme(btn.dataset.theme);
      if (switcher) switcher.classList.remove('open');
    });
  });

  document.addEventListener('click', () => switcher?.classList.remove('open'));
}

/* ─── SCROLL REVEAL (SOLUTION OPACITÉ) ───────────────────── */
function initReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay * 120);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // Animation spécifique barres de compétences
  const skillBars = document.querySelectorAll('.sb-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.w + '%';
        skillObserver.unobserve(bar);
      }
    });
  });
  skillBars.forEach(bar => skillObserver.observe(bar));
}

/* ─── CANVAS PARTICULES ───────────────────────────────────── */
let animFrame;
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  const style = getComputedStyle(document.documentElement);
  const accentHex = style.getPropertyValue('--accent').trim() || '#63b3ed';

  const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  const rgb = hexToRgb(accentHex);
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.4 + 0.1
  }));

  if (animFrame) cancelAnimationFrame(animFrame);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${p.alpha})`;
      ctx.fill();
    });
    animFrame = requestAnimationFrame(draw);
  }
  draw();
}

/* ─── TYPED TEXT ─────────────────────────────────────────── */
function initTypewriter() {
  const roles = ['Analyste Financier', 'Gestionnaire du Risque de Change', 'Expert en Produits Dérivés', 'Passionné de Finance Moderne'];
  let roleIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.getElementById('typed-role');
  if (!typedEl) return;

  function type() {
    const current = roles[roleIdx];
    typedEl.textContent = deleting ? current.slice(0, charIdx--) : current.slice(0, charIdx++);
    
    let speed = deleting ? 40 : 80;
    if (!deleting && charIdx === current.length) { speed = 2000; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; speed = 500; }
    
    setTimeout(type, speed);
  }
  type();
}

/* ─── COMPTEURS STATS ────────────────────────────────────── */
function initCounters() {
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-num').forEach(num => {
          const target = +num.dataset.count;
          let current = 0;
          const inc = target / 50;
          const timer = setInterval(() => {
            current += inc;
            if (current >= target) { num.textContent = target; clearInterval(timer); }
            else { num.textContent = Math.floor(current); }
          }, 30);
        });
        statsObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);
}

/* ─── NAVIGATION & SMOOTH SCROLL ─────────────────────────── */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Navbar effect
    if (navbar) navbar.style.borderBottomColor = window.scrollY > 50 ? 'var(--border-accent)' : 'var(--border)';
    
    // Active Links
    let current = "";
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 150) current = s.getAttribute('id'); });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) link.classList.add('active');
    });
  }, { passive: true });

  // Mobile Toggle
  const toggle = document.getElementById('nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  }
}

/* ─── CURSEUR PERSONNALISÉ ───────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
    }, 80);
  });

  document.querySelectorAll('a, button, .tc-card, .skill-category').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
  });
}

/* ─── FORMULAIRE DE CONTACT ─────────────────────────────── */
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
  }, 1500);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
 
