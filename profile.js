(() => {
  const STORAGE_PROFILE = 'cuerpoclaro_health_profile';
  const profileNav = document.querySelector('[data-view="perfil"]');
  const targetView = document.getElementById('placeholderView');

  if (!profileNav || !targetView) return;

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PROFILE)) || {};
    } catch {
      return {};
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
  }

  function text(value) {
    return String(value || '').trim();
  }

  function getCompleteness(profile) {
    const required = [
      ['birthYear', 'año de nacimiento'],
      ['medications', 'medicación habitual'],
      ['allergies', 'alergias'],
      ['conditions', 'antecedentes o diagnósticos relevantes']
    ];

    const missing = required
      .filter(([key]) => !text(profile[key]))
      .map(([, label]) => label);

    const answered = required.length - missing.length;
    return {
      percent: Math.round((answered / required.length) * 100),
      missing,
      complete: missing.length === 0
    };
  }

  function getRiskFlags(profile) {
    const flags = [];
    if (profile.pregnant) flags.push('embarazo');
    if (profile.breastfeeding) flags.push('lactancia');
    if (profile.kidneyDisease) flags.push('enfermedad renal');
    if (profile.liverDisease) flags.push('enfermedad hepática');
    if (profile.anticoagulants) flags.push('tratamiento anticoagulante/antiagregante');
    if (profile.multipleMedications) flags.push('varios medicamentos habituales');
    return flags;
  }

  function renderProfile() {
    const profile = getProfile();
    const completeness = getCompleteness(profile);
    const riskFlags = getRiskFlags(profile);

    targetView.innerHTML = `
      <section class="section-card profile-shell">
        <div class="profile-heading">
          <div>
            <h2>Perfil de salud y seguridad</h2>
            <p>Estos datos sirven para que CuerpoClaro pueda filtrar recomendaciones y evitar sugerencias inadecuadas.</p>
          </div>
          <span class="profile-status">Perfil ${completeness.percent}%</span>
        </div>

        <div class="profile-notice">
          <strong>Privacidad:</strong> este prototipo guarda el perfil únicamente en este navegador mediante almacenamiento local. No se envía a un servidor.
        </div>

        <div class="profile-completeness">
          <div class="profile-progress"><span style="width:${completeness.percent}%"></span></div>
          <div class="profile-missing">${completeness.complete ? 'Datos básicos de seguridad completados.' : `Falta completar: ${completeness.missing.join(', ')}.`}</div>
        </div>

        ${riskFlags.length ? `<div class="profile-risk"><strong>Atención de seguridad</strong>El perfil contiene factores que obligan a extremar la precaución antes de mostrar fitoterapia: ${riskFlags.join(', ')}.</div>` : ''}

        <form id="healthProfileForm" class="profile-form">
          <section class="profile-section">
            <h3>Datos básicos</h3>
            <div class="profile-grid">
              <label class="profile-field"><span>Nombre o alias <small>opcional</small></span><input id="profileName" type="text" maxlength="80" value="${escapeHtml(profile.name || '')}" placeholder="Cómo quieres que te llame la app"></label>
              <label class="profile-field"><span>Año de nacimiento</span><input id="profileBirthYear" type="number" min="1900" max="2100" value="${escapeHtml(profile.birthYear || '')}" placeholder="Ej. 1975"></label>
              <label class="profile-field"><span>Sexo biológico <small>opcional</small></span><select id="profileSex"><option value="">Sin indicar</option><option value="female" ${profile.sex === 'female' ? 'selected' : ''}>Femenino</option><option value="male" ${profile.sex === 'male' ? 'selected' : ''}>Masculino</option><option value="other" ${profile.sex === 'other' ? 'selected' : ''}>Otro / no aplicable</option></select></label>
              <label class="profile-field"><span>Altura (cm) <small>opcional</small></span><input id="profileHeight" type="number" min="100" max="250" step="1" value="${escapeHtml(profile.height || '')}" placeholder="Ej. 172"></label>
            </div>
          </section>

          <section class="profile-section">
            <h3>Medicaciones y productos</h3>
            <div class="profile-grid">
              <label class="profile-field"><span>Medicación habitual</span><textarea id="profileMedications" maxlength="1500" placeholder="Nombre, dosis si la conoces y frecuencia. Si no tomas, escribe: Ninguna">${escapeHtml(profile.medications || '')}</textarea></label>
              <label class="profile-field"><span>Suplementos o plantas <small>opcional</small></span><textarea id="profileSupplements" maxlength="1500" placeholder="Vitaminas, minerales, plantas, infusiones o complementos">${escapeHtml(profile.supplements || '')}</textarea></label>
            </div>
          </section>

          <section class="profile-section">
            <h3>Alergias y antecedentes</h3>
            <div class="profile-grid">
              <label class="profile-field"><span>Alergias</span><textarea id="profileAllergies" maxlength="1200" placeholder="Medicamentos, alimentos, plantas... Si no conoces ninguna, escribe: Ninguna conocida">${escapeHtml(profile.allergies || '')}</textarea></label>
              <label class="profile-field"><span>Antecedentes o diagnósticos relevantes</span><textarea id="profileConditions" maxlength="1800" placeholder="Enfermedades crónicas, cirugías relevantes o problemas de salud importantes. Si no hay, escribe: Ninguno conocido">${escapeHtml(profile.conditions || '')}</textarea></label>
            </div>
          </section>

          <section class="profile-section">
            <h3>Filtros de seguridad para fitoterapia</h3>
            <div class="profile-checks">
              <label class="profile-check"><input id="profilePregnant" type="checkbox" ${profile.pregnant ? 'checked' : ''}><span>Embarazo o posibilidad de embarazo</span></label>
              <label class="profile-check"><input id="profileBreastfeeding" type="checkbox" ${profile.breastfeeding ? 'checked' : ''}><span>Lactancia</span></label>
              <label class="profile-check"><input id="profileKidney" type="checkbox" ${profile.kidneyDisease ? 'checked' : ''}><span>Enfermedad renal conocida</span></label>
              <label class="profile-check"><input id="profileLiver" type="checkbox" ${profile.liverDisease ? 'checked' : ''}><span>Enfermedad hepática conocida</span></label>
              <label class="profile-check"><input id="profileAnticoagulants" type="checkbox" ${profile.anticoagulants ? 'checked' : ''}><span>Anticoagulantes o antiagregantes</span></label>
              <label class="profile-check"><input id="profileMultipleMeds" type="checkbox" ${profile.multipleMedications ? 'checked' : ''}><span>Tres o más medicamentos habituales</span></label>
            </div>
          </section>

          <div id="profileMessage" class="profile-message" role="status"></div>
          <div class="profile-actions">
            <button class="btn btn-primary profile-save" type="submit">Guardar perfil</button>
            <button id="deleteProfileBtn" class="btn profile-delete" type="button">Borrar solo el perfil</button>
          </div>
        </form>
      </section>`;

    const form = document.getElementById('healthProfileForm');
    const message = document.getElementById('profileMessage');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const birthYear = document.getElementById('profileBirthYear').value;
      const nowYear = new Date().getFullYear();

      if (birthYear && (Number(birthYear) < 1900 || Number(birthYear) > nowYear)) {
        message.textContent = 'Revisa el año de nacimiento.';
        return;
      }

      const updated = {
        name: text(document.getElementById('profileName').value),
        birthYear: text(birthYear),
        sex: document.getElementById('profileSex').value,
        height: text(document.getElementById('profileHeight').value),
        medications: text(document.getElementById('profileMedications').value),
        supplements: text(document.getElementById('profileSupplements').value),
        allergies: text(document.getElementById('profileAllergies').value),
        conditions: text(document.getElementById('profileConditions').value),
        pregnant: document.getElementById('profilePregnant').checked,
        breastfeeding: document.getElementById('profileBreastfeeding').checked,
        kidneyDisease: document.getElementById('profileKidney').checked,
        liverDisease: document.getElementById('profileLiver').checked,
        anticoagulants: document.getElementById('profileAnticoagulants').checked,
        multipleMedications: document.getElementById('profileMultipleMeds').checked,
        updatedAt: new Date().toISOString()
      };

      saveProfile(updated);
      message.textContent = '✓ Perfil guardado correctamente en este dispositivo.';
      setTimeout(renderProfile, 900);
    });

    document.getElementById('deleteProfileBtn').addEventListener('click', () => {
      if (!confirm('¿Quieres borrar el perfil de salud guardado en este navegador? Los registros diarios no se borrarán.')) return;
      localStorage.removeItem(STORAGE_PROFILE);
      renderProfile();
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  window.CuerpoClaroProfile = {
    storageKey: STORAGE_PROFILE,
    getProfile,
    getCompleteness,
    getRiskFlags
  };

  profileNav.addEventListener('click', () => {
    renderProfile();
    targetView.classList.remove('hidden');
  });
})();