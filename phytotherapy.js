(() => {
  const recommendationNav = document.querySelector('[data-view="recomendaciones"]');
  if (!recommendationNav) return;

  const STORAGE_RECORDS = 'cuerpoclaro_daily_records';

  function getRecords() {
    try {
      return Object.values(JSON.parse(localStorage.getItem(STORAGE_RECORDS)) || {})
        .filter((record) => record && record.date)
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch {
      return [];
    }
  }

  function average(records, key) {
    const values = records
      .map((record) => record[key])
      .filter((value) => value !== null && value !== undefined && value !== '')
      .map(Number)
      .filter(Number.isFinite);
    if (!values.length) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function deriveAreas(records) {
    const recent = records.slice(-14);
    const areas = new Set();
    const sleep = average(recent, 'sleep');
    const stress = average(recent, 'stress');
    const digestion = average(recent, 'digestion');
    const constipationDays = recent.filter((record) => record.bowel === 'estrenimiento').length;

    if (sleep !== null && sleep <= 5) areas.add('sleep');
    if (stress !== null && stress >= 6.5) areas.add('stress');
    if (digestion !== null && digestion <= 5) areas.add('digestion');
    if (constipationDays >= 2) areas.add('constipation');

    const notes = recent.map((record) => String(record.notes || '').toLowerCase()).join(' ');
    if (/\bn[áa]usea[s]?\b/.test(notes)) areas.add('nausea');

    return [...areas];
  }

  function hasMedication(profile) {
    const value = String(profile.medications || '').trim().toLowerCase();
    if (!value) return false;
    const noneValues = ['ninguna', 'ninguno', 'no', 'ninguna medicación', 'ninguna medicacion', 'no tomo medicación', 'no tomo medicacion'];
    return !noneValues.includes(value);
  }

  function safetyClass(status) {
    if (status === 'none-described') return 'safe';
    if (status === 'monitor') return 'monitor';
    return '';
  }

  function safetyLabel(status) {
    if (status === 'none-described') return 'Interacciones no descritas en EMA/ESCOP para esta droga vegetal';
    if (status === 'monitor') return 'Requiere vigilancia / separación o revisión profesional';
    if (status === 'review') return 'Requiere revisión en determinadas combinaciones';
    if (status === 'evidence-limited') return 'No presentar riesgos teóricos como interacción demostrada';
    return 'Revisión de seguridad necesaria';
  }

  function renderPlantCard(plant) {
    return `
      <article class="phyto-card">
        <div>
          <h4>${plant.commonName}</h4>
          <div class="phyto-scientific">${plant.scientificName}</div>
        </div>
        <div class="phyto-drug"><strong>Parte usada:</strong> ${plant.drug}</div>
        <span class="phyto-evidence">${plant.evidenceLabel}</span>
        <p>${plant.evidenceNote}</p>
        <div class="phyto-safety ${safetyClass(plant.interactionStatus)}">
          <strong>${safetyLabel(plant.interactionStatus)}</strong><br>
          ${plant.interactionNote}
        </div>
        <div class="phyto-sources">
          <a href="${plant.sourceVademecum}" target="_blank" rel="noopener noreferrer">Vademécum</a>
          <a href="${plant.sourceEMA}" target="_blank" rel="noopener noreferrer">EMA</a>
          <a href="${plant.sourceInteraction}" target="_blank" rel="noopener noreferrer">Interacciones 2026</a>
        </div>
      </article>`;
  }

  function injectPhytotherapy() {
    const data = window.CuerpoClaroPhytotherapyData;
    const profileApi = window.CuerpoClaroProfile;
    const content = document.getElementById('recommendationsContent');
    if (!data || !content) return;

    const old = content.querySelector('.phyto-section');
    if (old) old.remove();

    const records = getRecords();
    const areas = deriveAreas(records);
    const matched = data.plants.filter((plant) => plant.areas.some((area) => areas.includes(area)));
    const section = document.createElement('section');
    section.className = 'phyto-section';

    let gateHtml = '';
    let allowAsOptions = false;

    if (!profileApi) {
      gateHtml = '<div class="phyto-gate"><strong>Perfil de seguridad no disponible</strong>No se mostrarán opciones de fitoterapia hasta poder revisar medicación, alergias y antecedentes.</div>';
    } else {
      const profile = profileApi.getProfile();
      const completeness = profileApi.getCompleteness(profile);
      const risks = profileApi.getRiskFlags(profile);
      const medicationPresent = hasMedication(profile);

      if (!completeness.complete) {
        gateHtml = `<div class="phyto-gate"><strong>Completa primero el Perfil</strong>Falta: ${completeness.missing.join(', ')}. CuerpoClaro no debe seleccionar plantas sin esos datos.</div>`;
      } else if (risks.length) {
        gateHtml = `<div class="phyto-gate"><strong>Selección automática bloqueada por seguridad</strong>El perfil incluye ${risks.join(', ')}. Las fichas pueden consultarse como información, pero ninguna planta se presentará como opción adecuada sin una revisión específica.</div>`;
      } else if (medicationPresent) {
        gateHtml = '<div class="phyto-gate"><strong>Hay medicación habitual registrada</strong>Mostramos las monografías relacionadas solo como fichas para revisar. Antes de recomendar una planta concreta, el siguiente paso será cruzar el nombre exacto del medicamento con la tabla de interacciones EMA/ESCOP.</div>';
      } else {
        allowAsOptions = true;
        gateHtml = '<div class="phyto-method"><strong>Perfil básico sin factores de riesgo marcados.</strong> Las plantas que aparecen abajo son opciones documentadas para revisar, no una prescripción. La elección final depende de la preparación concreta, dosis, edad, duración y situación clínica.</div>';
      }
    }

    const titleText = allowAsOptions ? 'Opciones documentadas para revisar' : 'Monografías relacionadas para revisión';
    const cardsHtml = matched.length
      ? `<div class="phyto-grid">${matched.map(renderPlantCard).join('')}</div>`
      : '<div class="phyto-empty">Con los registros actuales no se ha activado ninguna de las áreas cubiertas todavía por esta primera base de plantas.</div>';

    section.innerHTML = `
      <div class="phyto-header">
        <div>
          <h3>🌿 Fitoterapia basada en fuentes verificables</h3>
          <p>${titleText}. Primera base: sueño, estrés, digestión, estreñimiento y náuseas.</p>
        </div>
        <span class="phyto-source-badge">Vademécum + EMA</span>
      </div>
      <div class="phyto-method">${data.methodology}</div>
      ${gateHtml}
      ${cardsHtml}
      <div class="phyto-legend"><strong>Criterio:</strong> “uso tradicional reconocido por EMA” se muestra como tal y no se convierte en “eficacia clínica demostrada”. Los riesgos meramente teóricos tampoco se presentan como interacciones clínicas confirmadas.</div>`;

    content.appendChild(section);
  }

  recommendationNav.addEventListener('click', injectPhytotherapy);
})();