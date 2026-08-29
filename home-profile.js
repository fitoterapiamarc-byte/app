(() => {
  const homeNav = document.querySelector('[data-view="inicio"]');
  const heading = document.querySelector('.welcome-card h2');
  if (!heading) return;

  function updateGreeting() {
    try {
      const profile = JSON.parse(localStorage.getItem('cuerpoclaro_health_profile')) || {};
      const name = String(profile.name || '').trim();
      heading.textContent = name ? `¡Hola ${name}! 👋` : '¡Hola! 👋';
    } catch {
      heading.textContent = '¡Hola! 👋';
    }
  }

  updateGreeting();
  if (homeNav) homeNav.addEventListener('click', updateGreeting);
})();