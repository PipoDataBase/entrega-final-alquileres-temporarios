export type FieldKind = "Agregación" | "Condicional" | "FIXED";

export type CalculatedField = {
  nombre: string;
  tipo: string;
  formula: string;
  uso: string;
};

export const CALCULATED_FIELDS: CalculatedField[] = [
  {
    nombre: "Ingresos cobrados",
    tipo: "Agregación · SUM",
    formula: "SUM([Ingresos totales ARS])",
    uso: "KPI principal, barras del eje doble, tamaño del mapa, área del treemap y tamaño de la dispersión.",
  },
  {
    nombre: "Noches reservadas",
    tipo: "Agregación · SUM",
    formula: "SUM([Noches])",
    uso: "Se grafica cuando el parámetro Medida principal está en Noches, y aparece en los tooltips.",
  },
  {
    nombre: "Reservas",
    tipo: "Agregación · COUNTD",
    formula: "COUNTD([Id reserva])",
    uso: "KPI de volumen, tamaño de la nube de barrios y opción del parámetro de medida.",
  },
  {
    nombre: "Precio por noche",
    tipo: "Agregación · AVG",
    formula: "AVG([Precio noche ARS])",
    uso: "Tooltip del mapa y de la dispersión. Ordena la decisión de qué plaza cuidar.",
  },
  {
    nombre: "Tasa de cancelación",
    tipo: "Agregación · SUM / SUM",
    formula: "SUM(IF [Estado reserva] = \"Cancelada\" THEN 1 ELSE 0 END) / COUNTD([Id reserva])",
    uso: "KPI de cancelación, línea del eje doble, eje Y de la dispersión, largo del ranking y color de alerta.",
  },
  {
    nombre: "Estado de cancelación",
    tipo: "Condicional · IF",
    formula: 'IF [Tasa de cancelación] > [Umbral de cancelación] THEN "Sobre umbral" ELSE "En rango" END',
    uso: "Color del mapa, del ranking, del treemap, de la dispersión y de la nube.",
  },
  {
    nombre: "Estado de la reserva",
    tipo: "Condicional · IF",
    formula: 'IF [Estado reserva] = "Cancelada" THEN "Perdida" ELSEIF [Estado reserva] = "Confirmada" THEN "Por llegar" ELSE "Cumplida" END',
    uso: "Clasifica cada fila antes de sumar ingresos perdidos y estadías ya cumplidas.",
  },
  {
    nombre: "Temporada del mes",
    tipo: "Condicional · CASE",
    formula: 'CASE [Mes de check-in] WHEN 12 OR 1 OR 2 THEN "Verano" WHEN 3 OR 4 OR 5 THEN "Otoño" WHEN 6 OR 7 OR 8 THEN "Invierno" ELSE "Primavera" END',
    uso: "Bandas del eje doble. No usa el color de alerta: es solo el calendario.",
  },
  {
    nombre: "Mix de la red",
    tipo: "FIXED",
    formula: "{ FIXED [Año de check-in] : SUM([Ingresos cobrados]) } repartido por región",
    uso: "Barra piedra del gráfico de mix. No se mueve al filtrar región, canal, tipo ni ciudad.",
  },
  {
    nombre: "Ingresos de la ciudad, todos los tipos",
    tipo: "FIXED",
    formula: "{ FIXED [Ciudad], [Año de check-in] : SUM([Ingresos cobrados]) }",
    uso: "Tooltip del mapa cuando hay un tipo de propiedad elegido. Ignora ese filtro.",
  },
];

export const COLOR_SYSTEM = [
  { nombre: "Terracota", hex: "#C45C26", rol: "Acento. La medida principal: ingresos, noches o reservas, según el parámetro. También el isotipo." },
  { nombre: "Musgo", hex: "#2F6B4F", rol: "En rango. Cancelación por debajo del umbral y una variación favorable." },
  { nombre: "Alerta", hex: "#B42318", rol: "Atención. Cancelación sobre el umbral y una variación desfavorable. Nunca identifica una región ni un canal." },
  { nombre: "Tinta", hex: "#1C1915", rol: "Texto, trazo de lo seleccionado y botones activos." },
  { nombre: "Piedra", hex: "#6B645B", rol: "Texto secundario, variación estable y la serie FIXED." },
  { nombre: "Papel", hex: "#F3EDE4", rol: "Fondo de las tres hojas." },
  { nombre: "Marfil", hex: "#FBF8F3", rol: "Tarjetas." },
];
