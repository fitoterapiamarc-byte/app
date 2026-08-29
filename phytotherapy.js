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
    const values = records.map((record) => record[key])
      .filter((value) => value !== null && value !== undefined && value !== '')
      .map(Number).filter(Number.isFinite);
    if (!values.length) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function deriveAreas(records) {
    const recent = records.slice(-14);
    const areas = new Set();
    const sleep = average(recent, 'sleep');
    const stress = average(recent, 'stress');
    const digestion = average(recent, 'digestion');
    const pain = average(recent, 'pain');
    const mood = average(recent, 'mood');
    const constipationDays = recent.filter((record) => record.bowel === 'estrenimiento').length;

    if (sleep !== null && sleep <= 5) areas.add('sleep');
    if (stress !== null && stress >= 6.5) areas.add('stress');
    if (digestion !== null && digestion <= 5) areas.add('digestion');
    if (pain !== null && pain >= 5.5) areas.add('pain');
    if (mood !== null && mood <= 4.5) areas.add('mood');
    if (constipationDays >= 2) areas.add('constipation');

    const notes = recent.map((record) => String(record.notes || '').toLowerCase()).join(' ');
    if (/\bn[áa]usea[s]?\b|mareo.*viaje|cinetosis/.test(notes)) areas.add('nausea');
    if (/\btos\b|resfriado|catarro/.test(notes)) areas.add('cold');

    return [...areas];
  }

  function hasMedication(profile) {
    const value = String(profile.medications || '').trim().toLowerCase();
    if (!value) return false;
    const noneValues = ['ninguna','ninguno','no','ninguna medicación','ninguna medicacion','no tomo medicación','no tomo medicacion'];
    return !noneValues.includes(value);
  }

  function safetyClass(status) {
    if (status === 'none-described') return 'safe';
    if (status === 'monitor') return 'monitor';
    if (status === 'avoid') return 'avoid';
    return '';
  }

  function safetyLabel(status) {
    if (status === 'none-described') return 'No se describen interacciones en las fuentes revisadas';
    if (status === 'monitor') return 'Requiere vigilancia / revisión profesional';
    if (status === 'review') return 'Requiere revisión en determinadas combinaciones';
    if (status === 'evidence-limited') return 'Precauciones o datos limitados/teóricos';
    if (status === 'avoid') return 'Alto potencial de interacción: revisar antes de usar';
    return 'Revisión de seguridad necesaria';
  }

  function interactionHtml(plant, medications) {
    const engine = window.CuerpoClaroInteractions;
    if (!engine || !medications) return '';
    const result = engine.evaluate(plant.id, medications);
    const levelLabel = { avoid:'EVITAR / REVISAR', monitor:'MONITORIZAR', consider:'VALORAR', none:'SIN COINCIDENCIA MAPEADA', unknown:'SIN REGLA ESPECÍFICA' }[result.level] || 'REVISAR';
    const hits = result.hits.length
      ? `<ul>${result.hits.map((item) => `<li><strong>${item.title}:</strong> ${item.detail}</li>`).join('')}</ul>`
      : `<p>${result.message}</p>`;
    return `<div class="interaction-result interaction-${result.level}"><strong>${levelLabel}</strong>${hits}<small>Comparación automática por texto. No sustituye la revisión por un profesional ni cubre todos los nombres comerciales.</small></div>`;
  }

  function renderPlantCard(plant, medications) {
    return `
      <article class="phyto-card">
        <div><h4>${plant.commonName}</h4><div class="phyto-scientific">${plant.scientificName}</div></div>
        <div class="phyto-drug"><strong>Parte usada:</strong> ${plant.drug}</div>
        <span class="phyto-evidence">${plant.evidenceLabel}</span>
        <p>${plant.evidenceNote}</p>
        <div class="phyto-safety ${safetyClass(plant.interactionStatus)}"><strong>${safetyLabel(plant.interactionStatus)}</strong><br>${plant.interactionNote}</div>
        ${interactionHtml(plant, medications)}
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
    let medications = '';
    let allowAsOptions = false;

    if (!profileApi) {
      gateHtml = '<div class="phyto-gate"><strong>Perfil de seguridad no disponible</strong>No se mostrarán opciones de fitoterapia hasta revisar medicación, alergias y antecedentes.</div>';
    } else {
      const profile = profileApi.getProfile();
      const completeness = profileApi.getCompleteness(profile);
      const risks = profileApi.getRiskFlags(profile);
      medications = hasMedication(profile) ? String(profile.medications || '') : '';

      if (!completeness.complete) {
        gateHtml = `<div class="phyto-gate"><strong>Completa primero el Perfil</strong>Falta: ${completeness.missing.join(', ')}. CuerpoClaro no debe seleccionar plantas sin esos datos.</div>`;
      } else if (risks.length) {
        gateHtml = `<div class="phyto-gate"><strong>Selección automática bloqueada por seguridad</strong>El perfil incluye ${risks.join(', ')}. Las monografías se muestran solo para revisión; ninguna planta se presenta como adecuada automáticamente.</div>`;
      } else if (medications) {
        gateHtml = '<div class="phyto-gate"><strong>Medicaciones registradas: revisión obligatoria</strong>El motor compara palabras clave con interacciones documentadas EMA/ESCOP. Una ausencia de coincidencia NO equivale a demostrar seguridad.</div>';
      } else {
        allowAsOptions = true;
        gateHtml = '<div class="phyto-method"><strong>Perfil básico sin factores de riesgo marcados y sin medicación habitual.</strong> Las plantas que aparecen son opciones documentadas para revisar, no una prescripción. Deben respetarse preparación, dosis, edad, duración y contraindicaciones de la monografía.</div>';
      }
    }

    const titleText = allowAsOptions ? 'Opciones documentadas para revisar' : 'Monografías relacionadas para revisión';
    const cardsHtml = matched.length
      ? `<div class="phyto-grid">${matched.map((plant) => renderPlantCard(plant, medications)).join('')}</div>`
      : '<div class="phyto-empty">Con los registros actuales no se activa ninguna de las áreas cubiertas por la base fitoterápica de esta versión.</div>';

    section.innerHTML = `
      <div class="phyto-header"><div><h3>🌿 Fitoterapia basada en fuentes verificables</h3><p>${titleText}. La selección parte de tendencias del registro, no de un diagnóstico.</p></div><span class="phyto-source-badge">Vademécum + EMA/ESCOP</span></div>
      <div class="phyto-method">${data.methodology}</div>
      ${gateHtml}
      ${cardsHtml}
      <div class="phyto-legend"><strong>Criterio de seguridad:</strong> “no se han descrito interacciones” no significa que una interacción sea imposible. En polimedicación, fragilidad o fármacos de margen terapéutico estrecho se requiere valoración individual.</div>`;
    content.appendChild(section);
  }

  recommendationNav.addEventListener('click', injectPhytotherapy);
})();