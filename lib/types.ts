export const REGIONES = ["AMBA", "Centro", "Cuyo", "NOA", "NEA", "Patagonia"] as const;
export type Region = (typeof REGIONES)[number];

export const CANALES = ["App móvil", "Sitio web", "Agencia turística", "Reserva directa"] as const;
export type Canal = (typeof CANALES)[number];

export const TIPOS = ["Casa", "Cabaña", "Departamento", "PH", "Loft", "Estudio"] as const;
export type Tipo = (typeof TIPOS)[number];

export const TEMPORADAS = ["Verano", "Otoño", "Invierno", "Primavera"] as const;
export type Temporada = (typeof TEMPORADAS)[number];

export const ANIOS = ["todos", "2023", "2024", "2025"] as const;
export type Anio = (typeof ANIOS)[number];

export const MEDIDAS = ["ingresos", "noches", "reservas"] as const;
export type Medida = (typeof MEDIDAS)[number];

export type EstadoCancel = "Sobre umbral" | "En rango";
export type Semaforo = "Alza" | "Caída" | "Estable" | "Sin base";
export type FormaMapa = "Patagonia" | "Norte" | "Resto";
export type FormaAnfitrion = "Casa o cabaña" | "Departamento" | "Estudio";
export type EstadoCalculado = "Perdida" | "Por llegar" | "Cumplida";

export type Reserva = {
  id: string;
  anio: number;
  mes: string;
  mesNum: number;
  reserva: string;
  checkin: string;
  anticipacion: number;
  ciudad: string;
  ciudadId: string;
  provincia: string;
  provinciaGeo: string;
  region: Region;
  barrio: string;
  tipo: Tipo;
  capacidad: number;
  precioNoche: number;
  noches: number;
  ingresos: number;
  calificacion: number | null;
  anfitrion: string;
  anfitrionId: string;
  superanfitrion: boolean;
  canal: Canal;
  estado: "Completada" | "Cancelada" | "Confirmada";
  temporada: Temporada;
  lat: number;
  lon: number;
};

export type DashboardFilters = {
  anio: Anio;
  region: Region | "todas";
  canal: Canal | "todos";
  tipo: Tipo | "todas";
  medida: Medida;
  /** Fracción. 0.13 es 13% de cancelación. */
  umbral: number;
  ciudadId: string | null;
  anfitrionId: string | null;
};
