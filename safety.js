(() => {
  const nav = document.querySelector('[data-view="seguridad"]');
  const target = document.getElementById('placeholderView');
  if (!nav || !target) return;

  const emergency = [
    ['chest','Dolor o presión intensa en el pecho, especialmente con falta de aire, sudor, náuseas o irradiación.'],
    ['breathing','Dificultad respiratoria grave o sensación de no poder respirar.'],
    ['stroke','Debilidad/adormecimiento repentino de un lado, cara caída, habla extraña o dificultad súbita para hablar/ver/caminar.'],
    ['consciousness','Pérdida de conocimiento, desmayo con mala recuperación, confusión intensa o dificultad para despertar.'],
    ['bleeding','Sangrado abundante que no se detiene, vómito o tos con sangre importante.'],
    ['allergy','Reacción alérgica grave con hinchazón de cara/lengua o dificultad para respirar.'],
    ['seizure','Convulsión prolongada o sin recuperación rápida.'],
    ['selfharm','Pensamientos de hacerse daño o riesgo inmediato de suicidio.']
  ];

  const prompt = [
    ['persistentPain','Dolor nuevo o persistente que empeora o interfiere claramente con la actividad normal.'],
    ['blood','Sangre en heces u orina, especialmente si se repite o se acompaña de dolor/debilidad.'],
    ['vomiting','Vómitos o diarrea persistentes, incapacidad para mantener líquidos o signos de deshidratación.'],
    ['fever','Fiebre alta persistente o fiebre acompañada de rigidez de cuello, confusión u otros síntomas importantes.'],
    ['weightLoss','Pérdida de peso no buscada o deterioro progresivo sin explicación.']
  ];

  function checkbox([id,label], group) {
    return `<label class="safety-check"><input type="checkbox" data-group="${group}" id="safe-${id}"><span>${label}</span></label>`;
  }

  function render() {
    target.innerHTML = `
      <section class="section-card safety-shell">
        <div class="safety-heading"><div><h2>Seguridad y señales de alarma</h2><p>Esta pantalla no diagnostica. Sirve para reconocer situaciones en las que no conviene esperar a una recomendación de la app.</p></div><span class="safety-badge">Prioridad clínica</span></div>
        <div class="safety-emergency-note"><strong>Si ya estás ante una emergencia:</strong> en España llama al <b>112</b>. No esperes a completar este formulario.</div>
        <form id="safetyForm">
          <section class="safety-block"><h3>🚨 Señales que pueden requerir atención inmediata</h3><div class="safety-list">${emergency.map((item)=>checkbox(item,'emergency')).join('')}</div></section>
          <section class="safety-block"><h3>⚕️ Señales que aconsejan valoración médica pronta</h3><div class="safety-list">${prompt.map((item)=>checkbox(item,'prompt')).join('')}</div></section>
          <button class="btn btn-primary" type="submit">Valorar prioridad</button>
        </form>
        <div id="safetyResult" class="safety-result" aria-live="polite"></div>
        <div class="safety-sources"><strong>Fuentes de referencia:</strong> <a target="_blank" rel="noopener noreferrer" href="https://medlineplus.gov/spanish/ency/article/001927.htm">MedlinePlus — reconocimiento de emergencias</a> · <a target="_blank" rel="noopener noreferrer" href="https://medlineplus.gov/spanish/stroke.html">MedlinePlus — ictus</a> · <a target="_blank" rel="noopener noreferrer" href="https://medlineplus.gov/spanish/ency/article/003079.htm">MedlinePlus — dolor torácico</a></div>
      </section>`;

    document.getElementById('safetyForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const emerg = [...document.querySelectorAll('[data-group="emergency"]')].some((el) => el.checked);
      const soon = [...document.querySelectorAll('[data-group="prompt"]')].some((el) => el.checked);
      const result = document.getElementById('safetyResult');
      if (emerg) {
        result.className = 'safety-result emergency';
        result.innerHTML = '<strong>Atención inmediata</strong><p>Has marcado al menos una señal potencialmente grave. En España llama al <b>112</b> o acude a urgencias. No uses las recomendaciones de CuerpoClaro para retrasar esa atención.</p>';
      } else if (soon) {
        result.className = 'safety-result prompt';
        result.innerHTML = '<strong>Valoración médica pronta</strong><p>No aparece una señal de emergencia de esta lista, pero sí un motivo para consultar sin dejarlo evolucionar durante muchos días. Si empeora o aparece una señal grave, pasa a urgencias.</p>';
      } else {
        result.className = 'safety-result routine';
        result.innerHTML = '<strong>No has marcado señales de alarma de esta lista</strong><p>Esto no descarta enfermedad. Continúa observando la evolución y consulta si los síntomas son persistentes, preocupantes o empeoran.</p>';
      }
    });
  }

  nav.addEventListener('click', () => { render(); target.classList.remove('hidden'); });
})();