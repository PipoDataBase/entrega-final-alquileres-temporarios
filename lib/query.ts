import { DEFAULT_FILTERS } from "@/lib/metrics";
import { ANFITRION_IDS, CIUDAD_IDS } from "@/lib/reservas";
import { ANIOS, CANALES, MEDIDAS, REGIONES, TIPOS } from "@/lib/types";
import type { Anio, DashboardFilters } from "@/lib/types";

const YEARS = new Set<Anio>(ANIOS);
const CITIES = new Set(CIUDAD_IDS);

export function toQuery(filters: DashboardFilters) {
  const params = new URLSearchParams();
  if (filters.anio !== DEFAULT_FILTERS.anio) params.set("anio", filters.anio);
  if (filters.region !== "todas") params.set("region", filters.region);
  if (filters.canal !== "todos") params.set("canal", filters.canal);
  if (filters.tipo !== "todas") params.set("tipo", filters.tipo);
  if (filters.medida !== "ingresos") params.set("medida", filters.medida);
  const umbral = Math.round(filters.umbral * 100);
  if (umbral !== 13) params.set("umbral", String(umbral));
  if (filters.ciudadId) params.set("ciudad", filters.ciudadId);
  if (filters.anfitrionId) params.set("anfitrion", filters.anfitrionId);
  return params.toString();
}

export function hrefFor(path: string, filters: DashboardFilters) {
  const query = toQuery(filters);
  return query ? `${path}?${query}` : path;
}

export function fromSearchParams(params: URLSearchParams): DashboardFilters {
  const anioRaw = params.get("anio");
  const anio: Anio = anioRaw && YEARS.has(anioRaw as Anio) ? (anioRaw as Anio) : DEFAULT_FILTERS.anio;
  const regionRaw = params.get("region");
  const region = REGIONES.includes(regionRaw as (typeof REGIONES)[number]) ? (regionRaw as DashboardFilters["region"]) : "todas";
  const canalRaw = params.get("canal");
  const canal = CANALES.includes(canalRaw as (typeof CANALES)[number]) ? (canalRaw as DashboardFilters["canal"]) : "todos";
  const tipoRaw = params.get("tipo");
  const tipo = TIPOS.includes(tipoRaw as (typeof TIPOS)[number]) ? (tipoRaw as DashboardFilters["tipo"]) : "todas";
  const medidaRaw = params.get("medida");
  const medida = MEDIDAS.includes(medidaRaw as (typeof MEDIDAS)[number]) ? (medidaRaw as DashboardFilters["medida"]) : "ingresos";
  const umbralParam = params.get("umbral");
  const umbralRaw = umbralParam == null ? Number.NaN : Number(umbralParam);
  const umbral = Number.isFinite(umbralRaw) ? Math.min(20, Math.max(8, umbralRaw)) / 100 : DEFAULT_FILTERS.umbral;
  const ciudadRaw = params.get("ciudad");
  const ciudadId = ciudadRaw && CITIES.has(ciudadRaw) ? ciudadRaw : null;
  const anfitrionRaw = params.get("anfitrion");
  const anfitrionId = anfitrionRaw && ANFITRION_IDS.has(anfitrionRaw) ? anfitrionRaw : null;
  return { anio, region, canal, tipo, medida, umbral, ciudadId, anfitrionId };
}

export function sameFilters(a: DashboardFilters, b: DashboardFilters) {
  return (
    a.anio === b.anio &&
    a.region === b.region &&
    a.canal === b.canal &&
    a.tipo === b.tipo &&
    a.medida === b.medida &&
    Math.round(a.umbral * 100) === Math.round(b.umbral * 100) &&
    a.ciudadId === b.ciudadId &&
    a.anfitrionId === b.anfitrionId
  );
}
