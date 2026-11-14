const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  navToggle.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    button.closest('.command').insertAdjacentElement('afterend', status);
    try {
      await navigator.clipboard.writeText(document.getElementById(button.dataset.copy).textContent);
      button.textContent = 'Copied';
      status.textContent = 'Command copied.';
      setTimeout(() => { button.textContent = 'Copy'; }, 2000);
    } catch {
      status.textContent = 'Copy was unavailable. Select the command and copy it manually.';
    }
  });
});
