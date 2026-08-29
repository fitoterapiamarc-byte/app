(() => {
  const interactionTable = {
    name: 'Tabla de interacciones Fitoterapia.net (EMA/ESCOP)',
    updated: '2026-06-30',
    url: 'https://www.fitoterapia.net/publicaciones/documentacion/tabla-interacciones-entre-preparados-vegetales-2047.html'
  };

  const plants = [
    {
      id: 'valeriana',
      commonName: 'Valeriana',
      scientificName: 'Valeriana officinalis L.',
      drug: 'Raíz (Valerianae radix)',
      areas: ['sleep', 'stress'],
      evidenceLabel: 'Monografía UE / EMA',
      evidenceNote: 'La EMA contempla preparados de raíz de valeriana para trastornos del sueño e insomnio temporal y para estrés mental/alteraciones del ánimo según la preparación autorizada.',
      interactionStatus: 'review',
      interactionNote: 'La tabla Fitoterapia.net 2026 indica que no se han observado interacciones clínicamente relevantes con varias vías CYP estudiadas, pero la combinación con sedantes sintéticos requiere supervisión médica.',
      sourceVademecum: 'https://www.fitoterapia.net/vademecum/plantas/valeriana/index.html',
      sourceEMA: 'https://www.ema.europa.eu/es/medicines/herbal/valerianae-radix',
      sourceInteraction: interactionTable.url
    },
    {
      id: 'pasiflora',
      commonName: 'Pasiflora',
      scientificName: 'Passiflora incarnata L.',
      drug: 'Parte aérea (Passiflorae herba)',
      areas: ['sleep', 'stress'],
      evidenceLabel: 'Uso tradicional reconocido por EMA',
      evidenceNote: 'La EMA reconoce el uso tradicional de la parte aérea de pasiflora para aliviar síntomas leves de estrés mental y ayudar a conciliar el sueño.',
      interactionStatus: 'none-described',
      interactionNote: 'La tabla Fitoterapia.net 2026 basada en EMA y ESCOP no describe interacciones para la parte aérea de Passiflora incarnata. La ausencia de interacciones descritas no excluye todas las posibilidades en personas polimedicadas.',
      sourceVademecum: 'https://www.fitoterapia.net/vademecum/plantas/pasiflora.html',
      sourceEMA: 'https://www.ema.europa.eu/es/medicines/herbal/passiflorae-herba',
      sourceInteraction: interactionTable.url
    },
    {
      id: 'melisa',
      commonName: 'Melisa',
      scientificName: 'Melissa officinalis L.',
      drug: 'Hoja (Melissae folium)',
      areas: ['sleep', 'stress', 'digestion'],
      evidenceLabel: 'Monografía UE / EMA',
      evidenceNote: 'La monografía europea de hoja de melisa incluye áreas de sueño/insomnio temporal, estrés mental y trastornos gastrointestinales.',
      interactionStatus: 'none-described',
      interactionNote: 'La tabla Fitoterapia.net 2026 basada en EMA y ESCOP no describe interacciones para la hoja de melisa.',
      sourceVademecum: 'https://www.fitoterapia.net/vademecum/plantas/melisa.html',
      sourceEMA: 'https://www.ema.europa.eu/es/medicines/herbal/melissae-folium',
      sourceInteraction: interactionTable.url
    },
    {
      id: 'menta-hoja',
      commonName: 'Menta piperita',
      scientificName: 'Mentha x piperita L.',
      drug: 'Hoja (Menthae piperitae folium)',
      areas: ['digestion'],
      evidenceLabel: 'Uso tradicional reconocido por EMA',
      evidenceNote: 'La EMA reconoce el uso tradicional de preparados de hoja de menta piperita para molestias digestivas como indigestión y flatulencia.',
      interactionStatus: 'none-described',
      interactionNote: 'La tabla Fitoterapia.net 2026 no describe interacciones para la hoja. Esto no debe confundirse con el aceite esencial de menta, que tiene precauciones específicas distintas.',
      sourceVademecum: 'https://www.fitoterapia.net/vademecum/plantas/menta-piperita/index.html',
      sourceEMA: 'https://www.ema.europa.eu/en/medicines/herbal/menthae-piperitae-folium',
      sourceInteraction: interactionTable.url
    },
    {
      id: 'ispagula',
      commonName: 'Ispágula',
      scientificName: 'Plantago ovata Forssk.',
      drug: 'Semilla / cutícula de la semilla',
      areas: ['constipation'],
      evidenceLabel: 'Monografía UE / EMA',
      evidenceNote: 'La EMA dispone de monografía europea para la semilla de ispágula en el área terapéutica de estreñimiento.',
      interactionStatus: 'monitor',
      interactionNote: 'La tabla Fitoterapia.net 2026 advierte que semilla y cutícula pueden retrasar la absorción de medicamentos y minerales administrados de forma concomitante; además requiere especial control con tratamiento antidiabético y hormonas tiroideas.',
      sourceVademecum: 'https://www.fitoterapia.net/vademecum/plantas/ispagula.html',
      sourceEMA: 'https://www.ema.europa.eu/en/medicines/herbal/plantaginis-ovatae-semen',
      sourceInteraction: interactionTable.url
    },
    {
      id: 'jengibre',
      commonName: 'Jengibre',
      scientificName: 'Zingiber officinale Roscoe',
      drug: 'Rizoma (Zingiberis rhizoma)',
      areas: ['digestion', 'nausea'],
      evidenceLabel: 'Monografía UE / EMA',
      evidenceNote: 'La EMA reconoce el polvo de rizoma de jengibre para prevención de náuseas y vómitos por cinetosis; también recoge uso tradicional para molestias gastrointestinales leves y espasmódicas, hinchazón y flatulencia.',
      interactionStatus: 'evidence-limited',
      interactionNote: 'La tabla Fitoterapia.net 2026 señala que EMA no describe interacciones y que ESCOP recoge riesgos teóricos. CuerpoClaro no los presenta como interacciones clínicamente demostradas.',
      sourceVademecum: 'https://www.fitoterapia.net/vademecum/plantas/jengibre.html',
      sourceEMA: 'https://www.ema.europa.eu/es/medicines/herbal/zingiberis-rhizoma',
      sourceInteraction: interactionTable.url
    }
  ];

  window.CuerpoClaroPhytotherapyData = {
    version: '2026-08-29',
    methodology: 'Solo se incorporan indicaciones y datos de seguridad trazables a Fitoterapia.net/Vademécum, EMA y la tabla de interacciones EMA/ESCOP. Los datos teóricos se identifican como tales y no se muestran como interacción demostrada.',
    interactionTable,
    plants
  };
})();