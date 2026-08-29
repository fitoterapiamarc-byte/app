(() => {
  const normalize = (value) => String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const groups = {
    anticoagulants: ['warfarina','acenocumarol','sintrom','fenprocumon','fluindiona','dabigatran','rivaroxaban','apixaban','edoxaban','anticoagulante'],
    antiplatelets: ['clopidogrel','prasugrel','ticagrelor','aspirina','acido acetilsalicilico','adiro','antiagregante'],
    benzodiazepines: ['diazepam','lorazepam','alprazolam','clonazepam','midazolam','bromazepam','lormetazepam','temazepam','benzodiacepina'],
    sedatives: ['zolpidem','zopiclona','barbiturico','fenobarbital','sedante'],
    ssri: ['sertralina','paroxetina','fluoxetina','escitalopram','citalopram','fluvoxamina','isrs','antidepresivo'],
    serotoninergic: ['buspirona','tramadol','triptan','sumatriptan','metadona'],
    antihypertensives: ['enalapril','lisinopril','ramipril','losartan','valsartan','candesartan','amlodipino','nifedipino','bisoprolol','metoprolol','antihipertensivo'],
    diuretics: ['furosemida','torasemida','hidroclorotiazida','indapamida','espironolactona','diuretico'],
    corticosteroids: ['prednisona','prednisolona','dexametasona','metilprednisolona','corticoide','corticosteroide'],
    stimulantLaxatives: ['bisacodilo','picosulfato','laxante estimulante'],
    antiarrhythmics: ['amiodarona','sotalol','quinidina','flecainida','propafenona','antiarritmico'],
    cardiacGlycosides: ['digoxina','digitoxina','cardiotonico'],
    antidiabetics: ['metformina','insulina','gliclazida','glimepirida','empagliflozina','dapagliflozina','semaglutida','liraglutida','antidiabetico'],
    thyroid: ['levotiroxina','eutirox','tiroxina','hormona tiroidea'],
    immunosuppressants: ['ciclosporina','tacrolimus','sirolimus','everolimus','inmunosupresor'],
    hivProtease: ['ritonavir','saquinavir','indinavir','fosamprenavir','inhibidor de la proteasa'],
    oncologyCyp: ['irinotecan','imatinib','citostatico'],
    otherHypericum: ['simvastatina','fexofenadina','finasterida','teofilina'],
    gaba: ['barbiturico','fenobarbital','diazepam','lorazepam','alprazolam','clonazepam','benzodiacepina'],
    ccb: ['nifedipino','amlodipino','verapamilo','diltiazem','bloqueador de los canales de calcio'],
    lithium: ['litio'],
    carbamazepine: ['carbamazepina'],
    ppiH2: ['omeprazol','pantoprazol','esomeprazol','lansoprazol','famotidina','antagonista h2','inhibidor de la bomba de protones','antiacido'],
    efavirenz: ['efavirenz'],
    specificGinger: ['ciclosporina','tacrolimus','metronidazol','fluconazol','crizotinib']
  };

  function matches(text, list) {
    return list.some((term) => text.includes(normalize(term)));
  }

  function hit(level, title, detail, source) {
    return { level, title, detail, source };
  }

  const rules = {
    valeriana(text) {
      if (matches(text, [...groups.benzodiazepines, ...groups.sedatives])) return [hit('consider','Supervisión médica','La tabla EMA/ESCOP indica que la combinación de raíz de valeriana con sedantes sintéticos requiere supervisión médica.','Fitoterapia.net 2026')];
      return [];
    },
    pasiflora() { return []; },
    melisa() { return []; },
    'menta-hoja'() { return []; },
    'menta-aceite'(text) {
      if (matches(text, groups.ppiH2)) return [hit('monitor','Separar/revisar la administración','El aceite esencial de menta en formas entéricas puede liberar prematuramente su contenido con antiácidos, antagonistas H2 o inhibidores de la bomba de protones.','Fitoterapia.net 2026')];
      return [];
    },
    ispagula(text) {
      const hits = [];
      if (text.trim()) hits.push(hit('monitor','Separar de otros medicamentos','Ispágula puede retrasar la absorción de medicamentos y minerales; la tabla recomienda separación temporal.','Fitoterapia.net 2026'));
      if (matches(text, groups.antidiabetics)) hits.push(hit('monitor','Control glucémico','Con tratamiento antidiabético puede requerirse supervisión y ajuste.','Fitoterapia.net 2026'));
      if (matches(text, groups.thyroid)) hits.push(hit('monitor','Hormona tiroidea','El uso concomitante requiere supervisión porque puede ser necesario ajustar la dosis.','Fitoterapia.net 2026'));
      if (matches(text, [...groups.lithium, ...groups.carbamazepine, ...groups.anticoagulants])) hits.push(hit('monitor','Absorción del medicamento','La tabla cita litio, carbamazepina y derivados cumarínicos entre los fármacos cuya absorción puede retrasarse.','Fitoterapia.net 2026'));
      return hits;
    },
    jengibre(text) {
      if (matches(text, [...groups.anticoagulants, ...groups.antiplatelets, ...groups.ccb, ...groups.antidiabetics, ...groups.specificGinger])) {
        return [hit('consider','Interacción teórica / precaución','ESCOP recoge riesgos teóricos con varios fármacos; no deben presentarse como interacción clínica demostrada, pero justifican revisión.','Fitoterapia.net 2026')];
      }
      return [];
    },
    ajo(text) {
      const hits = [];
      if (matches(text, [...groups.anticoagulants, ...groups.antiplatelets])) hits.push(hit('monitor','Riesgo de sangrado','La tabla recomienda precaución con anticoagulantes o antiagregantes por posible aumento del tiempo de sangrado.','Fitoterapia.net 2026'));
      if (matches(text, groups.hivProtease)) hits.push(hit('avoid','Evitar asociación','EMA contraindica el uso concomitante de preparados de ajo con saquinavir/ritonavir por riesgo de reducción de concentraciones plasmáticas y pérdida de respuesta.','Fitoterapia.net 2026'));
      return hits;
    },
    ginkgo(text) {
      const hits = [];
      if (matches(text, [...groups.anticoagulants, ...groups.antiplatelets])) hits.push(hit('monitor','Precaución con hemostasia','La tabla recomienda precaución con anticoagulantes y antiagregantes; los estudios con warfarina no muestran una interacción consistente, pero se aconseja vigilancia al iniciar o cambiar dosis.','Fitoterapia.net 2026'));
      if (text.includes('dabigatran')) hits.push(hit('monitor','Posible aumento de exposición','EMA señala posible inhibición intestinal de P-gp y recomienda precaución con dabigatrán.','Fitoterapia.net 2026'));
      if (text.includes('nifedipino')) hits.push(hit('monitor','Posible aumento de exposición','Se han observado aumentos de Cmax de nifedipino en algunos individuos.','Fitoterapia.net 2026'));
      if (matches(text, groups.efavirenz)) hits.push(hit('avoid','No recomendado','No se recomienda el uso concomitante con efavirenz por posible reducción de sus concentraciones plasmáticas.','Fitoterapia.net 2026'));
      return hits;
    },
    regaliz(text) {
      if (matches(text, [...groups.antihypertensives, ...groups.diuretics, ...groups.corticosteroids, ...groups.stimulantLaxatives, ...groups.antiarrhythmics, ...groups.cardiacGlycosides])) {
        return [hit('monitor','Interacción clínicamente relevante','La raíz de regaliz puede contrarrestar antihipertensivos y favorecer alteraciones de potasio; la tabla desaconseja combinarla con diuréticos, cardiotónicos, corticoides, laxantes estimulantes y fármacos que agraven el desequilibrio electrolítico.','Fitoterapia.net 2026')];
      }
      return [];
    },
    sen(text) {
      if (matches(text, [...groups.diuretics, ...groups.corticosteroids, ...groups.antiarrhythmics, ...groups.cardiacGlycosides])) {
        return [hit('monitor','Riesgo por hipopotasemia','El abuso o uso prolongado de sen puede causar hipopotasemia y potenciar cardiotónicos o interaccionar con antiarrítmicos; diuréticos y corticoides pueden agravarla.','Fitoterapia.net 2026')];
      }
      return [];
    },
    hiperico(text) {
      const hits = [];
      if (matches(text, [...groups.anticoagulants, ...groups.immunosuppressants, ...groups.hivProtease, ...groups.oncologyCyp])) hits.push(hit('avoid','Asociación a evitar/contraindicada','Preparados de hipérico con hiperforina relevante inducen CYP y P-gp; la tabla recoge asociaciones contraindicadas o a evitar con estos grupos.','Fitoterapia.net 2026'));
      if (matches(text, [...groups.ssri, ...groups.serotoninergic])) hits.push(hit('avoid','Riesgo serotoninérgico','Los preparados de hipérico pueden contribuir a efectos serotoninérgicos cuando se combinan con antidepresivos serotoninérgicos u otros fármacos de este tipo.','Fitoterapia.net 2026'));
      if (matches(text, [...groups.benzodiazepines, ...groups.otherHypericum, ...groups.cardiacGlycosides])) hits.push(hit('monitor','Posible reducción o cambio de exposición','La inducción enzimática/P-gp puede modificar concentraciones de diversos medicamentos; la tabla cita, entre otros, benzodiazepinas, simvastatina, digoxina y teofilina.','Fitoterapia.net 2026'));
      return hits;
    },
    salvia(text) {
      if (matches(text, groups.gaba)) return [hit('consider','Precaución teórica','Para hoja/aceite esencial de salvia se describe una precaución no confirmada clínicamente con medicamentos activos sobre receptores GABA.','Fitoterapia.net 2026')];
      return [];
    },
    sauce(text) {
      if (matches(text, groups.anticoagulants)) return [hit('consider','Posible aumento de efecto anticoagulante','EMA indica que la corteza de sauce puede aumentar el efecto de anticoagulantes cumarínicos; la repercusión de la tabla es de valoración.','Fitoterapia.net 2026')];
      return [];
    },
    curcuma() { return []; },
    equinacea() { return []; },
    harpagofito() { return []; },
    espino() { return []; },
    lavanda() { return []; }
  };

  const priority = { avoid: 4, monitor: 3, consider: 2, none: 1, unknown: 0 };

  function evaluate(plantId, medications) {
    const text = normalize(medications);
    if (!text.trim()) return { level: 'none', hits: [], message: 'No hay medicación habitual registrada.' };
    const rule = rules[plantId];
    if (!rule) return { level: 'unknown', hits: [], message: 'Esta planta todavía no tiene reglas automáticas específicas en el motor.' };
    const hits = rule(text);
    if (!hits.length) return { level: 'none', hits: [], message: 'No se ha detectado una interacción entre la medicación escrita y las reglas mapeadas para esta planta. Esto NO demuestra ausencia de interacción.' };
    const level = hits.reduce((best, item) => priority[item.level] > priority[best] ? item.level : best, 'unknown');
    return { level, hits, message: hits.map((h) => h.detail).join(' ') };
  }

  window.CuerpoClaroInteractions = {
    version: '2026-08-29',
    source: 'Vanaclocha B, Cañigueral S. Tabla de interacciones entre preparados vegetales y fármacos de síntesis, basada en monografías EMA y ESCOP. Actualizada 30/06/2026.',
    sourceUrl: 'https://www.fitoterapia.net/publicaciones/documentacion/tabla-interacciones-entre-preparados-vegetales-2047.html',
    evaluate
  };
})();