(() => {
  const STORAGE_RECORDS = 'cuerpoclaro_daily_records';
  const recommendationNav = document.querySelector('[data-view="recomendaciones"]');
  const targetView = document.getElementById('placeholderView');

  if (!recommendationNav || !targetView) return;

  function getRecords() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_RECORDS)) || {};
      return Object.values(raw)
        .filter((record) => record && record.date)
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch {
      return [];
    }
  }

  function numericValues(records, key) {
    return records
      .map((record) => record[key])
      .filter((value) => value !== null && value !== undefined && value !== '')
      .map(Number)
      .filter(Number.isFinite);
  }

  function average(records, key) {
    const values = numericValues(records, key);
    if (!values.length) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function countValues(records, key, accepted) {
    return records.filter((record) => accepted.includes(record[key])).length;
  }

  function format(value, suffix = '') {
    return value === null ? '—' : `${value.toFixed(1)}${suffix}`;
  }

  function buildRecommendations(records) {
    const recent = records.slice(-14);
    const latest = recent[recent.length - 1] || {};
    const recommendations = [];
    const seen = new Set();

    const add = (item) => {
      if (seen.has(item.id)) return;
      seen.add(item.id);
      recommendations.push(item);
    };

    const energy = average(recent, 'energy');
    const mood = average(recent, 'mood');
    const digestion = average(recent, 'digestion');
    const sleep = average(recent, 'sleep');
    const stress = average(recent, 'stress');
    const pain = average(recent, 'pain');
    const sleepHours = average(recent, 'sleepHours');
    const activity = average(recent, 'activityMinutes');

    if (sleep !== null && sleep <= 5) {
      add({
        id: 'sleep-quality', priority: 'high', area: 'Sueño', title: 'Prioriza regularidad y recuperación',
        reason: `La calidad media del sueño está en ${format(sleep, '/10')}.`,
        actions: ['Mantén horarios de sueño y despertar lo más regulares posible.', 'Reduce cafeína y estimulantes durante la tarde-noche.', 'Deja una franja tranquila antes de acostarte, con menos pantallas y luz intensa.']
      });
    }

    if (sleepHours !== null && sleepHours < 6.5) {
      add({
        id: 'sleep-hours', priority: 'high', area: 'Descanso', title: 'Estás registrando pocas horas de sueño',
        reason: `La media registrada es de ${format(sleepHours, ' h')}.`,
        actions: ['Intenta ampliar gradualmente el tiempo disponible para dormir.', 'Observa durante varios días si al aumentar el descanso cambia tu energía.', 'Si el problema para dormir persiste, conviene comentarlo con un profesional sanitario.']
      });
    }

    if (stress !== null && stress >= 6.5) {
      add({
        id: 'stress', priority: 'high', area: 'Estrés', title: 'Conviene descargar tensión diaria',
        reason: `El estrés medio está en ${format(stress, '/10')}.`,
        actions: ['Introduce pausas breves de respiración lenta o relajación durante el día.', 'Reserva algo de actividad física suave o moderada si te resulta posible.', 'Anota en “Notas” qué situaciones coinciden con los días de mayor estrés para detectar patrones.']
      });
    }

    if (pain !== null && pain >= 5.5) {
      add({
        id: 'pain', priority: 'high', area: 'Dolor', title: 'El dolor merece seguimiento específico',
        reason: `El dolor o molestia media está en ${format(pain, '/10')}.`,
        actions: ['Registra siempre la localización, duración y posibles desencadenantes.', 'Evita usar la aplicación para decidir por tu cuenta cambios de medicación o tratamientos.', 'Si el dolor es intenso, nuevo, persistente o empeora, solicita valoración sanitaria.']
      });
    }

    if (energy !== null && energy <= 4.5) {
      add({
        id: 'energy', priority: 'medium', area: 'Energía', title: 'Apoya la energía con hábitos básicos',
        reason: `La energía media está en ${format(energy, '/10')}.`,
        actions: ['Evita pasar muchas horas sin comer si notas bajones asociados.', 'Prioriza comidas completas con proteína, verduras, fruta, legumbres o cereales integrales según tolerancia.', 'Comprueba si los días con más sueño o actividad moderada coinciden con mejor energía.']
      });
    }

    if (mood !== null && mood <= 4.5) {
      add({
        id: 'mood', priority: 'medium', area: 'Ánimo', title: 'Cuida los factores que sostienen el estado de ánimo',
        reason: `El estado de ánimo medio está en ${format(mood, '/10')}.`,
        actions: ['Mantén contacto social y actividades que te resulten agradables o significativas.', 'Busca exposición a luz natural y movimiento diario cuando sea posible.', 'Si el ánimo bajo es intenso o se mantiene, busca apoyo profesional.']
      });
    }

    if (digestion !== null && digestion <= 5) {
      add({
        id: 'digestion', priority: 'medium', area: 'Digestión', title: 'Simplifica y observa la respuesta digestiva',
        reason: `La digestión media está en ${format(digestion, '/10')}.`,
        actions: ['Come con calma y evita comidas excesivamente grandes si notas pesadez.', 'Aumenta la fibra de forma progresiva, no de golpe, y acompáñala de líquidos.', 'Usa las notas para relacionar alimentos, horarios y síntomas sin asumir que una coincidencia demuestra una intolerancia.']
      });
    }

    const bowelIssues = countValues(recent, 'bowel', ['estrenimiento', 'diarrea', 'irregular', 'dolor']);
    if (bowelIssues >= 2) {
      add({
        id: 'bowel', priority: 'medium', area: 'Tránsito intestinal', title: 'Hay cambios repetidos en las deposiciones',
        reason: `Has registrado alteraciones del tránsito en ${bowelIssues} de los últimos ${recent.length} registros.`,
        actions: ['Mantén una hidratación regular salvo que tengas indicada restricción de líquidos.', 'Revisa cambios recientes de alimentación, horarios, estrés, suplementos o medicación.', 'Consulta si aparecen sangre, fiebre, dolor importante, pérdida de peso no buscada o síntomas persistentes.']
      });
    }

    const darkUrine = countValues(recent, 'urine', ['amarillo-oscuro', 'ambar']);
    if (darkUrine >= 2) {
      add({
        id: 'hydration', priority: 'medium', area: 'Hidratación', title: 'Revisa tu hidratación habitual',
        reason: `Has registrado orina oscura o ámbar en ${darkUrine} días.`,
        actions: ['Distribuye líquidos a lo largo del día en lugar de beber grandes cantidades de golpe.', 'Ten en cuenta calor, ejercicio y sudoración.', 'Si el cambio de color persiste pese a una hidratación adecuada o aparece con otros síntomas, consulta.']
      });
    }

    if (activity !== null && activity < 20) {
      add({
        id: 'activity', priority: 'low', area: 'Actividad', title: 'Añade movimiento de forma progresiva',
        reason: `La actividad media registrada es de ${format(activity, ' min/día')}.`,
        actions: ['Empieza con bloques cortos de paseo o movilidad que puedas mantener.', 'Aumenta tiempo e intensidad poco a poco según tolerancia.', 'Observa si los días activos cambian tu energía, sueño o estado de ánimo.']
      });
    }

    if (!recommendations.length) {
      add({
        id: 'baseline', priority: 'low', area: 'Mantenimiento', title: 'Tus registros no muestran una prioridad clara',
        reason: 'Con los datos actuales no aparece un área que destaque claramente como problemática.',
        actions: ['Mantén horarios regulares de sueño y comidas.', 'Prioriza una alimentación variada y poco procesada.', 'Sigue registrando para que las recomendaciones ganen precisión con el tiempo.']
      });
    }

    if (Number(latest.pain) >= 8) {
      add({
        id: 'pain-alert', priority: 'high', area: 'Aviso', title: 'Último registro de dolor muy alto',
        reason: `El último valor de dolor registrado es ${latest.pain}/10.`,
        actions: ['No ignores un dolor intenso, especialmente si es nuevo o diferente a lo habitual.', 'Busca valoración sanitaria si es persistente, empeora o se acompaña de otros síntomas preocupantes.']
      });
    }

    const order = { high: 0, medium: 1, low: 2 };
    return recommendations.sort((a, b) => order[a.priority] - order[b.priority]).slice(0, 7);
  }

  function getFitotherapyFocus(records) {
    const recent = records.slice(-14);
    const digestion = average(recent, 'digestion');
    const sleep = average(recent, 'sleep');
    const stress = average(recent, 'stress');
    const areas = [];

    if (digestion !== null && digestion <= 5) areas.push('digestión');
    if (sleep !== null && sleep <= 5) areas.push('sueño');
    if (stress !== null && stress >= 6.5) areas.push('estrés');

    return areas;
  }

  function renderRecommendations() {
    const records = getRecords();

    targetView.innerHTML = `
      <section class="section-card recommendations-shell">
        <div class="recommendations-heading">
          <div>
            <h2>Recomendaciones</h2>
            <p>Consejos orientativos generados a partir de tus registros recientes.</p>
          </div>
          <span class="recommendations-badge">Últimos ${Math.min(records.length, 14)} registros</span>
        </div>
        <div id="recommendationsContent"></div>
      </section>`;

    const content = document.getElementById('recommendationsContent');

    if (!records.length) {
      content.innerHTML = `
        <div class="rec-empty">
          <strong>Todavía no hay datos suficientes.</strong><br>
          Completa al menos un registro diario. Con varios días, CuerpoClaro podrá priorizar hábitos y señales que merezcan atención.
        </div>`;
      return;
    }

    const recent = records.slice(-14);
    const cards = buildRecommendations(records);
    const fitotherapyFocus = getFitotherapyFocus(records);
    const signalChips = [
      ['Energía', average(recent, 'energy')],
      ['Ánimo', average(recent, 'mood')],
      ['Digestión', average(recent, 'digestion')],
      ['Sueño', average(recent, 'sleep')],
      ['Estrés', average(recent, 'stress')],
      ['Dolor', average(recent, 'pain')]
    ].filter(([, value]) => value !== null)
      .map(([label, value]) => `<span class="rec-signal">${label}: ${value.toFixed(1)}/10</span>`)
      .join('');

    const cardHtml = cards.map((item) => `
      <article class="recommendation-card priority-${item.priority}">
        <span class="rec-kicker">${item.area}</span>
        <h3>${item.title}</h3>
        <p>${item.reason}</p>
        <ul>${item.actions.map((action) => `<li>${action}</li>`).join('')}</ul>
      </article>`).join('');

    const fitotherapyText = fitotherapyFocus.length
      ? `Los registros señalan ${fitotherapyFocus.join(', ')} como áreas que podrían revisarse desde la fitoterapia.`
      : 'Ahora mismo los registros no señalan una necesidad clara para priorizar fitoterapia.';

    content.innerHTML = `
      <div class="recommendations-notice">
        <strong>Importante:</strong> estas recomendaciones son educativas y no constituyen diagnóstico ni tratamiento. No cambies medicación, suplementos o terapias basándote solo en esta pantalla.
      </div>
      <div class="rec-signals">${signalChips}</div>
      <div class="recommendations-grid">${cardHtml}</div>
      <section class="rec-section">
        <h3>🌿 Fitoterapia: área de revisión</h3>
        <div class="fitotherapy-card">
          <strong>${fitotherapyText}</strong>
          <p>CuerpoClaro no recomienda todavía una planta concreta ni una dosis automáticamente porque falta completar el Perfil con medicación, alergias, antecedentes y otras situaciones que pueden cambiar la seguridad de una planta.</p>
          <p>La siguiente fase será añadir ese perfil de seguridad y después filtrar las opciones de fitoterapia antes de mostrarlas.</p>
        </div>
      </section>
      <section class="rec-section">
        <h3>🍽️ Enfoque de alimentación</h3>
        <p>Como base, la app prioriza regularidad, variedad, alimentos poco procesados, suficiente proteína, vegetales, fruta, legumbres, grasas saludables e hidratación, adaptándolo después a los patrones que vayan apareciendo.</p>
      </section>`;
  }

  recommendationNav.addEventListener('click', () => {
    renderRecommendations();
    targetView.classList.remove('hidden');
  });
})();
