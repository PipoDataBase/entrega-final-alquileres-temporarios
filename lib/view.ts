import { formatPct, labelMes, periodText } from "@/lib/format";
import {
  addReserva,
  closeTotals,
  emptyTotals,
  estadoCancelacion,
  formaAnfitrion,
  formaMapa,
  measureOf,
  ratio,
  semaforoVariacion,
  temporadaMes,
  variationWindow,
  type Closed,
  type Scope,
} from "@/lib/metrics";
import { RESERVAS } from "@/lib/reservas";
import { CANALES, REGIONES, TIPOS } from "@/lib/types";
import type { Canal, DashboardFilters, EstadoCancel, FormaAnfitrion, FormaMapa, Medida, Region, Reserva, Semaforo, Temporada, Tipo } from "@/lib/types";

export type MonthPoint = {
  mes: string;
  mesNum: number;
  anio: number;
  label: string;
  ingresos: number;
  noches: number;
  reservas: number;
  cancelPct: number;
  temporada: Temporada;
};

export type ChannelPoint = {
  canal: Canal;
  ingresos: number;
  cancelPct: number;
  mix: number;
};

export type TipoPoint = {
  tipo: Tipo;
  ingresos: number;
  noches: number;
  reservas: number;
  cancelPct: number;
  estado: EstadoCancel;
  varIngresos: number | null;
};

export type CityPoint = {
  id: string;
  nombre: string;
  provincia: string;
  provinciaGeo: string;
  region: Region;
  forma: FormaMapa;
  lat: number;
  lon: number;
  ingresos: number;
  noches: number;
  reservas: number;
  cancelPct: number;
  adr: number;
  ticket: number;
  cal: number | null;
  varIngresos: number | null;
  estado: EstadoCancel;
  ingresosFixed: number;
};

export type HostPoint = {
  id: string;
  nombre: string;
  ingresos: number;
  noches: number;
  reservas: number;
  cancelPct: number;
  adr: number;
  varIngresos: number | null;
  estado: EstadoCancel;
  forma: FormaAnfitrion;
  superPct: number;
};

export type MixPoint = {
  region: Region;
  mixSeleccion: number;
  mixCadena: number;
};

export type WordPoint = {
  token: string;
  peso: number;
  estado: EstadoCancel;
  ciudad: string;
  cancelPct: number;
  ingresos: number;
};

export type DashboardView = {
  empty: boolean;
  kpis: {
    ingresos: number;
    noches: number;
    reservas: number;
    cancelPct: number;
    adr: number;
    ticket: number;
    cal: number | null;
    varIngresos: number | null;
    varNoches: number | null;
    varReservas: number | null;
    varCancelPp: number | null;
    semaforoIngresos: Semaforo;
    semaforoNoches: Semaforo;
    semaforoReservas: Semaforo;
    estadoCancel: EstadoCancel;
    variationCaption: string | null;
  };
  alertCount: number;
  cityCount: number;
  months: MonthPoint[];
  channels: ChannelPoint[];
  tipos: TipoPoint[];
  cities: CityPoint[];
  hosts: HostPoint[];
  mix: MixPoint[];
  words: WordPoint[];
  headline: string;
  dek: string;
  resolutionTitle: string;
  actions: { titulo: string; detalle: string }[];
  selectedCity: CityPoint | null;
  selectedHost: HostPoint | null;
  brechaLargaCorta: number | null;
  cancelLarga: number;
  cancelCorta: number;
};

export function measureValue(point: { ingresos: number; noches: number; reservas: number }, medida: Medida) {
  return measureOf(point, medida);
}

function scopeOf(filters: DashboardFilters, extra: Partial<Scope> = {}): Scope {
  return {
    anio: filters.anio,
    months: null,
    region: filters.region,
    canal: filters.canal,
    tipo: filters.tipo,
    ciudadId: filters.ciudadId,
    ...extra,
  };
}

function rowsOf(scope: Scope) {
  return RESERVAS.filter((row) => {
    if (scope.anio !== "todos" && row.anio !== Number(scope.anio)) return false;
    if (scope.months && !scope.months.has(row.mesNum)) return false;
    if (scope.region !== "todas" && row.region !== scope.region) return false;
    if (scope.canal !== "todos" && row.canal !== scope.canal) return false;
    if (scope.tipo !== "todas" && row.tipo !== scope.tipo) return false;
    if (scope.ciudadId && row.ciudadId !== scope.ciudadId) return false;
    return true;
  });
}

function closed(rows: Reserva[]) {
  const bucket = emptyTotals();
  for (const row of rows) addReserva(bucket, row);
  return closeTotals(bucket);
}

export function buildView(filters: DashboardFilters): DashboardView {
  const window = variationWindow(filters.anio);
  const base = scopeOf(filters, { months: window?.current ?? null });
  const currentRows = rowsOf(base);
  const kpisBucket = closed(currentRows);
  const comparableNow = window ? kpisBucket : null;
  const comparableThen = window
    ? closed(rowsOf(scopeOf(filters, { anio: String(window.previousYear) as DashboardFilters["anio"], months: window.current })))
    : null;
  const varIngresos = comparableNow && comparableThen ? ratio(comparableNow.ingresos, comparableThen.ingresos) : null;
  const varNoches = comparableNow && comparableThen ? ratio(comparableNow.noches, comparableThen.noches) : null;
  const varReservas = comparableNow && comparableThen ? ratio(comparableNow.reservas, comparableThen.reservas) : null;
  const varCancelPp = comparableNow && comparableThen ? comparableNow.cancelPct - comparableThen.cancelPct : null;

  const months = buildMonths(rowsOf(scopeOf(filters, { months: null })));
  const channels = buildChannels(currentRows);
  const tipos = buildTipos(filters);
  const cities = buildCities(filters);
  const hosts = buildHosts(filters);
  const mix = buildMix(filters);
  const words = buildWords(currentRows, filters.umbral);
  const alertCount = cities.filter((city) => city.estado === "Sobre umbral" && city.reservas > 0).length;
  const selectedCity = cities.find((city) => city.id === filters.ciudadId) ?? null;
  const selectedHost = hosts.find((host) => host.id === filters.anfitrionId) ?? null;
  const lead = leadGap(currentRows);

  const kpis = {
    ingresos: kpisBucket.ingresos,
    noches: kpisBucket.noches,
    reservas: kpisBucket.reservas,
    cancelPct: kpisBucket.cancelPct,
    adr: kpisBucket.adr,
    ticket: kpisBucket.ticket,
    cal: kpisBucket.cal,
    varIngresos,
    varNoches,
    varReservas,
    varCancelPp,
    semaforoIngresos: semaforoVariacion(varIngresos),
    semaforoNoches: semaforoVariacion(varNoches),
    semaforoReservas: semaforoVariacion(varReservas),
    estadoCancel: estadoCancelacion(kpisBucket.cancelPct, filters.umbral),
    variationCaption: window?.caption ?? null,
  };

  return {
    empty: kpisBucket.reservas === 0,
    kpis,
    alertCount,
    cityCount: cities.filter((city) => city.reservas > 0).length,
    months,
    channels,
    tipos,
    cities,
    hosts,
    mix,
    words,
    headline: headline(filters, kpis, alertCount),
    dek: dek(filters, kpisBucket, lead),
    resolutionTitle: "La plata está en el precio por noche. La pérdida está en la cancelación.",
    actions: actions(filters, cities, hosts, tipos, lead),
    selectedCity,
    selectedHost,
    brechaLargaCorta: lead.gap,
    cancelLarga: lead.larga,
    cancelCorta: lead.corta,
  };
}

function buildMonths(rows: Reserva[]): MonthPoint[] {
  const groups = new Map<string, Reserva[]>();
  for (const row of rows) {
    const list = groups.get(row.mes) ?? [];
    list.push(row);
    groups.set(row.mes, list);
  }
  return [...groups.keys()]
    .sort()
    .map((mes) => {
      const closedMonth = closed(groups.get(mes) ?? []);
      const [anio, mesNum] = mes.split("-").map(Number);
      return {
        mes,
        mesNum,
        anio,
        label: labelMes(mes),
        ingresos: closedMonth.ingresos,
        noches: closedMonth.noches,
        reservas: closedMonth.reservas,
        cancelPct: closedMonth.cancelPct,
        temporada: temporadaMes(mesNum),
      };
    });
}

function buildChannels(rows: Reserva[]): ChannelPoint[] {
  const total = closed(rows).ingresos;
  return CANALES.map((canal) => {
    const bucket = closed(rows.filter((row) => row.canal === canal));
    return { canal, ingresos: bucket.ingresos, cancelPct: bucket.cancelPct, mix: total > 0 ? bucket.ingresos / total : 0 };
  }).filter((channel) => channel.ingresos > 0 || channel.cancelPct > 0);
}

function analysisMonths(filters: DashboardFilters) {
  return variationWindow(filters.anio)?.current ?? null;
}

function buildTipos(filters: DashboardFilters): TipoPoint[] {
  const rows = rowsOf(scopeOf(filters, { tipo: "todas", months: analysisMonths(filters) }));
  const window = variationWindow(filters.anio);
  return TIPOS.map((tipo) => {
    const own = closed(rows.filter((row) => row.tipo === tipo));
    const before = window
      ? closed(rowsOf(scopeOf(filters, { tipo: "todas", anio: String(window.previousYear) as DashboardFilters["anio"], months: window.current })).filter((row) => row.tipo === tipo))
      : null;
    const now = window ? closed(rows.filter((row) => row.tipo === tipo && window.current.has(row.mesNum))) : null;
    return {
      tipo,
      ingresos: own.ingresos,
      noches: own.noches,
      reservas: own.reservas,
      cancelPct: own.cancelPct,
      estado: estadoCancelacion(own.cancelPct, filters.umbral),
      varIngresos: now && before ? ratio(now.ingresos, before.ingresos) : null,
    };
  });
}

function buildCities(filters: DashboardFilters): CityPoint[] {
  const rows = rowsOf(scopeOf(filters, { ciudadId: null, months: analysisMonths(filters) }));
  const fixedRows = rowsOf(scopeOf(filters, { ciudadId: null, tipo: "todas", months: analysisMonths(filters) }));
  const window = variationWindow(filters.anio);
  const previous = window ? rowsOf(scopeOf(filters, { ciudadId: null, anio: String(window.previousYear) as DashboardFilters["anio"], months: window.current })) : [];
  const groups = groupBy(rows, (row) => row.ciudadId);
  return [...groups.entries()].map(([id, list]) => {
    const sample = list[0];
    const bucket = closed(list);
    const fixed = closed(fixedRows.filter((row) => row.ciudadId === id));
    const now = window ? closed(list.filter((row) => window.current.has(row.mesNum))) : null;
    const then = window ? closed(previous.filter((row) => row.ciudadId === id)) : null;
    return {
      id,
      nombre: sample.ciudad,
      provincia: sample.provincia,
      provinciaGeo: sample.provinciaGeo,
      region: sample.region,
      forma: formaMapa(sample.region),
      lat: list.reduce((sum, row) => sum + row.lat, 0) / list.length,
      lon: list.reduce((sum, row) => sum + row.lon, 0) / list.length,
      ingresos: bucket.ingresos,
      noches: bucket.noches,
      reservas: bucket.reservas,
      cancelPct: bucket.cancelPct,
      adr: bucket.adr,
      ticket: bucket.ticket,
      cal: bucket.cal,
      varIngresos: now && then ? ratio(now.ingresos, then.ingresos) : null,
      estado: estadoCancelacion(bucket.cancelPct, filters.umbral),
      ingresosFixed: fixed.ingresos,
    };
  });
}

function buildHosts(filters: DashboardFilters): HostPoint[] {
  const rows = rowsOf(scopeOf(filters, { months: analysisMonths(filters) }));
  const window = variationWindow(filters.anio);
  const previous = window ? rowsOf(scopeOf(filters, { anio: String(window.previousYear) as DashboardFilters["anio"], months: window.current })) : [];
  const groups = groupBy(rows, (row) => row.anfitrionId);
  return [...groups.entries()].map(([id, list]) => {
    const bucket = closed(list);
    const now = window ? closed(list.filter((row) => window.current.has(row.mesNum))) : null;
    const then = window ? closed(previous.filter((row) => row.anfitrionId === id)) : null;
    const formas = new Map<FormaAnfitrion, number>();
    for (const row of list) {
      const forma = formaAnfitrion(row.tipo);
      formas.set(forma, (formas.get(forma) ?? 0) + row.ingresos);
    }
    const forma = [...formas.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Departamento";
    return {
      id,
      nombre: list[0].anfitrion,
      ingresos: bucket.ingresos,
      noches: bucket.noches,
      reservas: bucket.reservas,
      cancelPct: bucket.cancelPct,
      adr: bucket.adr,
      varIngresos: now && then ? ratio(now.ingresos, then.ingresos) : null,
      estado: estadoCancelacion(bucket.cancelPct, filters.umbral),
      forma,
      superPct: bucket.superPct,
    };
  });
}

function buildMix(filters: DashboardFilters): MixPoint[] {
  const selected = rowsOf(scopeOf(filters, { months: analysisMonths(filters) }));
  const fixed = rowsOf(scopeOf(filters, { region: "todas", canal: "todos", tipo: "todas", ciudadId: null, months: analysisMonths(filters) }));
  const selectedTotal = closed(selected).ingresos;
  const fixedTotal = closed(fixed).ingresos;
  return REGIONES.map((region) => ({
    region,
    mixSeleccion: selectedTotal > 0 ? closed(selected.filter((row) => row.region === region)).ingresos / selectedTotal : 0,
    mixCadena: fixedTotal > 0 ? closed(fixed.filter((row) => row.region === region)).ingresos / fixedTotal : 0,
  }));
}

function buildWords(rows: Reserva[], umbral: number): WordPoint[] {
  const groups = groupBy(rows, (row) => `${row.barrio}|${row.ciudadId}`);
  return [...groups.values()]
    .map((list) => {
      const bucket = closed(list);
      const barrio = list[0].barrio;
      const ciudad = list[0].ciudad;
      const token = barrio === "Centro" ? `Centro ${shortCity(ciudad)}` : barrio;
      return {
        token,
        peso: bucket.reservas,
        estado: estadoCancelacion(bucket.cancelPct, umbral),
        ciudad,
        cancelPct: bucket.cancelPct,
        ingresos: bucket.ingresos,
      };
    })
    .sort((a, b) => b.peso - a.peso)
    .slice(0, 18);
}

function shortCity(ciudad: string) {
  if (ciudad.startsWith("San Carlos")) return "Bariloche";
  if (ciudad.startsWith("San Miguel")) return "Tucumán";
  if (ciudad.startsWith("San Salvador")) return "Jujuy";
  if (ciudad.startsWith("Villa Carlos")) return "V. Carlos Paz";
  if (ciudad.startsWith("Puerto ")) return ciudad.replace("Puerto ", "P. ");
  return ciudad;
}

function leadGap(rows: Reserva[]) {
  const corta = closed(rows.filter((row) => row.anticipacion <= 7));
  const larga = closed(rows.filter((row) => row.anticipacion > 30));
  return {
    corta: corta.cancelPct,
    larga: larga.cancelPct,
    gap: corta.reservas > 0 && larga.reservas > 0 ? larga.cancelPct - corta.cancelPct : null,
  };
}

function headline(
  filters: DashboardFilters,
  kpis: DashboardView["kpis"],
  alertCount: number,
) {
  const periodo = filters.anio === "2025" ? "Entre enero y noviembre de 2025" : filters.anio === "todos" ? "En el conjunto 2023-2025" : `En ${filters.anio}`;
  const ingresos =
    kpis.varIngresos == null
      ? moneyPhrase(kpis.ingresos)
      : `los ingresos ${kpis.varIngresos >= 0 ? "suben" : "bajan"} ${formatPct(Math.abs(kpis.varIngresos))}`;
  const cancel = `la cancelación queda en ${formatPct(kpis.cancelPct)}`;
  const plazas =
    alertCount === 0
      ? `ninguna plaza queda sobre el umbral de ${formatPct(filters.umbral)}`
      : `${alertCount} ${alertCount === 1 ? "plaza queda" : "plazas quedan"} sobre el umbral de ${formatPct(filters.umbral)}`;
  const bridge = kpis.cancelPct <= filters.umbral && alertCount > 0 ? "Aun así" : "Y";
  return `${periodo} ${ingresos} y ${cancel}. ${bridge}, ${plazas}.`;
}

function moneyPhrase(ingresos: number) {
  const millions = ingresos / 1_000_000;
  return `los ingresos suman $ ${millions.toFixed(1).replace(".", ",")} M`;
}

function dek(filters: DashboardFilters, bucket: Closed, lead: { gap: number | null; larga: number; corta: number }) {
  const leadText =
    lead.gap != null && lead.gap > 0
      ? ` Quien reserva con más de 30 días cancela ${formatPct(lead.larga)}, contra ${formatPct(lead.corta)} de la semana previa al check-in.`
      : "";
  const cierre = filters.anio === "2025" || filters.anio === "todos" ? " Diciembre de 2025 llega hasta el 17, por eso la comparación de ese año corta en noviembre." : "";
  return `${periodText(filters.anio)}. ${bucket.reservas.toLocaleString("es-AR")} reservas en el corte.${leadText}${cierre}`;
}

function actions(
  filters: DashboardFilters,
  cities: CityPoint[],
  hosts: HostPoint[],
  tipos: TipoPoint[],
  lead: { gap: number | null; larga: number; corta: number },
) {
  const best = [...cities].filter((city) => city.reservas > 0).sort((a, b) => b.adr - a.adr)[0];
  const worstCity = [...cities].filter((city) => city.reservas > 0).sort((a, b) => b.cancelPct - a.cancelPct)[0];
  const worstHost = [...hosts].filter((host) => host.reservas >= 8).sort((a, b) => b.cancelPct - a.cancelPct)[0];
  const healthyType = [...tipos].filter((tipo) => tipo.estado === "En rango").sort((a, b) => b.ingresos - a.ingresos)[0];
  return [
    {
      titulo: best ? `Cuidar ${best.nombre}` : "Cuidar el precio alto",
      detalle: best
        ? `${best.nombre} tiene el precio por noche más alto del corte (${pesos(best.adr)}) y cancela ${formatPct(best.cancelPct)}. Esa plaza defiende el ingreso: no hace falta llenarla con un descuento.`
        : "No hay plazas en este corte.",
    },
    {
      titulo: worstHost ? `Revisar a ${worstHost.nombre}` : "Revisar anfitriones",
      detalle: worstHost
        ? `${worstHost.nombre} cancela ${formatPct(worstHost.cancelPct)} en ${worstHost.reservas} reservas. ${worstCity ? `${worstCity.nombre} es la plaza más floja, con ${formatPct(worstCity.cancelPct)}.` : ""} El umbral está en ${formatPct(filters.umbral)}.`
        : "No hay anfitriones en este corte.",
    },
    {
      titulo: lead.gap != null && lead.gap > 0.01 ? "Pedir seña en la reserva larga" : healthyType ? `Sostener ${healthyType.tipo}` : "Sostener el umbral",
      detalle:
        lead.gap != null && lead.gap > 0.01
          ? `La reserva con más de 30 días cancela ${formatPct(lead.larga - lead.corta)} más que la de la última semana. Una seña en esa ventana baja la pérdida antes de discutir el precio.`
          : `Con el umbral en ${formatPct(filters.umbral)}, el semáforo de cada plaza y cada anfitrión se recalcula en el mapa, el ranking y la dispersión.`,
    },
  ];
}

function pesos(value: number) {
  return `$ ${Math.round(value).toLocaleString("es-AR")}`;
}

function groupBy<T>(rows: T[], key: (row: T) => string) {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const id = key(row);
    const list = groups.get(id) ?? [];
    list.push(row);
    groups.set(id, list);
  }
  return groups;
}
