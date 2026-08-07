const dailyStyles = document.createElement('link');
dailyStyles.rel = 'stylesheet';
dailyStyles.href = 'daily.css';
document.head.appendChild(dailyStyles);

const analysisStyles = document.createElement('link');
analysisStyles.rel = 'stylesheet';
analysisStyles.href = 'analysis.css';
document.head.appendChild(analysisStyles);

const legalScreen = document.getElementById('legalScreen');
const homeScreen = document.getElementById('homeScreen');
const acceptBtn = document.getElementById('acceptBtn');
const rejectBtn = document.getElementById('rejectBtn');
const navItems = document.querySelectorAll('.nav-item');
const inicioView = document.getElementById('inicioView');
const registroView = document.getElementById('registroView');
const placeholderView = document.getElementById('placeholderView');
const dailyForm = document.getElementById('dailyForm');
const saveMessage = document.getElementById('saveMessage');
const todayDate = document.getElementById('todayDate');

const STORAGE_TERMS = 'cuerpoclaro_terms_accepted';
const STORAGE_RECORDS = 'cuerpoclaro_daily_records';

const rangeMetricIds = ['energy', 'mood', 'digestion', 'sleep', 'stress', 'pain'];
const dashboardMetricIds = ['energy', 'mood', 'digestion', 'sleep'];

const analysisMetrics = [
  { id: 'energy', label: 'Energía', stroke: '#ff7a00' },
  { id: 'mood', label: 'Ánimo', stroke: '#e8348a' },
  { id: 'digestion', label: 'Digestión', stroke: '#2475ff' },
  { id: 'sleep', label: 'Sueño', stroke: '#8a35d8' }
];

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_RECORDS)) || {};
  } catch {
    return {};
  }
}

function getSortedRecords() {
  return Object.values(getRecords())
    .filter((record) => record && record.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function updateRangeOutput(metric) {
  const input = document.getElementById(`${metric}Input`);
  const output = document.getElementById(`${metric}Value`);
  if (input && output) output.value = input.value;
}

function updateDashboard(record) {
  const values = record || { energy: 0, mood: 0, digestion: 0, sleep: 0 };
  dashboardMetricIds.forEach((metric) => {
    const stat = document.getElementById(`${metric}Stat`);
    stat.innerHTML = `${values[metric] ?? 0}<span>/10</span>`;
  });
}

function setInputValue(id, value) {
  const input = document.getElementById(id);
  if (input && value !== undefined && value !== null) input.value = value;
}

function loadTodayRecord() {
  const record = getRecords()[getTodayKey()];

  if (record) {
    rangeMetricIds.forEach((metric) => {
      if (record[metric] !== undefined) {
        setInputValue(`${metric}Input`, record[metric]);
        updateRangeOutput(metric);
      }
    });

    setInputValue('sleepHoursInput', record.sleepHours ?? '');
    setInputValue('weightInput', record.weight ?? '');
    setInputValue('activityInput', record.activityMinutes ?? '');
    setInputValue('painLocationInput', record.painLocation ?? '');
    setInputValue('bowelInput', record.bowel ?? '');
    setInputValue('urineInput', record.urine ?? '');
    setInputValue('notesInput', record.notes ?? '');
  }

  updateDashboard(record);
}

function average(records, metric) {
  const values = records
    .map((record) => Number(record[metric]))
    .filter((value) => Number.isFinite(value));

  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatAverage(value, digits = 1) {
  return value === null ? '—' : value.toFixed(digits);
}

function buildInsight(records) {
  if (records.length < 2) {
    return 'Con un solo registro todavía no se puede valorar una tendencia. Sigue registrando varios días para comparar cambios.';
  }

  const recent = records.slice(-3);
  const previous = records.slice(Math.max(0, records.length - 6), Math.max(0, records.length - 3));

  if (!previous.length) {
    const best = analysisMetrics
      .map((metric) => ({ ...metric, value: average(recent, metric.id) }))
      .filter((metric) => metric.value !== null)
      .sort((a, b) => b.value - a.value)[0];

    return best
      ? `Ya hay ${records.length} registros disponibles. De momento, ${best.label.toLowerCase()} es el indicador con mejor media (${best.value.toFixed(1)}/10). Con más días podremos detectar tendencias con mayor fiabilidad.`
      : 'Ya hay varios registros, pero todavía faltan valores suficientes para calcular una tendencia.';
  }

  const changes = analysisMetrics.map((metric) => ({
    ...metric,
    recent: average(recent, metric.id),
    previous: average(previous, metric.id)
  })).filter((metric) => metric.recent !== null && metric.previous !== null);

  if (!changes.length) return 'Todavía no hay suficientes datos comparables para establecer una tendencia.';

  const strongest = changes
    .map((metric) => ({ ...metric, change: metric.recent - metric.previous }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))[0];

  if (Math.abs(strongest.change) < 0.5) {
    return 'Los últimos registros se mantienen bastante estables. No aparece todavía un cambio marcado en los indicadores principales.';
  }

  const direction = strongest.change > 0 ? 'ha mejorado' : 'ha bajado';
  return `${strongest.label} ${direction} aproximadamente ${Math.abs(strongest.change).toFixed(1)} puntos respecto al periodo anterior. Es una tendencia orientativa y conviene confirmarla con más días de registro.`;
}

function pearsonCorrelation(records, xKey, yKey) {
  const pairs = records
    .map((record) => [Number(record[xKey]), Number(record[yKey])])
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));

  if (pairs.length < 4) return null;

  const meanX = pairs.reduce((sum, pair) => sum + pair[0], 0) / pairs.length;
  const meanY = pairs.reduce((sum, pair) => sum + pair[1], 0) / pairs.length;

  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;

  pairs.forEach(([x, y]) => {
    const dx = x - meanX;
    const dy = y - meanY;
    numerator += dx * dy;
    sumSqX += dx * dx;
    sumSqY += dy * dy;
  });

  const denominator = Math.sqrt(sumSqX * sumSqY);
  if (!denominator) return null;

  return {
    value: numerator / denominator,
    count: pairs.length
  };
}

function describeRelation(correlation, positiveText, negativeText) {
  if (!correlation || correlation.count < 4) return null;

  const strength = Math.abs(correlation.value);
  if (strength < 0.45) return null;

  return {
    strength,
    text: correlation.value > 0 ? positiveText : negativeText,
    count: correlation.count
  };
}

function buildRelations(records) {
  const candidates = [
    describeRelation(
      pearsonCorrelation(records, 'sleepHours', 'energy'),
      'Los días con más horas de sueño tienden a coincidir con más energía.',
      'En tus registros, más horas de sueño coinciden con menos energía. Conviene observar si intervienen otros factores.'
    ),
    describeRelation(
      pearsonCorrelation(records, 'sleepHours', 'stress'),
      'En tus registros, más horas de sueño coinciden con más estrés. No implica que una cosa cause la otra.',
      'Los días con más horas de sueño tienden a coincidir con menos estrés.'
    ),
    describeRelation(
      pearsonCorrelation(records, 'activityMinutes', 'energy'),
      'Los días con más actividad física tienden a coincidir con más energía.',
      'Los días con más actividad física tienden a coincidir con menos energía; podría reflejar cansancio o días más exigentes.'
    ),
    describeRelation(
      pearsonCorrelation(records, 'activityMinutes', 'mood'),
      'Los días con más actividad física tienden a coincidir con mejor estado de ánimo.',
      'Los días con más actividad física tienden a coincidir con peor estado de ánimo. Hace falta más contexto para interpretarlo.'
    ),
    describeRelation(
      pearsonCorrelation(records, 'stress', 'sleep'),
      'Cuando el estrés sube, la valoración del sueño también tiende a subir en tus registros.',
      'Cuando el estrés sube, la calidad del sueño tiende a bajar.'
    ),
    describeRelation(
      pearsonCorrelation(records, 'pain', 'mood'),
      'Cuando aumenta el dolor, el estado de ánimo también tiende a subir en tus registros.',
      'Cuando aumenta el dolor, el estado de ánimo tiende a bajar.'
    ),
    describeRelation(
      pearsonCorrelation(records, 'pain', 'sleep'),
      'Cuando aumenta el dolor, la calidad del sueño también tiende a subir en tus registros.',
      'Cuando aumenta el dolor, la calidad del sueño tiende a bajar.'
    )
  ].filter(Boolean);

  return candidates
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 3);
}

function renderChart(records) {
  const chartRecords = records.slice(-14);
  if (!chartRecords.length) return '';

  const width = 760;
  const height = 250;
  const left = 38;
  const right = 18;
  const top = 18;
  const bottom = 38;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const xStep = chartRecords.length > 1 ? plotWidth / (chartRecords.length - 1) : 0;
  const y = (value) => top + plotHeight - (Number(value) / 10) * plotHeight;
  const x = (index) => left + (chartRecords.length === 1 ? plotWidth / 2 : index * xStep);

  const horizontalLines = [0, 2, 4, 6, 8, 10].map((value) => {
    const py = y(value);
    return `<line x1="${left}" y1="${py}" x2="${width - right}" y2="${py}" stroke="#e1e7ef" stroke-width="1" />\n<text x="7" y="${py + 4}" font-size="11" fill="#6b7280">${value}</text>`;
  }).join('');

  const lines = analysisMetrics.map((metric) => {
    const validPoints = chartRecords
      .map((record, index) => ({ value: Number(record[metric.id]), index }))
      .filter((point) => Number.isFinite(point.value));

    if (!validPoints.length) return '';

    const points = validPoints.map((point) => `${x(point.index)},${y(point.value)}`).join(' ');
    const circles = validPoints.map((point) => `<circle cx="${x(point.index)}" cy="${y(point.value)}" r="3.5" fill="${metric.stroke}" />`).join('');
    return `<polyline points="${points}" fill="none" stroke="${metric.stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />${circles}`;
  }).join('');

  const labels = chartRecords.map((record, index) => {
    if (chartRecords.length > 8 && index % 2 !== 0 && index !== chartRecords.length - 1) return '';
    const date = new Date(`${record.date}T12:00:00`);
    const label = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit' }).format(date);
    return `<text x="${x(index)}" y="${height - 10}" text-anchor="middle" font-size="11" fill="#6b7280">${label}</text>`;
  }).join('');

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Evolución de energía, ánimo, digestión y sueño">${horizontalLines}${lines}${labels}</svg>`;
}

function formatDateShort(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit' }).format(date);
}

function formatCell(value, suffix = '') {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? `${numeric}${suffix}` : '—';
}

function renderHistory(records) {
  const rows = records.slice(-7).reverse().map((record) => `
    <div class="history-row">
      <span>${formatDateShort(record.date)}</span>
      <span>${formatCell(record.energy)}</span>
      <span>${formatCell(record.stress)}</span>
      <span>${formatCell(record.pain)}</span>
      <span>${formatCell(record.sleepHours, ' h')}</span>
      <span>${formatCell(record.activityMinutes, ' min')}</span>
      <span>${formatCell(record.weight, ' kg')}</span>
    </div>`).join('');

  return `
    <div class="analysis-history">
      <div class="history-row history-head">
        <span>Fecha</span><span>Energía</span><span>Estrés</span><span>Dolor</span><span>Sueño</span><span>Actividad</span><span>Peso</span>
      </div>
      ${rows}
    </div>`;
}

function renderAnalysis() {
  const records = getSortedRecords();

  placeholderView.innerHTML = `
    <section class="section-card analysis-shell">
      <div class="analysis-heading">
        <div>
          <h2>Análisis</h2>
          <p>Resumen orientativo de la evolución de tus registros diarios.</p>
        </div>
        <span class="analysis-period">Últimos 14 registros</span>
      </div>
      <div id="analysisContent"></div>
    </section>`;

  const content = document.getElementById('analysisContent');

  if (!records.length) {
    content.innerHTML = `
      <div class="analysis-empty">
        <strong>Aún no hay datos para analizar.</strong>
        Registra al menos un día en “Registro Diario”. Con varios días podrás empezar a ver tendencias.
      </div>`;
    return;
  }

  const recent = records.slice(-14);
  const summaryCards = analysisMetrics.map((metric) => `
    <article class="analysis-summary-card">
      <span>Media de ${metric.label.toLowerCase()}</span>
      <strong>${formatAverage(average(recent, metric.id))}</strong> <small>/10</small>
    </article>`).join('');

  const extraCards = [
    { label: 'Estrés medio', value: formatAverage(average(recent, 'stress')), suffix: '/10' },
    { label: 'Dolor medio', value: formatAverage(average(recent, 'pain')), suffix: '/10' },
    { label: 'Sueño medio', value: formatAverage(average(recent, 'sleepHours')), suffix: 'h' },
    { label: 'Actividad media', value: formatAverage(average(recent, 'activityMinutes'), 0), suffix: 'min' }
  ].map((item) => `
    <article class="analysis-extra-card">
      <span>${item.label}</span>
      <strong>${item.value}</strong> <small>${item.suffix}</small>
    </article>`).join('');

  const legend = analysisMetrics.map((metric) => `
    <span><i class="legend-dot" style="background:${metric.stroke}"></i>${metric.label}</span>`).join('');

  const relations = buildRelations(recent);
  const relationsHtml = relations.length
    ? `<div class="relation-list">${relations.map((relation) => `
        <div class="relation-item">
          <strong>Patrón detectado</strong>
          <span>${relation.text} Basado en ${relation.count} días comparables.</span>
        </div>`).join('')}</div>`
    : `<p>Por ahora no aparece una relación suficientemente clara entre sueño, actividad, estrés, dolor, energía y ánimo. Se necesitan más días comparables.</p>`;

  content.innerHTML = `
    <div class="analysis-summary-grid">${summaryCards}</div>
    <div class="analysis-extra-grid">${extraCards}</div>
    <div class="analysis-chart-card">
      <h3>Evolución principal</h3>
      <div class="analysis-chart">${renderChart(recent)}</div>
      <div class="chart-legend">${legend}</div>
    </div>
    <div class="analysis-insight-card">
      <h3>Lectura de tendencia</h3>
      <p>${buildInsight(records)}</p>
    </div>
    <div class="analysis-relations-card">
      <h3>Relaciones entre hábitos y señales</h3>
      ${relationsHtml}
      <p class="relation-note">Estas asociaciones son orientativas. Una coincidencia entre dos variables no demuestra que una sea la causa de la otra.</p>
    </div>
    <div class="analysis-history-card">
      <h3>Últimos 7 registros</h3>
      ${renderHistory(records)}
    </div>`;
}

function renderPlaceholder(viewName) {
  const title = viewName.charAt(0).toUpperCase() + viewName.slice(1);
  placeholderView.innerHTML = `
    <section class="section-card placeholder-card">
      <h2>${title}</h2>
      <p>Esta sección será la siguiente parte del programa.</p>
    </section>`;
}

function showView(viewName) {
  inicioView.classList.add('hidden');
  registroView.classList.add('hidden');
  placeholderView.classList.add('hidden');

  if (viewName === 'inicio') {
    inicioView.classList.remove('hidden');
  } else if (viewName === 'registro') {
    registroView.classList.remove('hidden');
  } else if (viewName === 'analisis') {
    renderAnalysis();
    placeholderView.classList.remove('hidden');
  } else {
    renderPlaceholder(viewName);
    placeholderView.classList.remove('hidden');
  }
}

function numberOrNull(id) {
  const value = document.getElementById(id).value;
  return value === '' ? null : Number(value);
}

if (localStorage.getItem(STORAGE_TERMS) === 'true') {
  legalScreen.classList.add('hidden');
  homeScreen.classList.remove('hidden');
}

acceptBtn.addEventListener('click', () => {
  localStorage.setItem(STORAGE_TERMS, 'true');
  legalScreen.classList.add('hidden');
  homeScreen.classList.remove('hidden');
});

rejectBtn.addEventListener('click', () => {
  alert('Para utilizar la aplicación debes aceptar primero los términos legales.');
});

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((nav) => nav.classList.remove('active'));
    item.classList.add('active');
    showView(item.dataset.view);
  });
});

rangeMetricIds.forEach((metric) => {
  document.getElementById(`${metric}Input`).addEventListener('input', () => updateRangeOutput(metric));
});

dailyForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const records = getRecords();
  const record = {
    date: getTodayKey(),
    energy: numberOrNull('energyInput'),
    mood: numberOrNull('moodInput'),
    digestion: numberOrNull('digestionInput'),
    sleep: numberOrNull('sleepInput'),
    stress: numberOrNull('stressInput'),
    pain: numberOrNull('painInput'),
    sleepHours: numberOrNull('sleepHoursInput'),
    weight: numberOrNull('weightInput'),
    activityMinutes: numberOrNull('activityInput'),
    painLocation: document.getElementById('painLocationInput').value.trim(),
    bowel: document.getElementById('bowelInput').value,
    urine: document.getElementById('urineInput').value,
    notes: document.getElementById('notesInput').value.trim(),
    savedAt: new Date().toISOString()
  };

  records[getTodayKey()] = record;
  localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records));
  updateDashboard(record);

  saveMessage.textContent = '✓ Registro completo guardado correctamente en este dispositivo.';
  setTimeout(() => {
    saveMessage.textContent = '';
  }, 4000);
});

todayDate.textContent = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
}).format(new Date());

rangeMetricIds.forEach(updateRangeOutput);
loadTodayRecord();