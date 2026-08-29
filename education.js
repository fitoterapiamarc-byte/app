(() => {
  const educationNav = document.querySelector('[data-view="educacion"]');
  const targetView = document.getElementById('placeholderView');
  if (!educationNav || !targetView) return;

  function renderEducation() {
    targetView.innerHTML = `
      <section class="section-card education-shell">
        <div class="education-heading">
          <div>
            <h2>Educación</h2>
            <p>Aprende a interpretar señales y hábitos sin convertir una observación en un diagnóstico.</p>
          </div>
          <span class="education-badge">Guía práctica</span>
        </div>

        <div class="education-intro">
          CuerpoClaro utiliza tendencias de varios días. Un valor aislado puede depender de sueño, estrés, actividad, alimentación, enfermedad o muchos otros factores. Cuantos más registros comparables haya, más útil será la lectura.
        </div>

        <div class="education-grid">
          <details class="education-card" open>
            <summary>📈 Cómo interpretar las puntuaciones</summary>
            <div class="education-body">
              <p>Las escalas de 0 a 10 sirven para observar cambios personales, no para diagnosticar enfermedades.</p>
              <ul><li>Compara principalmente contigo mismo.</li><li>Busca tendencias de varios días.</li><li>Anota cambios de rutina, medicación, comidas o estrés que puedan dar contexto.</li></ul>
            </div>
          </details>

          <details class="education-card">
            <summary>🌙 Sueño y recuperación</summary>
            <div class="education-body">
              <p>La cantidad y la calidad del sueño pueden influir en energía, concentración, apetito, estado de ánimo y tolerancia al esfuerzo.</p>
              <ul><li>Intenta horarios relativamente regulares.</li><li>Observa si dormir más se relaciona con mejor energía al día siguiente.</li><li>Si hay insomnio persistente, pausas respiratorias o somnolencia intensa, conviene una valoración profesional.</li></ul>
            </div>
          </details>

          <details class="education-card">
            <summary>🍽️ Digestión y alimentación</summary>
            <div class="education-body">
              <p>Pesadez, distensión o cambios del tránsito pueden variar con cantidad de comida, fibra, líquidos, estrés, horarios y determinados alimentos.</p>
              <ul><li>Cambia una cosa cada vez si quieres identificar patrones.</li><li>No elimines grupos de alimentos solo por una coincidencia aislada.</li><li>Sangre en heces, dolor intenso o pérdida de peso no buscada requieren valoración sanitaria.</li></ul>
            </div>
          </details>

          <details class="education-card">
            <summary>🧠 Estrés y estado de ánimo</summary>
            <div class="education-body">
              <p>El estrés puede coincidir con cambios de sueño, digestión, dolor, energía y ánimo. La relación puede ser bidireccional.</p>
              <ul><li>Registra también qué estaba ocurriendo ese día.</li><li>Movimiento, descanso, contacto social y pausas de relajación pueden ayudar a muchas personas.</li><li>Si el ánimo bajo es intenso, duradero o aparecen pensamientos de hacerse daño, busca ayuda inmediata.</li></ul>
            </div>
          </details>

          <details class="education-card">
            <summary>💧 Hidratación y orina</summary>
            <div class="education-body">
              <p>El color de la orina puede orientarnos sobre hidratación, pero también cambia por alimentos, vitaminas, medicamentos y otras causas.</p>
              <ul><li>Observa la tendencia, no un solo episodio.</li><li>Calor y ejercicio aumentan las necesidades de líquido.</li><li>Un color inusual persistente, sangre o dolor al orinar deben consultarse.</li></ul>
            </div>
          </details>

          <details class="education-card">
            <summary>🚶 Actividad física</summary>
            <div class="education-body">
              <p>La actividad regular puede relacionarse con mejor capacidad física, sueño y bienestar, pero la dosis adecuada depende de cada persona.</p>
              <ul><li>Empieza de forma progresiva si llevas tiempo inactivo.</li><li>Observa recuperación y síntomas después del esfuerzo.</li><li>Dolor torácico, mareo intenso o dificultad respiratoria desproporcionada requieren detenerse y buscar valoración.</li></ul>
            </div>
          </details>

          <details class="education-card">
            <summary>🌿 Plantas y suplementos</summary>
            <div class="education-body">
              <p>Que un producto sea natural no significa que sea adecuado para todo el mundo. Las plantas y suplementos pueden tener efectos, contraindicaciones e interacciones.</p>
              <ul><li>Hay que revisar medicación, alergias y antecedentes.</li><li>Embarazo, lactancia, enfermedad renal o hepática requieren especial precaución.</li><li>No sustituyas ni suspendas medicación prescrita por una recomendación de la app.</li></ul>
            </div>
          </details>

          <details class="education-card">
            <summary>🔎 Correlación no significa causa</summary>
            <div class="education-body">
              <p>Si dos variables cambian juntas, eso no demuestra que una provoque la otra. Por ejemplo, estrés y mal sueño pueden aparecer juntos porque ambos están influidos por un tercer factor.</p>
              <ul><li>Confirma patrones durante más días.</li><li>Evita conclusiones rápidas.</li><li>Utiliza el análisis como una pista para observar mejor, no como una prueba médica.</li></ul>
            </div>
          </details>
        </div>

        <div class="education-alert">
          <strong>Cuándo no esperar a la app</strong>
          Dolor torácico intenso, dificultad respiratoria grave, pérdida de consciencia, debilidad súbita de una parte del cuerpo, sangrado abundante u otra situación potencialmente grave requieren atención urgente. En España, llama al 112.
        </div>
      </section>`;
  }

  educationNav.addEventListener('click', () => {
    renderEducation();
    targetView.classList.remove('hidden');
  });
})();