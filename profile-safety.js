(() => {
  const recommendationNav = document.querySelector('[data-view="recomendaciones"]');
  if (!recommendationNav) return;

  function injectSafetyStatus() {
    const api = window.CuerpoClaroProfile;
    const card = document.querySelector('.fitotherapy-card');
    if (!api || !card) return;

    const profile = api.getProfile();
    const completeness = api.getCompleteness(profile);
    const risks = api.getRiskFlags(profile);
    const previous = card.querySelector('.fitotherapy-safety-status');
    if (previous) previous.remove();

    const box = document.createElement('div');
    box.className = `fitotherapy-safety-status ${completeness.complete ? 'is-complete' : 'is-incomplete'}`;

    if (!completeness.complete) {
      box.innerHTML = `<strong>Perfil de seguridad incompleto</strong><p>Antes de mostrar plantas concretas será necesario completar: ${completeness.missing.join(', ')}.</p>`;
    } else if (risks.length) {
      box.innerHTML = `<strong>Perfil completado con precauciones</strong><p>Hay factores que requieren una revisión más estricta de interacciones y contraindicaciones: ${risks.join(', ')}. La app no mostrará una planta como opción segura hasta que exista un filtro específico para estos factores.</p>`;
    } else {
      box.innerHTML = '<strong>Perfil básico de seguridad completado</strong><p>Ya se puede pasar a la siguiente fase: crear la base de plantas y comprobar interacciones, contraindicaciones y adecuación antes de mostrar opciones.</p>';
    }

    card.prepend(box);
  }

  recommendationNav.addEventListener('click', injectSafetyStatus);
})();