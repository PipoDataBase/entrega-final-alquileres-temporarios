import { RESERVAS } from "@/lib/reservas";
import type { Anio, DashboardFilters, EstadoCalculado, EstadoCancel, FormaAnfitrion, FormaMapa, Medida, Region, Reserva, Semaforo, Temporada, Tipo } from "@/lib/types";

export const DEFAULT_FILTERS: DashboardFilters = {
  anio: "2025",
  region: "todas",
  canal: "todos",
  tipo: "todas",
  medida: "ingresos",
  umbral: 0.13,
  ciudadId: null,
  anfitrionId: null,
};

export type Totals = {
  ingresos: number;
  noches: number;
  reservas: number;
  canceladas: number;
  completadas: number;
  precioNoche: number;
  calSum: number;
  calN: number;
  anticipacion: number;
  superN: number;
  corta: number;
  media: number;
  larga: number;
};

export function emptyTotals(): Totals {
  return {
    ingresos: 0,
    noches: 0,
    reservas: 0,
    canceladas: 0,
    completadas: 0,
    precioNoche: 0,
    calSum: 0,
    calN: 0,
    anticipacion: 0,
    superN: 0,
    corta: 0,
    media: 0,
    larga: 0,
  };
}

export function addReserva(bucket: Totals, row: Reserva) {
  bucket.ingresos += row.ingresos;
  bucket.noches += row.noches;
  bucket.reservas += 1;
  bucket.precioNoche += row.precioNoche;
  bucket.anticipacion += row.anticipacion;
  if (row.estado === "Cancelada") bucket.canceladas += 1;
  if (row.estado === "Completada") bucket.completadas += 1;
  if (row.calificacion != null) {
    bucket.calSum += row.calificacion;
    bucket.calN += 1;
  }
  if (row.superanfitrion) bucket.superN += 1;
  if (row.anticipacion <= 7) bucket.corta += 1;
  else if (row.anticipacion <= 30) bucket.media += 1;
  else bucket.larga += 1;
}

export function closeTotals(bucket: Totals) {
  const cobradas = bucket.reservas - bucket.canceladas;
  return {
    ...bucket,
    cancelPct: bucket.reservas > 0 ? bucket.canceladas / bucket.reservas : 0,
    adr: bucket.reservas > 0 ? bucket.precioNoche / bucket.reservas : 0,
    ticket: cobradas > 0 ? bucket.ingresos / cobradas : 0,
    cal: bucket.calN > 0 ? bucket.calSum / bucket.calN : null,
    anticipacionMedia: bucket.reservas > 0 ? bucket.anticipacion / bucket.reservas : 0,
    superPct: bucket.reservas > 0 ? bucket.superN / bucket.reservas : 0,
  };
}

export type Closed = ReturnType<typeof closeTotals>;

export function temporadaMes(mesNum: number): Temporada {
  if (mesNum === 12 || mesNum <= 2) return "Verano";
  if (mesNum <= 5) return "Otoño";
  if (mesNum <= 8) return "Invierno";
  return "Primavera";
}

export function estadoReserva(estado: Reserva["estado"]): EstadoCalculado {
  if (estado === "Cancelada") return "Perdida";
  if (estado === "Confirmada") return "Por llegar";
  return "Cumplida";
}

export function estadoCancelacion(cancelPct: number, umbral: number): EstadoCancel {
  return cancelPct > umbral ? "Sobre umbral" : "En rango";
}

export function semaforoVariacion(value: number | null): Semaforo {
  if (value == null || !Number.isFinite(value)) return "Sin base";
  if (value >= 0.05) return "Alza";
  if (value <= -0.05) return "Caída";
  return "Estable";
}

export function formaMapa(region: Region): FormaMapa {
  if (region === "Patagonia") return "Patagonia";
  if (region === "NOA" || region === "NEA") return "Norte";
  return "Resto";
}

export function formaAnfitrion(tipo: Tipo): FormaAnfitrion {
  if (tipo === "Casa" || tipo === "Cabaña") return "Casa o cabaña";
  if (tipo === "Estudio") return "Estudio";
  return "Departamento";
}

export function measureOf(closed: { ingresos: number; noches: number; reservas: number }, medida: Medida) {
  if (medida === "noches") return closed.noches;
  if (medida === "reservas") return closed.reservas;
  return closed.ingresos;
}

export type Scope = {
  anio: Anio;
  months: Set<number> | null;
  region: DashboardFilters["region"];
  canal: DashboardFilters["canal"];
  tipo: DashboardFilters["tipo"];
  ciudadId: string | null;
};

export function inScope(row: Reserva, scope: Scope) {
  if (scope.anio !== "todos" && row.anio !== Number(scope.anio)) return false;
  if (scope.months && !scope.months.has(row.mesNum)) return false;
  if (scope.region !== "todas" && row.region !== scope.region) return false;
  if (scope.canal !== "todos" && row.canal !== scope.canal) return false;
  if (scope.tipo !== "todas" && row.tipo !== scope.tipo) return false;
  if (scope.ciudadId && row.ciudadId !== scope.ciudadId) return false;
  return true;
}

export function collect(scope: Scope) {
  const bucket = emptyTotals();
  for (const row of RESERVAS) {
    if (inScope(row, scope)) addReserva(bucket, row);
  }
  return closeTotals(bucket);
}

export function monthSet(from: number, to: number) {
  const months = new Set<number>();
  for (let month = from; month <= to; month += 1) months.add(month);
  return months;
}

export function variationWindow(anio: Anio): { current: Set<number>; previousYear: number; caption: string } | null {
  if (anio === "2025") return { current: monthSet(1, 11), previousYear: 2024, caption: "ene–nov contra 2024" };
  if (anio === "2024") return { current: monthSet(1, 12), previousYear: 2023, caption: "contra 2023" };
  return null;
}

export function ratio(current: number, previous: number) {
  if (!previous) return null;
  return (current - previous) / previous;
}
