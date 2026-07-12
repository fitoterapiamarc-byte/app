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

const metricIds = ['energy', 'mood', 'digestion', 'sleep'];

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
  output.value = input.value;
}

function updateDashboard(record) {
  const values = record || { energy: 0, mood: 0, digestion: 0, sleep: 0 };
  metricIds.forEach((metric) => {
    const stat = document.getElementById(`${metric}Stat`);
    stat.innerHTML = `${values[metric] || 0}<span>/10</span>`;
  });
}

function loadTodayRecord() {
  const record = getRecords()[getTodayKey()];

  if (record) {
    metricIds.forEach((metric) => {
      document.getElementById(`${metric}Input`).value = record[metric];
      updateRangeOutput(metric);
    });
    document.getElementById('notesInput').value = record.notes || '';
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

metricIds.forEach((metric) => {
  document.getElementById(`${metric}Input`).addEventListener('input', () => updateRangeOutput(metric));
});

dailyForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const records = getRecords();
  const record = {
    date: getTodayKey(),
    energy: Number(document.getElementById('energyInput').value),
    mood: Number(document.getElementById('moodInput').value),
    digestion: Number(document.getElementById('digestionInput').value),
    sleep: Number(document.getElementById('sleepInput').value),
    notes: document.getElementById('notesInput').value.trim(),
    savedAt: new Date().toISOString()
  };

  records[getTodayKey()] = record;
  localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records));
  updateDashboard(record);

  saveMessage.textContent = '✓ Registro guardado correctamente en este dispositivo.';
  setTimeout(() => {
    saveMessage.textContent = '';
  }, 4000);
});

todayDate.textContent = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
}).format(new Date());

metricIds.forEach(updateRangeOutput);
loadTodayRecord();