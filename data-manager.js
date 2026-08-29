(() => {
  const nav = document.querySelector('[data-view="datos"]');
  const target = document.getElementById('placeholderView');
  if (!nav || !target) return;

  const KEYS = {
    terms: 'cuerpoclaro_terms_accepted',
    records: 'cuerpoclaro_daily_records',
    profile: 'cuerpoclaro_health_profile'
  };

  function safeParse(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }

  function snapshot() {
    return {
      app: 'CuerpoClaro',
      formatVersion: 1,
      exportedAt: new Date().toISOString(),
      termsAccepted: localStorage.getItem(KEYS.terms) === 'true',
      profile: safeParse(KEYS.profile, {}),
      records: safeParse(KEYS.records, {})
    };
  }

  function download(name, text, type='application/json') {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    const data = snapshot();
    const date = new Date().toISOString().slice(0,10);
    download(`CuerpoClaro-copia-${date}.json`, JSON.stringify(data, null, 2));
  }

  function csvEscape(value) {
    const text = String(value ?? '');
    return `"${text.replaceAll('"','""')}"`;
  }

  function exportCsv() {
    const rows = Object.values(snapshot().records || {}).sort((a,b) => String(a.date).localeCompare(String(b.date)));
    const headers = ['date','energy','mood','digestion','sleep','stress','pain','sleepHours','weight','activityMinutes','painLocation','bowel','urine','notes','savedAt'];
    const csv = [headers.join(','), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(','))].join('\n');
    const date = new Date().toISOString().slice(0,10);
    download(`CuerpoClaro-registros-${date}.csv`, csv, 'text/csv;charset=utf-8');
  }

  function validateBackup(data) {
    if (!data || data.app !== 'CuerpoClaro' || data.formatVersion !== 1) throw new Error('El archivo no parece una copia válida de CuerpoClaro.');
    if (!data.records || typeof data.records !== 'object' || Array.isArray(data.records)) throw new Error('La copia no contiene un bloque de registros válido.');
    if (!data.profile || typeof data.profile !== 'object' || Array.isArray(data.profile)) throw new Error('La copia no contiene un perfil válido.');
    for (const [key, record] of Object.entries(data.records)) {
      if (!record || typeof record !== 'object' || typeof record.date !== 'string') throw new Error(`Registro inválido: ${key}`);
    }
  }

  function importBackup(file, message) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        validateBackup(data);
        if (!confirm('La importación sustituirá el perfil y los registros actuales por los de la copia. ¿Continuar?')) return;
        localStorage.setItem(KEYS.records, JSON.stringify(data.records));
        localStorage.setItem(KEYS.profile, JSON.stringify(data.profile));
        if (data.termsAccepted) localStorage.setItem(KEYS.terms, 'true');
        message.textContent = '✓ Copia importada correctamente. Recarga la aplicación para ver todos los datos restaurados.';
      } catch (error) {
        message.textContent = `No se pudo importar: ${error.message}`;
      }
    };
    reader.onerror = () => { message.textContent = 'No se pudo leer el archivo.'; };
    reader.readAsText(file);
  }

  function render() {
    const data = snapshot();
    const recordCount = Object.keys(data.records || {}).length;
    const profileExists = Object.keys(data.profile || {}).length > 0;
    target.innerHTML = `
      <section class="section-card data-shell">
        <div class="data-heading"><div><h2>Mis datos</h2><p>Copia, restaura o elimina los datos guardados por CuerpoClaro en este navegador.</p></div><span class="data-badge">Almacenamiento local</span></div>
        <div class="data-summary"><article><strong>${recordCount}</strong><span>registros diarios</span></article><article><strong>${profileExists ? 'Sí' : 'No'}</strong><span>perfil guardado</span></article></div>
        <div class="data-notice"><strong>Importante:</strong> esta versión no sincroniza con un servidor. Si borras el navegador, cambias de dispositivo o limpias los datos del sitio, puedes perder la información. Haz copias periódicas.</div>
        <section class="data-block"><h3>Copia de seguridad</h3><p>JSON conserva perfil y registros. CSV sirve para abrir los registros diarios en una hoja de cálculo.</p><div class="data-actions"><button id="exportJsonBtn" class="btn btn-primary" type="button">Descargar copia JSON</button><button id="exportCsvBtn" class="btn btn-secondary" type="button">Exportar registros CSV</button></div></section>
        <section class="data-block"><h3>Restaurar copia</h3><p>Selecciona una copia JSON creada por CuerpoClaro.</p><input id="importBackupInput" type="file" accept="application/json,.json"><div id="dataMessage" class="data-message"></div></section>
        <section class="data-block danger"><h3>Borrar datos</h3><p>Elimina perfil y registros guardados en este navegador. Esta acción no se puede deshacer si no tienes una copia.</p><button id="deleteAllDataBtn" class="btn data-delete" type="button">Borrar perfil y registros</button></section>
      </section>`;

    const message = document.getElementById('dataMessage');
    document.getElementById('exportJsonBtn').addEventListener('click', exportJson);
    document.getElementById('exportCsvBtn').addEventListener('click', exportCsv);
    document.getElementById('importBackupInput').addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (file) importBackup(file, message);
    });
    document.getElementById('deleteAllDataBtn').addEventListener('click', () => {
      if (!confirm('¿Seguro que quieres borrar todos los registros y el perfil de este navegador?')) return;
      if (!confirm('Última confirmación: esta acción no se puede deshacer sin una copia de seguridad.')) return;
      localStorage.removeItem(KEYS.records);
      localStorage.removeItem(KEYS.profile);
      render();
    });
  }

  nav.addEventListener('click', () => { render(); target.classList.remove('hidden'); });
})();