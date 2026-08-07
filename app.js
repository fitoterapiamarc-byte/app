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

function formatAverage(value) {
  return value === null ? '—' : value.toFixed(1);
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

  const legend = analysisMetrics.map((metric) => `
    <span><i class="legend-dot" style="background:${metric.stroke}"></i>${metric.label}</span>`).join('');

  content.innerHTML = `
    <div class="analysis-summary-grid">${summaryCards}</div>
    <div class="analysis-chart-card">
      <h3>Evolución</h3>
      <div class="analysis-chart">${renderChart(recent)}</div>
      <div class="chart-legend">${legend}</div>
    </div>
    <div class="analysis-insight-card">
      <h3>Lectura de tendencia</h3>
      <p>${buildInsight(records)}</p>
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