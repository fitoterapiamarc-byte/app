# CuerpoClaro v1

Aplicación web/PWA para registrar señales corporales y hábitos, observar tendencias y mostrar orientación educativa basada en fuentes verificables.

## Funciones

- Registro diario: energía, ánimo, digestión, sueño, estrés, dolor, horas de sueño, peso, actividad, tránsito, orina y notas.
- Análisis de tendencias y relaciones entre variables.
- Recomendaciones de hábitos a partir de los registros.
- Perfil de salud y filtros de seguridad.
- Fitoterapia con monografías y seguridad trazables a Vademécum/Fitoterapia.net, EMA y ESCOP.
- Motor conservador de interacciones planta-medicamento para reglas documentadas.
- Nutrición general basada en OMS y AESAN.
- Pantalla de señales de alarma y prioridad de atención.
- Exportación/importación de copias JSON y exportación CSV.
- PWA con service worker para funcionamiento offline del shell de la aplicación.

## Política de evidencia

CuerpoClaro no convierte hipótesis en hechos. Distingue entre:

- monografías y usos reconocidos por EMA;
- uso tradicional reconocido;
- interacciones clínicamente relevantes;
- precauciones o mecanismos teóricos documentados, que se etiquetan como tales;
- ausencia de interacciones descritas, que nunca se presenta como garantía absoluta de seguridad.

La tabla de interacciones principal usada en la versión 1 es:
Vanaclocha B, Cañigueral S. *Tabla de interacciones entre preparados vegetales y fármacos de síntesis, basada en las monografías de la EMA y ESCOP*. Fitoterapia.net. Actualizada 30/06/2026.

## Fuentes principales

- Fitoterapia.net / Vademécum de Fitoterapia: https://www.fitoterapia.net/vademecum/
- Tabla de interacciones Fitoterapia.net: https://www.fitoterapia.net/publicaciones/documentacion/tabla-interacciones-entre-preparados-vegetales-2047.html
- European Medicines Agency (EMA): https://www.ema.europa.eu/en/medicines/herbal
- OMS, alimentación saludable: https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet
- AESAN, recomendaciones dietéticas: https://www.aesan.gob.es/nutricion/recomendaciones-dieteticas
- OMS, actividad física: https://www.who.int/europe/news-room/fact-sheets/item/physical-activity
- MedlinePlus, reconocimiento de emergencias: https://medlineplus.gov/spanish/ency/article/001927.htm

## Seguridad

La aplicación es educativa y orientativa. No sustituye diagnóstico, tratamiento ni valoración por profesionales sanitarios. Ante una emergencia en España, llamar al 112.

## Datos

La versión 1 guarda perfil y registros en `localStorage` del navegador. No sincroniza con un servidor. El usuario puede crear copias de seguridad JSON y exportar los registros a CSV.
