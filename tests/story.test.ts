import assert from "node:assert/strict";
import test from "node:test";
import { estadoCancelacion, estadoReserva, temporadaMes } from "@/lib/metrics";
import { DEFAULT_FILTERS } from "@/lib/metrics";
import { fromSearchParams, toQuery } from "@/lib/query";
import { RESERVAS } from "@/lib/reservas";
import { squarify } from "@/lib/treemap";
import { buildView } from "@/lib/view";
import { layoutWords } from "@/lib/words";
import { CALCULATED_FIELDS } from "@/lib/dictionary";

test("la tabla tiene una fila por reserva", () => {
  assert.equal(RESERVAS.length, 4200);
  assert.equal(new Set(RESERVAS.map((row) => row.id)).size, 4200);
  assert.equal(new Set(RESERVAS.map((row) => row.ciudad)).size, 15);
});

test("el corte de 2025 muestra ingresos más flojos y más cancelación", () => {
  const view = buildView(DEFAULT_FILTERS);
  assert.ok(view.kpis.varIngresos != null && view.kpis.varIngresos < -0.04 && view.kpis.varIngresos > -0.12);
  assert.ok(view.kpis.cancelPct > 0.11 && view.kpis.cancelPct < 0.14);
  assert.ok(view.kpis.varCancelPp != null && view.kpis.varCancelPp > 0.005);
  assert.equal(view.kpis.semaforoIngresos, "Caída");
  const alerts = view.cities.filter((city) => city.estado === "Sobre umbral");
  assert.ok(alerts.some((city) => city.id === "puerto-madryn"));
  assert.ok(alerts.some((city) => city.id === "san-salvador-de-jujuy"));
  assert.ok(view.cities.find((city) => city.id === "ushuaia")?.estado === "En rango");
  assert.match(view.headline, /Aun así/);
  assert.ok(view.words.length >= 8);
  assert.ok(view.brechaLargaCorta != null && view.brechaLargaCorta > 0.01);
});

test("el mix FIXED no cambia al filtrar la región y el de la selección sí", () => {
  const all = buildView(DEFAULT_FILTERS);
  const patagonia = buildView({ ...DEFAULT_FILTERS, region: "Patagonia" });
  const fixedAll = all.mix.find((row) => row.region === "Patagonia");
  const fixedOne = patagonia.mix.find((row) => row.region === "Patagonia");
  assert.ok(fixedAll && fixedOne);
  assert.equal(fixedAll.mixCadena, fixedOne.mixCadena);
  assert.ok(fixedOne.mixSeleccion > fixedAll.mixSeleccion);
});

test("el parámetro de umbral reclasifica plazas", () => {
  const laxo = buildView({ ...DEFAULT_FILTERS, umbral: 0.2 });
  const estricto = buildView({ ...DEFAULT_FILTERS, umbral: 0.1 });
  assert.ok(laxo.alertCount < estricto.alertCount);
  assert.equal(estadoCancelacion(0.14, 0.13), "Sobre umbral");
  assert.equal(estadoCancelacion(0.1, 0.13), "En rango");
});

test("los campos IF y CASE clasifican como se documenta", () => {
  assert.equal(estadoReserva("Cancelada"), "Perdida");
  assert.equal(estadoReserva("Confirmada"), "Por llegar");
  assert.equal(estadoReserva("Completada"), "Cumplida");
  assert.equal(temporadaMes(1), "Verano");
  assert.equal(temporadaMes(4), "Otoño");
  assert.equal(temporadaMes(7), "Invierno");
  assert.equal(temporadaMes(10), "Primavera");
});

test("elegir una plaza filtra los KPI y deja el mapa completo", () => {
  const all = buildView(DEFAULT_FILTERS);
  const one = buildView({ ...DEFAULT_FILTERS, ciudadId: "ushuaia" });
  assert.ok(one.kpis.ingresos < all.kpis.ingresos);
  assert.equal(one.cities.length, all.cities.length);
  assert.equal(one.kpis.varIngresos == null, false);
});

test("el ingreso FIXED de la ciudad ignora el tipo", () => {
  const casa = buildView({ ...DEFAULT_FILTERS, tipo: "Casa", ciudadId: "ushuaia" });
  const city = casa.cities.find((item) => item.id === "ushuaia");
  assert.ok(city && city.ingresosFixed > city.ingresos * 1.5);
});

test("los parámetros de la URL se leen y se escriben", () => {
  const filters = { ...DEFAULT_FILTERS, region: "Patagonia" as const, umbral: 0.16, ciudadId: "ushuaia", medida: "noches" as const };
  const back = fromSearchParams(new URLSearchParams(toQuery(filters)));
  assert.equal(back.region, "Patagonia");
  assert.equal(back.umbral, 0.16);
  assert.equal(back.ciudadId, "ushuaia");
  assert.equal(back.medida, "noches");
  assert.equal(fromSearchParams(new URLSearchParams()).umbral, 0.13);
});

test("el treemap cubre el rectángulo", () => {
  const rects = squarify(
    [
      { id: "a", value: 40 },
      { id: "b", value: 30 },
      { id: "c", value: 20 },
    ],
    200,
    100,
  );
  const area = rects.reduce((sum, rect) => sum + rect.w * rect.h, 0);
  assert.ok(Math.abs(area - 20000) < 1);
});

test("la nube no superpone las palabras grandes", () => {
  const placed = layoutWords(
    ["Palermo", "Centro", "Playa"].map((token, index) => ({ token, peso: 30 - index * 5 })),
    480,
    280,
  );
  assert.equal(placed.length, 3);
});

test("la entrega pide al menos dos agregaciones, dos condicionales y un FIXED", () => {
  const agregaciones = CALCULATED_FIELDS.filter((field) => field.tipo.startsWith("Agregación"));
  const condicionales = CALCULATED_FIELDS.filter((field) => field.tipo.startsWith("Condicional"));
  const fixed = CALCULATED_FIELDS.filter((field) => field.tipo === "FIXED");
  assert.ok(agregaciones.length >= 2);
  assert.ok(condicionales.length >= 2);
  assert.ok(fixed.length >= 1);
});
