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

  function loadStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  async function loadPhytotherapyModule() {
    try {
      loadStylesheet('phytotherapy.css');
      await loadScript('phytotherapy-data.js');
      await loadScript('phytotherapy.js');
    } catch (error) {
      console.error('No se pudo cargar el módulo de fitoterapia:', error);
    }
  }

  updateGreeting();
  loadPhytotherapyModule();
  if (homeNav) homeNav.addEventListener('click', updateGreeting);
})();