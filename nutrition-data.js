(() => {
  window.CuerpoClaroNutritionData = {
    version: '2026-08-29-v1',
    scope: 'adult-general',
    sources: [
      {
        id: 'who-healthy-diet-2026',
        label: 'OMS — Alimentación saludable (2026)',
        url: 'https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet',
        facts: {
          fruitVegetables: 'Al menos 400 g/día de frutas y verduras en mayores de 10 años.',
          fibre: 'Al menos 25 g/día de fibra dietética natural en mayores de 10 años.',
          freeSugars: 'Azúcares libres por debajo del 10% de la energía diaria; reducir al 5% puede aportar beneficios adicionales.',
          salt: 'En adultos, menos de 5 g/día de sal (menos de 2 g/día de sodio).',
          pattern: 'Priorizar cereales integrales, verduras, frutas y legumbres; limitar ultraprocesados ricos en sodio, azúcares libres y grasas no saludables.'
        }
      },
      {
        id: 'aesan-2022',
        label: 'AESAN — Recomendaciones dietéticas sostenibles para población española',
        url: 'https://www.aesan.gob.es/nutricion/recomendaciones-dieteticas',
        facts: {
          vegetables: 'Al menos 3 raciones/día de hortalizas.',
          fruit: '2-3 raciones/día de fruta.',
          legumes: 'Al menos 4 raciones/semana, pudiendo avanzar hacia consumo diario.',
          wholeGrains: 'Priorizar cereales integrales/de grano entero.',
          nuts: '3 o más raciones/semana, sin sal, azúcares ni grasas añadidas.',
          fish: '3 o más raciones/semana, priorizando pescado azul y especies de menor impacto ambiental.',
          meat: 'Máximo 3 raciones/semana, priorizando aves/conejo y minimizando carne procesada.',
          oliveOil: 'Aceite de oliva como grasa principal.',
          water: 'Agua como bebida principal.'
        }
      },
      {
        id: 'who-physical-activity',
        label: 'OMS — Actividad física en adultos',
        url: 'https://www.who.int/europe/news-room/fact-sheets/item/physical-activity',
        facts: {
          moderate: '150-300 minutos/semana de actividad aeróbica moderada, o 75-150 minutos vigorosa, o combinación equivalente.',
          strength: 'Fortalecimiento de los principales grupos musculares al menos 2 días/semana.'
        }
      }
    ]
  };
})();