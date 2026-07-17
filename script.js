const root = document.documentElement;
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const mobileLinks = document.querySelectorAll('.mobile-nav a');
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
const toast = document.querySelector('.toast');

const savedTheme = localStorage.getItem('bpr-theme');
if (savedTheme) root.dataset.theme = savedTheme;

function syncThemeLabel() {
  const isDark = root.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
}

syncThemeLabel();

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('bpr-theme', root.dataset.theme);
  syncThemeLabel();
});

function closeMenu() {
  body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}

menuToggle.addEventListener('click', () => {
  const isOpen = body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

filters.forEach(filter => {
  filter.addEventListener('click', () => {
    const category = filter.dataset.filter;
    filters.forEach(item => item.classList.toggle('active', item === filter));
    projects.forEach(project => {
      const categories = project.dataset.category.split(' ');
      project.classList.toggle('hidden', category !== 'all' && !categories.includes(category));
    });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px' });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
root.classList.add('motion-ready');

document.querySelector('.copy-email').addEventListener('click', async event => {
  const email = event.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    toast.textContent = 'Email copied';
  } catch {
    toast.textContent = email;
  }
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
});

document.querySelector('#year').textContent = new Date().getFullYear();

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', event => {
    document.querySelector('.spotlight').style.setProperty('--x', `${event.clientX}px`);
    document.querySelector('.spotlight').style.setProperty('--y', `${event.clientY}px`);
  });
}
