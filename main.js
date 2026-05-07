/* ════════════════════════════════════════════════════
   TAHA EZZAAFRANI – main.js  (version corrigée)
════════════════════════════════════════════════════ */

/* ── everything runs after DOM is fully loaded ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────────────
     1. PAGE FADE-IN
  ──────────────────────────────────────────────── */
  document.body.classList.add('loaded');

  /* ────────────────────────────────────────────────
     2. THEME SYSTEM
  ──────────────────────────────────────────────── */
  const THEME_ICONS = {
    dark:  { show: 'ti-dark',  hide: ['ti-light','ti-ocean','ti-gold'] },
    light: { show: 'ti-light', hide: ['ti-dark','ti-ocean','ti-gold']  },
    ocean: { show: 'ti-ocean', hide: ['ti-dark','ti-light','ti-gold']  },
    gold:  { show: 'ti-gold',  hide: ['ti-dark','ti-light','ti-ocean'] },
  };

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('te-theme', t);
    // swap icon
    const cfg = THEME_ICONS[t];
    if (cfg) {
      document.getElementById(cfg.show).style.display = '';
      cfg.hide.forEach(id => { document.getElementById(id).style.display = 'none'; });
    }
    setTimeout(initCanvas, 60); // re-colour particles
  }

  const savedTheme = localStorage.getItem('te-theme') || 'dark';
  applyTheme(savedTheme);

  const themeSw = document.getElementById('theme-sw');
  themeSw.addEventListener('click', () => themeSw.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!themeSw.contains(e.target)) themeSw.classList.remove('open');
  });
  document.querySelectorAll('.theme-opt').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      applyTheme(btn.dataset.theme);
      themeSw.classList.remove('open');
    });
  });

  /* ────────────────────────────────────────────────
     3. CANVAS PARTICLE NETWORK
  ──────────────────────────────────────────────── */
  let raf;
  function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    if (raf) cancelAnimationFrame(raf);

    function getAccentRGB() {
      const hex = getComputedStyle(document.documentElement)
                    .getPropertyValue('--acc').trim().replace('#','');
      const full = hex.length === 3
        ? hex.split('').map(c => c+c).join('')
        : hex;
      const n = parseInt(full, 16);
      return [(n>>16)&255, (n>>8)&255, n&255];
    }

    const N = Math.min(65, Math.floor(canvas.width / 18));
    const pts = Array.from({length: N}, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r:  Math.random() * 1.5 + .4,
      a:  Math.random() * .45 + .15,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rgb = getAccentRGB();
      const [r, g, b] = rgb;

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0)              p.x = canvas.width;
        if (p.x > canvas.width)   p.x = 0;
        if (p.y < 0)              p.y = canvas.height;
        if (p.y > canvas.height)  p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`;
        ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 118) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d/118) * .07})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
  }
  initCanvas();
  window.addEventListener('resize', () => {
    const c = document.getElementById('bg-canvas');
    if (c) { c.width = window.innerWidth; c.height = window.innerHeight; }
  });

  /* ────────────────────────────────────────────────
     4. CUSTOM CURSOR
  ──────────────────────────────────────────────── */
  const cur   = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (cur && trail) {
    document.addEventListener('mousemove', e => {
      cur.style.left   = e.clientX + 'px';
      cur.style.top    = e.clientY + 'px';
      setTimeout(() => {
        trail.style.left = e.clientX + 'px';
        trail.style.top  = e.clientY + 'px';
      }, 80);
    });
    document.querySelectorAll('a, button, .skill-card, .cert-card, .tl-card, .int-card').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('big'));
      el.addEventListener('mouseleave', () => cur.classList.remove('big'));
    });
  }

  /* ────────────────────────────────────────────────
     5. TYPED TEXT
  ──────────────────────────────────────────────── */
  const roles = [
    'Analyste Financier',
    'Gestionnaire du Risque de Change',
    'Expert en Produits Dérivés',
    'Passionné de Finance Moderne',
  ];
  const typedEl = document.getElementById('typed-role');
  if (typedEl) {
    let ri = 0, ci = 0, deleting = false;
    function tick() {
      const word = roles[ri];
      if (!deleting) {
        typedEl.textContent = word.slice(0, ci + 1);
        ci++;
        if (ci === word.length) { deleting = true; setTimeout(tick, 1500); return; }
        setTimeout(tick, 65);
      } else {
        typedEl.textContent = word.slice(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 360); return; }
        setTimeout(tick, 36);
      }
    }
    setTimeout(tick, 900);
  }

  /* ────────────────────────────────────────────────
     6. SCROLL REVEAL  ← THE MAIN FIX
        Elements start opacity:0 in CSS.
        We add class .visible which sets opacity:1.
        We run once on load AND on every scroll.
  ──────────────────────────────────────────────── */
  function runReveal() {
    const wh = window.innerHeight;
    document.querySelectorAll('.rv, .rv-left, .rv-right').forEach(el => {
      const { top } = el.getBoundingClientRect();
      if (top < wh - 60) el.classList.add('visible');
    });
    // skill bars
    document.querySelectorAll('.bar-fill').forEach(bar => {
      const { top } = bar.getBoundingClientRect();
      if (top < wh && !bar.dataset.animated) {
        bar.dataset.animated = '1';
        bar.style.width = bar.dataset.w + '%';
      }
    });
  }

  // Run immediately (catches above-fold elements)
  runReveal();
  // Also run after fonts/images settle
  setTimeout(runReveal, 400);
  window.addEventListener('scroll', runReveal, { passive: true });

  /* ────────────────────────────────────────────────
     7. COUNTER ANIMATION
  ──────────────────────────────────────────────── */
  let counted = false;
  function countUp() {
    if (counted) return;
    counted = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      let v = 0;
      const iv = setInterval(() => {
        v += target / 40;
        if (v >= target) { el.textContent = target; clearInterval(iv); return; }
        el.textContent = Math.floor(v);
      }, 30);
    });
  }
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { countUp(); ob.disconnect(); } }, { threshold: .4 });
    ob.observe(statsEl);
  }

  /* ────────────────────────────────────────────────
     8. ACTIVE NAV ON SCROLL
  ──────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  function updateNav() {
    const y = window.scrollY + 130;
    sections.forEach(sec => {
      if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (a) a.classList.add('active');
      }
    });
    // navbar border on scroll
    const nav = document.getElementById('navbar');
    if (nav) nav.style.borderBottomColor = window.scrollY > 50 ? 'var(--border-a)' : 'var(--border)';
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ────────────────────────────────────────────────
     9. MOBILE HAMBURGER
  ──────────────────────────────────────────────── */
  const burger = document.getElementById('hamburger');
  if (burger) {
    burger.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      burger.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        burger.classList.remove('active');
      });
    });
  }

  /* ────────────────────────────────────────────────
     10. SMOOTH SCROLL for anchor links
  ──────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ────────────────────────────────────────────────
     11. BACK TO TOP
  ──────────────────────────────────────────────── */
  document.getElementById('back-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ────────────────────────────────────────────────
     12. FLOAT CARDS PARALLAX
  ──────────────────────────────────────────────── */
  document.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth  - .5) * 10;
    const my = (e.clientY / window.innerHeight - .5) * 10;
    document.querySelectorAll('.float-card').forEach((card, i) => {
      const sign = i % 2 === 0 ? 1 : -1;
      card.style.transform = `translateY(${Math.sin(Date.now() / 1000 + i) * 7}px) translate(${mx * sign * .3}px, ${my * sign * .3}px)`;
    });
  });

  /* ────────────────────────────────────────────────
     13. SKILL BAR BRIGHTNESS ON HOVER
  ──────────────────────────────────────────────── */
  document.querySelectorAll('.bar-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const fill = item.querySelector('.bar-fill');
      if (fill) fill.style.filter = 'brightness(1.3)';
    });
    item.addEventListener('mouseleave', () => {
      const fill = item.querySelector('.bar-fill');
      if (fill) fill.style.filter = '';
    });
  });

  /* ────────────────────────────────────────────────
     14. CONTACT FORM
  ──────────────────────────────────────────────── */
  const fBtn = document.getElementById('f-btn');
  if (fBtn) {
    fBtn.addEventListener('click', () => {
      const name  = document.getElementById('f-name');
      const email = document.getElementById('f-email');
      const msg   = document.getElementById('f-msg');
      const note  = document.getElementById('f-note');
      let ok = true;

      [name, email, msg].forEach(inp => {
        if (!inp.value.trim()) { inp.style.borderColor = 'rgba(255,80,80,.65)'; ok = false; }
        else inp.style.borderColor = '';
      });

      if (!ok) { note.textContent = '⚠ Veuillez remplir tous les champs.'; return; }

      fBtn.textContent = 'Envoi…';
      fBtn.disabled    = true;

      setTimeout(() => {
        note.textContent   = '✓ Message envoyé avec succès !';
        fBtn.innerHTML     = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Envoyer le message`;
        fBtn.disabled      = false;
        [name, email, msg].forEach(inp => inp.value = '');
        setTimeout(() => note.textContent = '', 4000);
      }, 1200);
    });
  }

}); // end DOMContentLoaded
