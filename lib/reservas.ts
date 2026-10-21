import raw from "@/data/reservas.json";
import type { Canal, Region, Reserva, Temporada, Tipo } from "@/lib/types";

const REGION_BY_PROVINCIA: Record<string, Region> = {
  CABA: "AMBA",
  "Buenos Aires": "Centro",
  "Santa Fe": "Centro",
  Cordoba: "Centro",
  Mendoza: "Cuyo",
  Salta: "NOA",
  Jujuy: "NOA",
  Tucuman: "NOA",
  Misiones: "NEA",
  "Tierra del Fuego": "Patagonia",
  "Santa Cruz": "Patagonia",
  Chubut: "Patagonia",
  "Rio Negro": "Patagonia",
};

const GEO_PROVINCIA: Record<string, string> = {
  CABA: "Ciudad Autónoma de Buenos Aires",
  Cordoba: "Córdoba",
  Tucuman: "Tucumán",
  "Rio Negro": "Río Negro",
};

const CANAL: Record<string, Canal> = {
  "App movil": "App móvil",
  "Sitio web": "Sitio web",
  "Agencia turistica": "Agencia turística",
  "Reserva directa": "Reserva directa",
};

type Raw = {
  id: string;
  reserva: string;
  checkin: string;
  ciudad: string;
  provincia: string;
  barrio: string;
  tipo: string;
  capacidad: number;
  precio: number;
  noches: number;
  ingresos: number;
  cal: number | null;
  anfitrion: string;
  super: boolean;
  canal: string;
  estado: "Completada" | "Cancelada" | "Confirmada";
  temporada: Temporada;
  lat: number;
  lon: number;
};

export function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

export const RESERVAS: Reserva[] = (raw as Raw[]).map((row) => {
  const region = REGION_BY_PROVINCIA[row.provincia];
  if (!region) throw new Error(`Provincia sin región: ${row.provincia}`);
  const canal = CANAL[row.canal];
  if (!canal) throw new Error(`Canal desconocido: ${row.canal}`);
  return {
    id: row.id,
    anio: Number(row.checkin.slice(0, 4)),
    mes: row.checkin.slice(0, 7),
    mesNum: Number(row.checkin.slice(5, 7)),
    reserva: row.reserva,
    checkin: row.checkin,
    anticipacion: daysBetween(row.reserva, row.checkin),
    ciudad: row.ciudad,
    ciudadId: slug(row.ciudad),
    provincia: row.provincia,
    provinciaGeo: GEO_PROVINCIA[row.provincia] ?? row.provincia,
    region,
    barrio: row.barrio,
    tipo: row.tipo as Tipo,
    capacidad: row.capacidad,
    precioNoche: row.precio,
    noches: row.noches,
    ingresos: row.ingresos,
    calificacion: row.cal,
    anfitrion: row.anfitrion,
    anfitrionId: slug(row.anfitrion),
    superanfitrion: row.super,
    canal,
    estado: row.estado,
    temporada: row.temporada,
    lat: row.lat,
    lon: row.lon,
  };
});

export const CIUDAD_IDS = [...new Set(RESERVAS.map((row) => row.ciudadId))];
export const ANFITRION_IDS = new Set(RESERVAS.map((row) => row.anfitrionId));
