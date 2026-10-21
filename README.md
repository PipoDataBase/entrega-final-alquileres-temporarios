# Alquileres temporarios

Proyecto final de Valentino Nicolas Vallone.

Tablero de tres hojas sobre reservas de alquiler temporario en 15 ciudades de Argentina. El check-in va de enero de 2023 al 17 de diciembre de 2025 y responde una pregunta: los ingresos de 2025 aflojan y la cancelación sube. ¿Qué plaza se cuida, qué anfitrión se revisa y dónde conviene pedir una seña?

Usa el mismo dataset de la pre-entrega 1. No usa la base Supertienda. Los importes están en pesos.

## Cómo correrlo

```bash
npm install
npm test
npm run dev
```

El servidor queda en [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Las tres hojas

1. **Panorama.** KPIs, eje doble, dona de canales, mapa de símbolos y barras por tipo de propiedad.
2. **Diagnóstico.** Treemap de anfitriones, dispersión, ranking de plazas, nube de barrios y mix contra el cálculo fijo de la red.
3. **Documentación.** Objetivo, fuente, usuarios, modelo, campos calculados, parámetros, colores, conclusiones y glosario.

La navegación está en el encabezado y en el pie. Un clic en una plaza filtra la otra hoja; el mismo clic, el botón Quitar selección o Esc vuelven al total.

## Qué está calculado

Agregaciones: ingresos cobrados, noches reservadas, reservas, precio por noche y tasa de cancelación.

Condicionales: estado de cancelación (`IF` contra el umbral), estado de la reserva y temporada del mes (`CASE`).

`FIXED`: mix de la red, que no se mueve al cambiar la región, e ingresos de la ciudad ignorando el tipo, visible en el tooltip del mapa.

Parámetros con efecto visible: la medida principal y el umbral de cancelación.
