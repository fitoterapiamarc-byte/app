const dailyStyles = document.createElement('link');
dailyStyles.rel = 'stylesheet';
dailyStyles.href = 'daily.css';
document.head.appendChild(dailyStyles);

const legalScreen = document.getElementById('legalScreen');
const homeScreen = document.getElementById('homeScreen');
const acceptBtn = document.getElementById('acceptBtn');
const rejectBtn = document.getElementById('rejectBtn');
const navItems = document.querySelectorAll('.nav-item');
const inicioView = document.getElementById('inicioView');
const registroView = document.getElementById('registroView');
const placeholderView = document.getElementById('placeholderView');
const placeholderTitle = document.getElementById('placeholderTitle');
const dailyForm = document.getElementById('dailyForm');
const saveMessage = document.getElementById('saveMessage');
const todayDate = document.getElementById('todayDate');

const STORAGE_TERMS = 'cuerpoclaro_terms_accepted';
const STORAGE_RECORDS = 'cuerpoclaro_daily_records';

const rangeMetricIds = ['energy', 'mood', 'digestion', 'sleep', 'stress', 'pain'];
const dashboardMetricIds = ['energy', 'mood', 'digestion', 'sleep'];

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

function showView(viewName) {
  inicioView.classList.add('hidden');
  registroView.classList.add('hidden');
  placeholderView.classList.add('hidden');

  if (viewName === 'inicio') {
    inicioView.classList.remove('hidden');
  } else if (viewName === 'registro') {
    registroView.classList.remove('hidden');
  } else {
    placeholderTitle.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
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