import type { Canal, Temporada } from "@/lib/types";

export const COLOR = {
  terra: "#C45C26",
  moss: "#2F6B4F",
  alert: "#B42318",
  ink: "#1C1915",
  stone: "#6B645B",
  paper: "#F3EDE4",
  ivory: "#FBF8F3",
  line: "#E0D6C8",
  land: "#E7E0D6",
  landEmpty: "#F6F1EA",
  coast: "#D9D0C4",
} as const;

export const CANAL_COLOR: Record<Canal, string> = {
  "App móvil": "#1E4D6B",
  "Sitio web": "#3D6B8C",
  "Agencia turística": "#7E93A6",
  "Reserva directa": "#A6844A",
};

export const SEASON_BAND: Record<Temporada, string> = {
  Verano: "#EFE4D6",
  Otoño: "#E7E1D6",
  Invierno: "#E3E6E2",
  Primavera: "#E8E4DA",
};
