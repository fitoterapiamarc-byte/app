(() => {
  const interactionTable = {
    name: 'Tabla de interacciones Fitoterapia.net (EMA/ESCOP)',
    updated: '2026-06-30',
    url: 'https://www.fitoterapia.net/publicaciones/documentacion/tabla-interacciones-entre-preparados-vegetales-2047.html'
  };

  const vademecum = 'https://www.fitoterapia.net/vademecum/';

  const plants = [
    {
      id:'valeriana', commonName:'Valeriana', scientificName:'Valeriana officinalis L.', drug:'Raíz (Valerianae radix)', areas:['sleep','stress'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa la raíz de valeriana en trastornos del sueño e insomnio temporal y estrés mental/alteraciones del ánimo, según la preparación.',
      interactionStatus:'review', interactionNote:'La tabla EMA/ESCOP indica datos limitados y que la combinación con sedantes sintéticos requiere supervisión médica.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/valerianae-radix', sourceInteraction:interactionTable.url
    },
    {
      id:'pasiflora', commonName:'Pasiflora', scientificName:'Passiflora incarnata L.', drug:'Parte aérea (Passiflorae herba)', areas:['sleep','stress'],
      evidenceLabel:'Uso tradicional reconocido por EMA', evidenceNote:'EMA reconoce el uso tradicional de la parte aérea para síntomas leves de estrés mental y para ayudar a conciliar el sueño.',
      interactionStatus:'none-described', interactionNote:'La tabla EMA/ESCOP 2026 no describe interacciones para la parte aérea de Passiflora incarnata.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/passiflorae-herba', sourceInteraction:interactionTable.url
    },
    {
      id:'melisa', commonName:'Melisa', scientificName:'Melissa officinalis L.', drug:'Hoja (Melissae folium)', areas:['sleep','stress','digestion'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA incluye la hoja de melisa en sueño/insomnio temporal, estrés mental y trastornos gastrointestinales.',
      interactionStatus:'none-described', interactionNote:'La tabla EMA/ESCOP 2026 no describe interacciones para la hoja de melisa.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/melissae-folium', sourceInteraction:interactionTable.url
    },
    {
      id:'lavanda', commonName:'Lavanda', scientificName:'Lavandula angustifolia Mill.', drug:'Flor / aceite esencial', areas:['sleep','stress'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa lavanda en trastornos del sueño e insomnio temporal y estrés mental/alteraciones del ánimo.',
      interactionStatus:'none-described', interactionNote:'La tabla EMA/ESCOP 2026 no describe interacciones para flor ni aceite esencial de lavanda.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/lavandulae-flos', sourceInteraction:interactionTable.url
    },
    {
      id:'menta-hoja', commonName:'Menta piperita', scientificName:'Mentha x piperita L.', drug:'Hoja (Menthae piperitae folium)', areas:['digestion'],
      evidenceLabel:'Uso tradicional reconocido por EMA', evidenceNote:'EMA reconoce el uso tradicional de la hoja para molestias digestivas como indigestión y flatulencia.',
      interactionStatus:'none-described', interactionNote:'La tabla EMA/ESCOP 2026 no describe interacciones para la hoja. No debe confundirse con el aceite esencial.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/menthae-piperitae-folium', sourceInteraction:interactionTable.url
    },
    {
      id:'menta-aceite', commonName:'Menta piperita (aceite esencial)', scientificName:'Mentha x piperita L.', drug:'Aceite esencial', areas:['digestion'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'El aceite esencial tiene monografía propia y precauciones distintas de la hoja.',
      interactionStatus:'monitor', interactionNote:'La tabla aconseja evitar la administración de cápsulas entéricas junto con comida, antiácidos, antagonistas H2 o inhibidores de la bomba de protones por posible liberación prematura.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/menthae-piperitae-aetheroleum', sourceInteraction:interactionTable.url
    },
    {
      id:'ispagula', commonName:'Ispágula', scientificName:'Plantago ovata Forssk.', drug:'Semilla / cutícula de la semilla', areas:['constipation'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA dispone de monografías europeas para semilla y cutícula de ispágula en estreñimiento.',
      interactionStatus:'monitor', interactionNote:'Puede retrasar la absorción de medicamentos y minerales; la tabla recomienda separación temporal y supervisión con tratamiento antidiabético u hormonas tiroideas.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/plantaginis-ovatae-semen', sourceInteraction:interactionTable.url
    },
    {
      id:'sen', commonName:'Sen', scientificName:'Senna alexandrina Mill.', drug:'Hoja / fruto', areas:['constipation'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa la hoja de sen en el área terapéutica de estreñimiento.',
      interactionStatus:'monitor', interactionNote:'El uso abusivo o prolongado puede producir hipopotasemia y potenciar cardiotónicos o interaccionar con antiarrítmicos; diuréticos y corticoides pueden agravarla.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/sennae-folium', sourceInteraction:interactionTable.url
    },
    {
      id:'jengibre', commonName:'Jengibre', scientificName:'Zingiber officinale Roscoe', drug:'Rizoma (Zingiberis rhizoma)', areas:['digestion','nausea'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA recoge prevención de náuseas y vómitos por cinetosis para determinadas preparaciones y uso tradicional en molestias gastrointestinales leves, hinchazón y flatulencia.',
      interactionStatus:'evidence-limited', interactionNote:'EMA no describe interacciones; ESCOP recoge riesgos teóricos con varios fármacos. La app los marca como teóricos, no como interacción clínica demostrada.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/zingiberis-rhizoma', sourceInteraction:interactionTable.url
    },
    {
      id:'curcuma', commonName:'Cúrcuma india', scientificName:'Curcuma longa L.', drug:'Rizoma', areas:['digestion'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa el rizoma de cúrcuma en trastornos gastrointestinales.',
      interactionStatus:'none-described', interactionNote:'La tabla EMA/ESCOP 2026 no describe interacciones para Curcuma longa rizoma.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/curcumae-longae-rhizoma', sourceInteraction:interactionTable.url
    },
    {
      id:'harpagofito', commonName:'Harpagofito', scientificName:'Harpagophytum procumbens DC.; H. zeyheri Decne.', drug:'Raíz', areas:['pain','digestion'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa la raíz de harpagofito en dolor e inflamación, trastornos gastrointestinales y pérdida de apetito.',
      interactionStatus:'none-described', interactionNote:'La tabla EMA/ESCOP 2026 no describe interacciones para la raíz de harpagofito.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/harpagophyti-radix', sourceInteraction:interactionTable.url
    },
    {
      id:'ajo', commonName:'Ajo', scientificName:'Allium sativum L.', drug:'Bulbo', areas:['circulation'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa el bulbo de ajo en trastornos circulatorios y tos/resfriado.',
      interactionStatus:'monitor', interactionNote:'La tabla recomienda precaución con anticoagulantes/antiagregantes y recoge contraindicaciones con determinados antirretrovirales.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/allii-sativi-bulbus', sourceInteraction:interactionTable.url
    },
    {
      id:'ginkgo', commonName:'Ginkgo', scientificName:'Ginkgo biloba L.', drug:'Hoja', areas:['circulation'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa la hoja de ginkgo en trastornos circulatorios.',
      interactionStatus:'monitor', interactionNote:'La tabla recomienda vigilancia con anticoagulantes/antiagregantes y recoge precauciones específicas con dabigatrán, nifedipino y efavirenz.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/ginkgo-folium', sourceInteraction:interactionTable.url
    },
    {
      id:'regaliz', commonName:'Regaliz', scientificName:'Glycyrrhiza glabra L.; G. inflata Bat.; G. uralensis Fisch.', drug:'Raíz', areas:['digestion','cough'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa la raíz de regaliz en tos/resfriado y trastornos gastrointestinales.',
      interactionStatus:'monitor', interactionNote:'Puede contrarrestar antihipertensivos y favorecer desequilibrio de potasio; la tabla desaconseja combinarla con diuréticos, cardiotónicos, corticoides y otros fármacos relevantes.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/liquiritiae-radix', sourceInteraction:interactionTable.url
    },
    {
      id:'hiperico', commonName:'Hipérico', scientificName:'Hypericum perforatum L.', drug:'Parte aérea', areas:['mood','stress'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA dispone de monografía europea para hipérico en estrés mental/alteraciones del ánimo, además de otras áreas según preparación y vía.',
      interactionStatus:'avoid', interactionNote:'Es una de las plantas con mayor potencial de interacciones: induce CYP/P-gp y puede modificar numerosos medicamentos; algunas asociaciones están contraindicadas o deben evitarse.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/hyperici-herba-0', sourceInteraction:interactionTable.url
    },
    {
      id:'espino', commonName:'Espino albar', scientificName:'Crataegus spp.', drug:'Hoja con flor', areas:['circulation','stress'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa hoja y flor de espino en trastornos circulatorios y estrés mental/alteraciones del ánimo.',
      interactionStatus:'none-described', interactionNote:'La tabla EMA/ESCOP 2026 no describe interacciones para la sumidad florida de espino albar.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/crataegi-folium-cum-flore', sourceInteraction:interactionTable.url
    },
    {
      id:'equinacea', commonName:'Equinácea purpúrea', scientificName:'Echinacea purpurea (L.) Moench', drug:'Parte aérea / raíz', areas:['cold'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa Echinacea purpurea en tos/resfriado y, según droga y vía, piel/heridas menores.',
      interactionStatus:'none-described', interactionNote:'La tabla EMA/ESCOP 2026 no describe interacciones clínicamente relevantes para las drogas revisadas de Echinacea purpurea.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/echinaceae-purpureae-herba', sourceInteraction:interactionTable.url
    },
    {
      id:'salvia', commonName:'Salvia', scientificName:'Salvia officinalis L.', drug:'Hoja', areas:['digestion','mouth'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa la hoja de salvia en trastornos gastrointestinales, boca/garganta y piel/heridas menores.',
      interactionStatus:'evidence-limited', interactionNote:'La tabla recoge una precaución no confirmada clínicamente con fármacos activos sobre receptores GABA.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/salviae-officinalis-folium', sourceInteraction:interactionTable.url
    },
    {
      id:'sauce', commonName:'Sauce', scientificName:'Salix spp.', drug:'Corteza', areas:['pain','cold'],
      evidenceLabel:'Monografía UE / EMA', evidenceNote:'EMA sitúa la corteza de sauce en dolor/inflamación y tos/resfriado.',
      interactionStatus:'evidence-limited', interactionNote:'La tabla indica que puede aumentar el efecto de anticoagulantes cumarínicos; lo clasifica como situación a valorar.',
      sourceVademecum:vademecum, sourceEMA:'https://www.ema.europa.eu/en/medicines/herbal/salicis-cortex', sourceInteraction:interactionTable.url
    }
  ];

  window.CuerpoClaroPhytotherapyData = {
    version:'2026-08-29-v1',
    methodology:'Solo se incorporan áreas terapéuticas y datos de seguridad trazables a Vademécum/Fitoterapia.net, EMA y la tabla EMA/ESCOP. “Uso tradicional” se mantiene como tal. Los datos teóricos se etiquetan como teóricos y “no descrito” nunca significa “imposible”.',
    interactionTable,
    plants
  };
})();