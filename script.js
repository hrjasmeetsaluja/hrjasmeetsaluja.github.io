const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: .5 });

document.querySelectorAll('.counter').forEach((el) => counterObserver.observe(el));

const tabs = document.querySelectorAll('.skill-tab');
const panels = document.querySelectorAll('.skill-panel');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    panels.forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel).classList.add('active');
  });
});

const menuButton = document.querySelector('.menu-button');
const topbar = document.querySelector('.topbar');
menuButton?.addEventListener('click', () => {
  const isOpen = topbar.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => {
  topbar.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'Menu';
}));

// Smooth in-page navigation for local previews and hosted pages.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    const topbarHeight = document.querySelector('.topbar')?.offsetHeight || 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - topbarHeight - 24;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });

    topbar?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = 'Menu';
  });
});

// Improve tab accessibility and keyboard interaction.
tabs.forEach((tab, index) => {
  const panelId = tab.dataset.panel;
  tab.setAttribute('aria-controls', panelId);
  tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
  tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');

  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      t.setAttribute('aria-selected', t.classList.contains('active') ? 'true' : 'false');
      t.setAttribute('tabindex', t.classList.contains('active') ? '0' : '-1');
    });
  });

  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;

    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  });
});
