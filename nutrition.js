(() => {
  const recommendationNav = document.querySelector('[data-view="recomendaciones"]');
  if (!recommendationNav) return;

  const STORAGE_RECORDS = 'cuerpoclaro_daily_records';

  function records() {
    try {
      return Object.values(JSON.parse(localStorage.getItem(STORAGE_RECORDS)) || {})
        .filter((item) => item && item.date)
        .sort((a,b) => a.date.localeCompare(b.date));
    } catch { return []; }
  }

  function avg(items, key) {
    const values = items.map((item) => item[key])
      .filter((value) => value !== null && value !== undefined && value !== '')
      .map(Number).filter(Number.isFinite);
    if (!values.length) return null;
    return values.reduce((sum,value) => sum + value, 0) / values.length;
  }

  function ageFromProfile() {
    try {
      const profile = JSON.parse(localStorage.getItem('cuerpoclaro_health_profile')) || {};
      const year = Number(profile.birthYear);
      if (!Number.isFinite(year)) return null;
      return new Date().getFullYear() - year;
    } catch { return null; }
  }

  function buildPersonalNotes(recent) {
    const notes = [];
    const digestion = avg(recent, 'digestion');
    const energy = avg(recent, 'energy');
    const sleep = avg(recent, 'sleep');
    const activity = avg(recent, 'activityMinutes');
    const bowelIssues = recent.filter((r) => ['estrenimiento','irregular'].includes(r.bowel)).length;
    const urineDark = recent.filter((r) => ['amarillo-oscuro','ambar'].includes(r.urine)).length;

    if (digestion !== null && digestion <= 5) {
      notes.push('Digestión baja: mantén comidas regulares y moderadas, come despacio y registra qué alimentos/horarios coinciden con síntomas antes de hacer restricciones.');
    }
    if (bowelIssues >= 2) {
      notes.push('Tránsito alterado repetido: prioriza fibra procedente de alimentos y aumenta cambios de forma gradual, acompañándolos de líquidos. Si hay dolor intenso, sangre o pérdida de peso no buscada, consulta.');
    }
    if (urineDark >= 2) {
      notes.push('Orina oscura/ámbar repetida: revisa hidratación y contexto (calor, ejercicio, fármacos, vitaminas). Si persiste pese a una hidratación adecuada o aparece con otros síntomas, consulta.');
    }
    if (energy !== null && energy <= 4.5) {
      notes.push('Energía baja: evita basar el día en azúcares rápidos; prioriza comidas completas con fuentes de proteína, vegetales, legumbres/cereales integrales y grasas saludables según tolerancia.');
    }
    if (sleep !== null && sleep <= 5) {
      notes.push('Sueño bajo: evita usar cafeína o bebidas energéticas como única estrategia contra el cansancio, especialmente por la tarde-noche.');
    }
    if (activity !== null) {
      const weekly = Math.round(activity * 7);
      if (weekly < 150) notes.push(`Actividad registrada aproximada: ${weekly} min/semana. La OMS recomienda en adultos 150–300 min/semana de actividad moderada, adaptada a capacidad y contraindicaciones.`);
    }
    return notes;
  }

  function injectNutrition() {
    const content = document.getElementById('recommendationsContent');
    const data = window.CuerpoClaroNutritionData;
    if (!content || !data) return;

    const old = content.querySelector('.nutrition-evidence-section');
    if (old) old.remove();

    const recent = records().slice(-14);
    const age = ageFromProfile();
    const adult = age === null || age >= 18;
    const personal = buildPersonalNotes(recent);
    const section = document.createElement('section');
    section.className = 'rec-section nutrition-evidence-section';

    const targetHtml = adult ? `
      <div class="nutrition-target-grid">
        <article><strong>Frutas y verduras</strong><span>OMS: ≥400 g/día (mayores de 10 años). AESAN: ≥3 raciones/día de hortalizas + 2–3 de fruta.</span></article>
        <article><strong>Fibra</strong><span>OMS: ≥25 g/día de fibra natural en mayores de 10 años, preferentemente desde alimentos.</span></article>
        <article><strong>Sal</strong><span>OMS: en adultos, &lt;5 g/día de sal (&lt;2 g/día de sodio).</span></article>
        <article><strong>Azúcares libres</strong><span>OMS: &lt;10% de la energía diaria; reducir al 5% puede aportar beneficio adicional.</span></article>
        <article><strong>Patrón español</strong><span>AESAN: legumbres ≥4 veces/semana, integrales, frutos secos sin sal, pescado, aceite de oliva y agua como bebida principal.</span></article>
        <article><strong>Actividad física</strong><span>OMS: 150–300 min/semana moderada o equivalente + fuerza ≥2 días/semana.</span></article>
      </div>` : '<div class="profile-risk"><strong>Edad pediátrica</strong>Esta versión no aplica objetivos nutricionales de adulto. Se necesita orientación específica por edad y etapa de desarrollo.</div>';

    const personalHtml = personal.length
      ? `<div class="nutrition-personal"><h4>Lectura orientativa según tus registros</h4><ul>${personal.map((item) => `<li>${item}</li>`).join('')}</ul></div>`
      : '<div class="nutrition-personal"><h4>Lectura orientativa</h4><p>No hay suficientes señales para añadir recomendaciones específicas; se mantiene el patrón general saludable.</p></div>';

    const sources = data.sources.map((source) => `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label}</a>`).join(' · ');

    section.innerHTML = `
      <h3>🍽️ Nutrición basada en fuentes oficiales</h3>
      <div class="recommendations-notice"><strong>Alcance:</strong> orientación general para hábitos. No prescribe dietas terapéuticas ni sustituye una valoración nutricional o médica individual.</div>
      ${targetHtml}
      ${personalHtml}
      <div class="nutrition-sources"><strong>Fuentes:</strong> ${sources}</div>`;

    content.appendChild(section);
  }

  recommendationNav.addEventListener('click', injectNutrition);
})();