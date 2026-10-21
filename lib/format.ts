import type { Anio, Medida } from "@/lib/types";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"] as const;
const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"] as const;

export function formatNumber(value: number, digits = 0) {
  if (!Number.isFinite(value)) return "—";
  const sign = value < 0 ? "−" : "";
  const [int, dec] = Math.abs(value).toFixed(digits).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec ? `${sign}${grouped},${dec}` : `${sign}${grouped}`;
}

export function formatARS(value: number) {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (abs >= 1_000_000) return `${sign}$ ${formatNumber(abs / 1_000_000, 1)} M`;
  if (abs >= 10_000) return `${sign}$ ${formatNumber(abs / 1_000, 0)} mil`;
  return `${sign}$ ${formatNumber(abs, 0)}`;
}

export function formatInt(value: number) {
  return formatNumber(value, 0);
}

export function formatPct(value: number, digits = 1) {
  if (!Number.isFinite(value)) return "—";
  return `${formatNumber(value * 100, digits)}%`;
}

export function formatVarPct(value: number | null) {
  if (value == null || !Number.isFinite(value)) return "s/ base";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatNumber(Math.abs(value * 100), 1)}%`;
}

export function formatPp(value: number | null) {
  if (value == null || !Number.isFinite(value)) return "s/ base";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatNumber(Math.abs(value * 100), 1)} pp`;
}

export function formatMeasure(medida: Medida, value: number) {
  if (medida === "ingresos") return formatARS(value);
  return formatInt(value);
}

export function measureLabel(medida: Medida) {
  if (medida === "noches") return "Noches";
  if (medida === "reservas") return "Reservas";
  return "Ingresos";
}

export function labelMes(mes: string) {
  const [year, month] = mes.split("-");
  return `${MESES[Number(month) - 1]} ${year.slice(2)}`;
}

export function labelMesLargo(mes: string) {
  const [year, month] = mes.split("-");
  return `${MESES_LARGOS[Number(month) - 1]} ${year}`;
}

export function periodText(anio: Anio) {
  if (anio === "2025") return "Enero a noviembre de 2025, contra el mismo tramo de 2024";
  if (anio === "2024") return "Año 2024 completo, contra 2023";
  if (anio === "2023") return "Año 2023 completo";
  return "Check-in de enero de 2023 a diciembre de 2025";
}
