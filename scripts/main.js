/**
 * Shared interaction entry point.
 * Keep feature-specific code in separate files inside this folder as the site grows.
 */
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

function closeMenu() {
  nav?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  const icon = menuButton?.querySelector('span');
  if (icon) icon.textContent = '+';
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  const icon = menuButton.querySelector('span');
  if (icon) icon.textContent = isOpen ? '+' : '−';
  nav?.classList.toggle('open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const currentYear = document.querySelector('#year');
if (currentYear) currentYear.textContent = new Date().getFullYear();
