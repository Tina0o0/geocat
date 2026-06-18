function smoothScrollTo(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('[data-scroll]').forEach(button => {
  button.addEventListener('click', () => smoothScrollTo(button.dataset.scroll));
});

const quickTags = document.querySelectorAll('.quick-tag');
const panels = document.querySelectorAll('.info-panel');
const pins = document.querySelectorAll('.map-pin');

function activatePanel(name) {
  quickTags.forEach(tag => {
    const active = tag.dataset.panel === name;
    tag.classList.toggle('active', active);
    tag.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  panels.forEach(panel => {
    panel.classList.toggle('active', panel.dataset.content === name);
  });
}

quickTags.forEach(tag => {
  tag.addEventListener('click', () => activatePanel(tag.dataset.panel));
});

pins.forEach(pin => {
  pin.addEventListener('click', () => activatePanel(pin.dataset.panel));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.querySelectorAll('[data-count]').forEach(item => {
      if (item.dataset.done === 'true') return;
      item.dataset.done = 'true';

      const target = Number(item.dataset.count);
      const suffix = item.parentElement.textContent.includes('%') ? '%' : item.parentElement.textContent.includes('millones') ? 'M+' : '+';
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 30));

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        item.textContent = current + suffix;
      }, 30);
    });
  });
}, { threshold: 0.35 });

const statsSection = document.querySelector('#datos');
if (statsSection) observer.observe(statsSection);

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { threshold: 0.45 });

sections.forEach(section => navObserver.observe(section));

const root = document.documentElement;
const themeButton = document.querySelector('[data-theme-toggle]');
let currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
root.setAttribute('data-theme', currentTheme);

if (themeButton) {
  themeButton.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', currentTheme);
    themeButton.querySelector('.theme-icon').textContent = currentTheme === 'dark' ? '☀' : '◐';
  });
  themeButton.querySelector('.theme-icon').textContent = currentTheme === 'dark' ? '☀' : '◐';
}