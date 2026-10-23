// Site settings: update these with your own details
const SITE_CONFIG = {
  email: 'your.email@example.com', // TODO: your public email address
  formspreeId: '', // Optional: Formspree form ID (e.g. 'xyzabcd'). Empty = open the visitor's email app instead
  cvFile: 'Danelle_Kruger_CV_Resume.pdf',
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

// ---------- Helpers ----------
function icon(name) {
  return window.feather && feather.icons[name] ? feather.icons[name].toSvg({ 'aria-hidden': 'true' }) : '';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

function scrollBehavior() {
  return reducedMotion.matches ? 'auto' : 'smooth';
}

// Moves focus to a section (for keyboard and screen reader users) and scrolls it into view
function goToSection(target) {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  history.replaceState(null, '', `#${el.id}`);
}

let toastTimer;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2500);
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(SITE_CONFIG.email);
    showToast(`Copied ${SITE_CONFIG.email}`);
  } catch {
    showToast(`My email: ${SITE_CONFIG.email}`);
  }
}

function downloadCv() {
  const link = document.createElement('a');
  link.href = SITE_CONFIG.cvFile;
  link.download = SITE_CONFIG.cvFile;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Keeps Tab / Shift+Tab inside an open dialog
function trapFocus(dialog) {
  dialog.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])')]
      .filter((el) => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

// ---------- Particle System ----------
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = window.innerWidth < 768 ? 30 : 60;
    this.mouse = { x: 0, y: 0, radius: 100 };
    this.running = false;

    this.refreshColors();
    this.init();
    this.setupEventListeners();
    this.updateMotion();
  }

  refreshColors() {
    const styles = getComputedStyle(document.documentElement);
    this.dotRgb = styles.getPropertyValue('--particle-rgb').trim() || '170, 180, 255';
    this.lineRgb = styles.getPropertyValue('--particle-line-rgb').trim() || '102, 126, 234';
    if (!this.running) this.draw();
  }

  init() {
    this.resize();
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Animate only when motion is welcome and the tab is visible; otherwise draw one still frame
  updateMotion() {
    const shouldRun = !reducedMotion.matches && !document.hidden;
    if (shouldRun && !this.running) {
      this.running = true;
      this.animate();
    } else if (!shouldRun) {
      this.running = false;
      this.draw();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${this.dotRgb}, ${particle.alpha})`;
      this.ctx.fill();
      this.drawConnections(particle);
    });
  }

  animate() {
    if (!this.running) return;
    this.particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Bounce off walls
      if (particle.x > this.canvas.width) particle.speedX = -Math.abs(particle.speedX);
      if (particle.x < 0) particle.speedX = Math.abs(particle.speedX);
      if (particle.y > this.canvas.height) particle.speedY = -Math.abs(particle.speedY);
      if (particle.y < 0) particle.speedY = Math.abs(particle.speedY);
    });
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  drawConnections(particle) {
    this.particles.forEach((otherParticle) => {
      const dx = particle.x - otherParticle.x;
      const dy = particle.y - otherParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(${this.lineRgb}, ${0.1 * (1 - distance / 100)})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(otherParticle.x, otherParticle.y);
        this.ctx.stroke();
      }
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
      if (!this.running) this.draw();
    });
    document.addEventListener('visibilitychange', () => this.updateMotion());
    reducedMotion.addEventListener('change', () => this.updateMotion());

    window.addEventListener('mousemove', (e) => {
      if (!this.running) return;
      this.mouse.x = e.x;
      this.mouse.y = e.y;

      this.particles.forEach((particle) => {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          particle.x -= dx * force * 0.05;
          particle.y -= dy * force * 0.05;
        }
      });
    });
  }
}

// ---------- Theme ----------
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  let particles = null;

  const savedTheme = () => {
    try {
      return localStorage.getItem('theme');
    } catch {
      return null;
    }
  };

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    toggle?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    particles?.refreshColors();
  };

  const toggleTheme = () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', next);
    } catch {}
    apply(next);
  };

  apply(root.getAttribute('data-theme') || (prefersLight.matches ? 'light' : 'dark'));
  toggle?.addEventListener('click', toggleTheme);

  // Follow live system changes until the visitor picks a theme themselves
  prefersLight.addEventListener('change', (e) => {
    if (!savedTheme()) apply(e.matches ? 'light' : 'dark');
  });

  return {
    toggle: toggleTheme,
    current: () => root.getAttribute('data-theme'),
    setParticles: (system) => (particles = system),
  };
}

// ---------- Navigation ----------
function initNav() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = [...document.querySelectorAll('.nav-link')];

  const setOpen = (open) => {
    navMenu.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  navToggle?.addEventListener('click', () => setOpen(!navMenu.classList.contains('active')));
  navLinks.forEach((link) => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      setOpen(false);
      navToggle.focus();
    }
  });

  window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });

  // Highlight the link for the section in the middle of the viewport
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isActive);
          if (isActive) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
}

// ---------- Scroll reveal ----------
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );
  items.forEach((el) => observer.observe(el));
}

// ---------- Hero stats ----------
function initStats(certCount) {
  const sources = {
    certificates: certCount,
    'case-studies': document.querySelectorAll('.case-study:not([data-placeholder])').length,
  };

  document.querySelectorAll('.stat-number').forEach((counter) => {
    const source = counter.dataset.countSource;
    const target = source ? sources[source] ?? 0 : Number(counter.dataset.count || counter.textContent);
    counter.textContent = target;
    if (reducedMotion.matches || target < 2) return;

    // Count up from 0 once visible
    counter.textContent = '0';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / 1200, 1);
          counter.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    observer.observe(counter);
  });
}

// ---------- Project filter ----------
function initProjectFilter() {
  const buttons = document.querySelectorAll('#projects .filter-btn');
  const cards = document.querySelectorAll('.case-study');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((btn) => {
        btn.classList.toggle('active', btn === button);
        btn.setAttribute('aria-pressed', String(btn === button));
      });
      const filter = button.dataset.filter;
      cards.forEach((card) => {
        card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter);
        if (!card.hidden) card.classList.add('is-visible');
      });
    });
  });
}

// ---------- Before / after sliders ----------
function initBeforeAfter() {
  document.querySelectorAll('.before-after').forEach((figure) => {
    const range = figure.querySelector('.ba-range');
    const update = () => {
      figure.style.setProperty('--pos', `${range.value}%`);
      range.setAttribute('aria-valuetext', `${range.value}% before, ${100 - range.value}% after`);
    };
    range.addEventListener('input', update);
    update();
  });
}

// ---------- Certificates gallery + viewer ----------
function initCertificates() {
  const certs = (window.CERTIFICATES || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const byId = new Map(certs.map((c) => [c.id, c]));
  const grid = document.getElementById('certGrid');
  const filterBar = document.getElementById('certFilter');
  const status = document.getElementById('certStatus');
  const modal = document.getElementById('certModal');

  const pdfPath = (c) => `certificates/${c.file}`;
  const thumbPath = (c) => `certificates/thumbs/${c.file.replace(/\.pdf$/i, '.webp')}`;
  const formatDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

  // Filter chips: generated from the categories in the data file
  const categories = [...new Set(certs.map((c) => c.category))].sort();
  const filters = [['All', certs.length], ...categories.map((cat) => [cat, certs.filter((c) => c.category === cat).length])];
  filterBar.innerHTML = filters
    .map(([label, count], i) => `<button type="button" class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${escapeHtml(label)}" aria-pressed="${i === 0}">${escapeHtml(label)}<span class="filter-count">${count}</span></button>`)
    .join('');

  grid.innerHTML = certs
    .map(
      (c) => `
      <li data-category="${escapeHtml(c.category)}">
        <article class="cert-card">
          <div class="cert-thumb">
            <img src="${thumbPath(c)}" alt="Certificate of completion for ${escapeHtml(c.title)}" width="800" height="595" loading="lazy" decoding="async">
          </div>
          <div class="cert-body">
            <span class="cert-category">${escapeHtml(c.category)}</span>
            <h3 class="cert-title"><button type="button" class="cert-open" data-cert="${escapeHtml(c.id)}">${escapeHtml(c.title)}</button></h3>
            <p class="cert-meta">${escapeHtml(c.issuer)} · <time datetime="${c.date}">${formatDate(c.date)}</time>${c.hours ? ` · ${c.hours} h` : ''}</p>
          </div>
        </article>
      </li>`,
    )
    .join('');

  filterBar.addEventListener('click', (e) => {
    const button = e.target.closest('.filter-btn');
    if (!button) return;
    const filter = button.dataset.filter;
    filterBar.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.classList.toggle('active', btn === button);
      btn.setAttribute('aria-pressed', String(btn === button));
    });
    let shown = 0;
    grid.querySelectorAll('li').forEach((item) => {
      item.hidden = filter !== 'All' && item.dataset.category !== filter;
      if (!item.hidden) shown++;
    });
    status.textContent = `Showing ${shown} ${filter === 'All' ? '' : `${filter} `}certificate${shown === 1 ? '' : 's'}`;
  });

  // Viewer
  const title = document.getElementById('certModalTitle');
  const meta = document.getElementById('certModalMeta');
  const body = document.getElementById('certModalBody');
  const download = document.getElementById('certDownload');
  const openLink = document.getElementById('certOpen');
  const verify = document.getElementById('certVerify');
  let returnFocus = null;

  // Phones and browsers without a built-in PDF viewer get the image preview instead
  const canEmbedPdf = () => navigator.pdfViewerEnabled !== false && !window.matchMedia('(max-width: 600px), (pointer: coarse)').matches;

  function open(id) {
    const cert = byId.get(id);
    if (!cert) return;
    returnFocus = document.activeElement;

    title.textContent = cert.title;
    meta.textContent = `${cert.issuer} · ${formatDate(cert.date)} · ${cert.category}`;
    body.innerHTML = canEmbedPdf()
      ? `<iframe src="${pdfPath(cert)}#toolbar=0&navpanes=0&view=FitH" title="${escapeHtml(cert.title)} (PDF)" tabindex="-1"></iframe>`
      : `<img src="${thumbPath(cert)}" alt="Certificate of completion for ${escapeHtml(cert.title)}" width="800" height="595">`;
    download.href = pdfPath(cert);
    download.setAttribute('download', cert.file);
    openLink.href = pdfPath(cert);
    verify.hidden = !cert.credentialId;
    if (cert.credentialId) {
      verify.href = `https://ude.my/${cert.credentialId}`;
      verify.textContent = `Verify on ${cert.issuer}`;
    }

    modal.showModal();
    modal.querySelector('[data-close]').focus();
  }

  modal.querySelectorAll('[data-close]').forEach((btn) => btn.addEventListener('click', () => modal.close()));
  // Clicking the backdrop (the dialog element itself) closes it
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
  modal.addEventListener('close', () => {
    body.innerHTML = '';
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
  });
  trapFocus(modal);

  // The browser's PDF viewer swallows key presses (including Esc), so if a click
  // moves focus into it, hand focus back to the dialog. Scrolling still works.
  window.addEventListener('blur', () => {
    if (modal.open && document.activeElement?.tagName === 'IFRAME') {
      setTimeout(() => modal.querySelector('[data-close]').focus(), 0);
    }
  });

  // Cards and skill links share the same opener
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.cert-open, .cert-link');
    if (trigger) open(trigger.dataset.cert);
  });

  return { certs, open, modal };
}

// ---------- Command palette (Ctrl/Cmd + K) ----------
function initPalette({ certApi, theme }) {
  const palette = document.getElementById('palette');
  const input = document.getElementById('paletteInput');
  const list = document.getElementById('paletteList');
  const trigger = document.getElementById('paletteTrigger');
  const isMac = /Mac|iPhone|iPad/i.test(navigator.userAgentData?.platform || navigator.platform || navigator.userAgent);

  document.querySelectorAll('[data-shortcut-hint]').forEach((el) => (el.textContent = isMac ? '⌘ K' : 'Ctrl K'));
  trigger.setAttribute('aria-keyshortcuts', isMac ? 'Meta+K' : 'Control+K');

  const sections = [
    ['home', 'Home', 'top start hero'],
    ['about', 'About me', 'bio story'],
    ['skills', 'Skills', 'stack tech frontend backend data design'],
    ['projects', 'Work', 'projects case studies portfolio'],
    ['process', 'Design process', 'research wireframes ui build'],
    ['certificates', 'Certificates', 'courses udemy learning'],
    ['contact', 'Contact', 'email message hire'],
  ];

  const buildCommands = () => [
    ...sections.map(([id, label, keywords]) => ({
      group: 'Navigate', icon: 'arrow-right', label, keywords, run: () => goToSection(id),
    })),
    ...[...document.querySelectorAll('.case-study:not([data-placeholder])')].map((article) => ({
      group: 'Case studies',
      icon: 'folder',
      label: article.querySelector('.case-title').textContent.trim(),
      keywords: 'project case study',
      run: () => {
        article.querySelector('.case-details')?.setAttribute('open', '');
        goToSection(article);
      },
    })),
    { group: 'Actions', icon: 'download', label: 'Download my CV', keywords: 'resume pdf', run: downloadCv },
    {
      group: 'Actions',
      icon: theme.current() === 'dark' ? 'sun' : 'moon',
      label: theme.current() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      keywords: 'theme dark light mode toggle',
      run: theme.toggle,
    },
    { group: 'Actions', icon: 'copy', label: 'Copy email address', keywords: 'contact mail', run: copyEmail },
    ...certApi.certs.map((c) => ({
      group: 'Certificates',
      icon: 'award',
      label: c.title,
      meta: c.category,
      keywords: `certificate ${c.category} ${c.issuer}`,
      run: () => certApi.open(c.id),
    })),
  ];

  let commands = [];
  let visible = [];
  let active = 0;

  function render() {
    const terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    visible = commands.filter((cmd) => {
      const haystack = `${cmd.label} ${cmd.keywords || ''} ${cmd.group}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
    active = Math.min(active, Math.max(visible.length - 1, 0));

    if (!visible.length) {
      list.innerHTML = `<li class="palette-empty" role="presentation">No results for “${escapeHtml(input.value)}”</li>`;
      input.removeAttribute('aria-activedescendant');
      return;
    }

    let lastGroup = '';
    list.innerHTML = visible
      .map((cmd, i) => {
        const heading = cmd.group !== lastGroup ? `<li class="palette-group" role="presentation">${escapeHtml(cmd.group)}</li>` : '';
        lastGroup = cmd.group;
        return `${heading}<li class="palette-option" role="option" id="palette-opt-${i}" data-index="${i}" aria-selected="${i === active}">
          ${icon(cmd.icon)}<span class="palette-label">${escapeHtml(cmd.label)}</span>${cmd.meta ? `<span class="palette-meta">${escapeHtml(cmd.meta)}</span>` : ''}
        </li>`;
      })
      .join('');
    setActive(active);
  }

  function setActive(index) {
    active = index;
    list.querySelectorAll('.palette-option').forEach((el) => el.setAttribute('aria-selected', String(Number(el.dataset.index) === index)));
    const current = document.getElementById(`palette-opt-${index}`);
    if (current) {
      input.setAttribute('aria-activedescendant', current.id);
      current.scrollIntoView({ block: 'nearest' });
    }
  }

  function run(index) {
    const cmd = visible[index];
    if (!cmd) return;
    palette.close();
    cmd.run();
  }

  function open() {
    if (certApi.modal.open) certApi.modal.close();
    commands = buildCommands();
    input.value = '';
    active = 0;
    render();
    palette.showModal();
    input.focus();
  }

  input.addEventListener('input', () => {
    active = 0;
    render();
  });

  input.addEventListener('keydown', (e) => {
    if (!visible.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((active + 1) % visible.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((active - 1 + visible.length) % visible.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(visible.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(active);
    }
  });

  list.addEventListener('mousemove', (e) => {
    const option = e.target.closest('.palette-option');
    if (option && Number(option.dataset.index) !== active) setActive(Number(option.dataset.index));
  });
  list.addEventListener('click', (e) => {
    const option = e.target.closest('.palette-option');
    if (option) run(Number(option.dataset.index));
  });
  palette.addEventListener('click', (e) => {
    if (e.target === palette) palette.close();
  });
  trapFocus(palette);

  trigger.addEventListener('click', open);
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette.open) palette.close();
      else open();
    }
  });
}

// ---------- Contact ----------
function initContact() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const emailLink = document.getElementById('emailLink');

  emailLink.href = `mailto:${SITE_CONFIG.email}`;
  emailLink.textContent = SITE_CONFIG.email;
  document.getElementById('copyEmail').addEventListener('click', copyEmail);

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle('is-error', isError);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = [...form.elements].filter((el) => el.willValidate);
    fields.forEach((el) => el.setAttribute('aria-invalid', String(!el.checkValidity())));
    const firstInvalid = fields.find((el) => !el.checkValidity());
    if (firstInvalid) {
      setStatus('Please fill in every field, with a valid email address.', true);
      firstInvalid.focus();
      return;
    }

    const data = new FormData(form);

    if (SITE_CONFIG.formspreeId) {
      setStatus('Sending…');
      try {
        const response = await fetch(`https://formspree.io/f/${SITE_CONFIG.formspreeId}`, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error(response.statusText);
        form.reset();
        setStatus('Thanks! Your message has been sent. I’ll get back to you soon.');
      } catch {
        setStatus(`Something went wrong. Please email me directly at ${SITE_CONFIG.email}.`, true);
      }
      return;
    }

    // No form service configured: hand the message to the visitor's email app
    const body = `${data.get('message')}\n\n${data.get('name')} (${data.get('email')})`;
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(data.get('subject'))}&body=${encodeURIComponent(body)}`;
    setStatus(`Your email app should open with the message ready to send. If nothing happens, email me at ${SITE_CONFIG.email}.`);
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  if (typeof feather !== 'undefined') feather.replace({ 'aria-hidden': 'true' });

  const theme = initTheme();
  const certApi = initCertificates();

  initNav();
  initStats(certApi.certs.length);
  initProjectFilter();
  initBeforeAfter();
  initPalette({ certApi, theme });
  initContact();
  initReveal();

  document.getElementById('year').textContent = new Date().getFullYear();

  // The particle background is decorative: skip it on small screens (where it's barely
  // visible and costs battery) and start it only once the page has finished loading
  window.addEventListener('load', () => {
    if (window.matchMedia('(max-width: 767px)').matches) return;
    const start = () => theme.setParticles(new ParticleSystem());
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2000 });
    else setTimeout(start, 200);
  });
});
