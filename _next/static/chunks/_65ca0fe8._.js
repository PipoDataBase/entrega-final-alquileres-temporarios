(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/dictionary.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CALCULATED_FIELDS",
    ()=>CALCULATED_FIELDS,
    "COLOR_SYSTEM",
    ()=>COLOR_SYSTEM
]);
const CALCULATED_FIELDS = [
    {
        nombre: "Ingresos cobrados",
        tipo: "Agregación · SUM",
        formula: "SUM([Ingresos totales ARS])",
        uso: "KPI principal, barras del eje doble, tamaño del mapa, área del treemap y tamaño de la dispersión."
    },
    {
        nombre: "Noches reservadas",
        tipo: "Agregación · SUM",
        formula: "SUM([Noches])",
        uso: "Se grafica cuando el parámetro Medida principal está en Noches, y aparece en los tooltips."
    },
    {
        nombre: "Reservas",
        tipo: "Agregación · COUNTD",
        formula: "COUNTD([Id reserva])",
        uso: "KPI de volumen, tamaño de la nube de barrios y opción del parámetro de medida."
    },
    {
        nombre: "Precio por noche",
        tipo: "Agregación · AVG",
        formula: "AVG([Precio noche ARS])",
        uso: "Tooltip del mapa y de la dispersión. Ordena la decisión de qué plaza cuidar."
    },
    {
        nombre: "Tasa de cancelación",
        tipo: "Agregación · SUM / SUM",
        formula: "SUM(IF [Estado reserva] = \"Cancelada\" THEN 1 ELSE 0 END) / COUNTD([Id reserva])",
        uso: "KPI de cancelación, línea del eje doble, eje Y de la dispersión, largo del ranking y color de alerta."
    },
    {
        nombre: "Estado de cancelación",
        tipo: "Condicional · IF",
        formula: 'IF [Tasa de cancelación] > [Umbral de cancelación] THEN "Sobre umbral" ELSE "En rango" END',
        uso: "Color del mapa, del ranking, del treemap, de la dispersión y de la nube."
    },
    {
        nombre: "Estado de la reserva",
        tipo: "Condicional · IF",
        formula: 'IF [Estado reserva] = "Cancelada" THEN "Perdida" ELSEIF [Estado reserva] = "Confirmada" THEN "Por llegar" ELSE "Cumplida" END',
        uso: "Clasifica cada fila antes de sumar ingresos perdidos y estadías ya cumplidas."
    },
    {
        nombre: "Temporada del mes",
        tipo: "Condicional · CASE",
        formula: 'CASE [Mes de check-in] WHEN 12 OR 1 OR 2 THEN "Verano" WHEN 3 OR 4 OR 5 THEN "Otoño" WHEN 6 OR 7 OR 8 THEN "Invierno" ELSE "Primavera" END',
        uso: "Bandas del eje doble. No usa el color de alerta: es solo el calendario."
    },
    {
        nombre: "Mix de la red",
        tipo: "FIXED",
        formula: "{ FIXED [Año de check-in] : SUM([Ingresos cobrados]) } repartido por región",
        uso: "Barra piedra del gráfico de mix. No se mueve al filtrar región, canal, tipo ni ciudad."
    },
    {
        nombre: "Ingresos de la ciudad, todos los tipos",
        tipo: "FIXED",
        formula: "{ FIXED [Ciudad], [Año de check-in] : SUM([Ingresos cobrados]) }",
        uso: "Tooltip del mapa cuando hay un tipo de propiedad elegido. Ignora ese filtro."
    }
];
const COLOR_SYSTEM = [
    {
        nombre: "Terracota",
        hex: "#C45C26",
        rol: "Acento. La medida principal: ingresos, noches o reservas, según el parámetro. También el isotipo."
    },
    {
        nombre: "Musgo",
        hex: "#2F6B4F",
        rol: "En rango. Cancelación por debajo del umbral y una variación favorable."
    },
    {
        nombre: "Alerta",
        hex: "#B42318",
        rol: "Atención. Cancelación sobre el umbral y una variación desfavorable. Nunca identifica una región ni un canal."
    },
    {
        nombre: "Tinta",
        hex: "#1C1915",
        rol: "Texto, trazo de lo seleccionado y botones activos."
    },
    {
        nombre: "Piedra",
        hex: "#6B645B",
        rol: "Texto secundario, variación estable y la serie FIXED."
    },
    {
        nombre: "Papel",
        hex: "#F3EDE4",
        rol: "Fondo de las tres hojas."
    },
    {
        nombre: "Marfil",
        hex: "#FBF8F3",
        rol: "Tarjetas."
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/dashboard/documentacion.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Documentacion",
    ()=>Documentacion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dictionary.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metrics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reservas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/reservas.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/view.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const SECTIONS = [
    {
        id: "objetivo",
        index: "01",
        title: "Objetivo del análisis"
    },
    {
        id: "fuente",
        index: "02",
        title: "Fuente de datos"
    },
    {
        id: "usuarios",
        index: "03",
        title: "Usuarios a los que va dirigido"
    },
    {
        id: "modelo",
        index: "04",
        title: "Modelo de datos y conexiones"
    },
    {
        id: "campos",
        index: "05",
        title: "Campos calculados creados"
    },
    {
        id: "parametros",
        index: "06",
        title: "Parámetros creados"
    },
    {
        id: "colores",
        index: "07",
        title: "Sistema de colores"
    },
    {
        id: "conclusiones",
        index: "08",
        title: "Conclusiones"
    },
    {
        id: "glosario",
        index: "09",
        title: "Glosario"
    }
];
function Documentacion() {
    var _hosts_, _hosts_1;
    _s();
    const { view } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboard"])();
    const opening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Documentacion.useMemo[opening]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildView"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FILTERS"])
    }["Documentacion.useMemo[opening]"], []);
    const year2024 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Documentacion.useMemo[year2024]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildView"])({
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FILTERS"],
                anio: "2024"
            })
    }["Documentacion.useMemo[year2024]"], []);
    const patagonia = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Documentacion.useMemo[patagonia]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildView"])({
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FILTERS"],
                region: "Patagonia"
            })
    }["Documentacion.useMemo[patagonia]"], []);
    const fixedAll = opening.mix.find((row)=>row.region === "Patagonia");
    const fixedOther = patagonia.mix.find((row)=>row.region === "Patagonia");
    const cities = [
        ...opening.cities
    ].filter((city)=>city.estado === "Sobre umbral").sort((a, b)=>b.cancelPct - a.cancelPct);
    const ushuaia = opening.cities.find((city)=>city.id === "ushuaia");
    const hosts = [
        ...opening.hosts
    ].sort((a, b)=>b.cancelPct - a.cancelPct);
    var _opening_kpis_varIngresos, _hosts__cancelPct;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid gap-8 lg:grid-cols-[11rem_minmax(0,1fr)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                "aria-label": "Secciones de la documentación",
                className: "flex gap-2 overflow-x-auto lg:sticky lg:top-28 lg:flex-col lg:self-start",
                children: SECTIONS.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "#".concat(section.id),
                        className: "shrink-0 rounded-full border border-line bg-ivory px-3 py-1.5 text-xs text-stone hover:text-ink lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "num mr-1.5",
                                children: section.index
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, this),
                            section.title
                        ]
                    }, section.id, true, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 38,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/dashboard/documentacion.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                className: "max-w-3xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-medium tracking-[0.16em] text-stone uppercase",
                        children: "Hoja 3 · Documentación"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "mt-2 font-heading text-4xl leading-tight text-ink",
                        children: "Cómo está armado este tablero, y qué se puede concluir."
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-sm leading-relaxed text-stone",
                        children: "Valentino Nicolas Vallone. Las hojas 1 y 2 se leen sin esta página. Esta hoja deja por escrito el objetivo, la fuente, el modelo, los cálculos y el sistema de color."
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        id: "objetivo",
                        index: "01",
                        title: "Objetivo del análisis",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "La pregunta es comercial: en los alquileres temporarios de Argentina, ¿dónde se está yendo el ingreso y qué cancelaciones conviene frenar antes de la temporada de verano?"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "El panorama responde el qué. El diagnóstico responde el porqué y cierra con tres decisiones. El corte con el que abre el tablero es el check-in de 2025, comparado de enero a noviembre contra 2024, con un umbral de cancelación del 13%."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        id: "fuente",
                        index: "02",
                        title: "Fuente de datos",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Es el mismo dataset de la pre-entrega 1: reservas de alquiler temporario en 15 ciudades de Argentina. No es Supertienda ni una base de práctica de clase. Cada fila es una reserva, con lugar, anfitrión, canal, precio y estado."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Los importes están en pesos, como vienen en la fuente. El check-in va de enero de 2023 al 17 de diciembre de 2025. Por eso la variación de 2025 usa enero–noviembre y deja diciembre visible en el eje doble, sin compararlo contra un diciembre completo."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reservas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RESERVAS"].length.toLocaleString("es-AR"),
                                    " reservas, 15 plazas, 20 anfitriones y 6 tipos de propiedad. Cuatro canales: app móvil, sitio web, agencia turística y reserva directa."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        id: "usuarios",
                        index: "03",
                        title: "Usuarios a los que va dirigido",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Coordinación comercial de la red de alquileres, en una lectura semanal. Les sirve para ver qué plazas superan el umbral de cancelación, qué anfitrión revisar y dónde no conviene bajar el precio por noche."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "El segundo lector es quien cobra la seña: el tablero muestra que la reserva hecha con más de 30 días cancela más que la de la última semana."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        id: "modelo",
                        index: "04",
                        title: "Modelo de datos y conexiones",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Trabajé con una sola tabla. Alcanza porque el grano ya es la reserva: ciudad, provincia, barrio, tipo, anfitrión, canal, fechas e importes viven en la misma fila. No hace falta un join para responder la pregunta, y sumar tablas solo para mostrar una relación no mejora el análisis."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModelCard, {
                                title: "reservas",
                                detail: "Una fila por reserva. Clave id_reserva. Trae check-in, ciudad, tipo, anfitrión, canal, noches, precio, ingresos, calificación y estado."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "La región del filtro es comercial, no un campo de la fuente. La armé con un CASE sobre la provincia: CABA es AMBA; Buenos Aires, Santa Fe y Córdoba son Centro; Mendoza es Cuyo; Salta, Jujuy y Tucumán son NOA; Misiones es NEA; y la Patagonia junta Tierra del Fuego, Santa Cruz, Chubut y Río Negro. Mar del Plata y La Plata quedan en Centro."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        id: "campos",
                        index: "05",
                        title: "Campos calculados creados",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-3",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CALCULATED_FIELDS"].map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "rounded-xl border border-line bg-ivory p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-ink",
                                                children: field.nombre
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                                lineNumber: 91,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-[11px] tracking-[0.12em] text-stone uppercase",
                                                children: field.tipo
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                                lineNumber: 92,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "num mt-2 text-sm text-ink",
                                                children: field.formula
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                                lineNumber: 93,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-2 text-sm leading-relaxed text-stone",
                                                children: field.uso
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                                lineNumber: 94,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, field.nombre, true, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "El año funciona como filtro de contexto: el FIXED se calcula adentro del año elegido. Región, canal, tipo y ciudad no entran en el mix de la red. El FIXED de la ciudad ignora el tipo y se ve en el tooltip del mapa cuando hay un tipo seleccionado.",
                                    fixedAll && fixedOther ? " En este corte, Patagonia pesa ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(fixedAll.mixCadena), " en la red y el mismo ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(fixedOther.mixCadena), " aunque la selección esté filtrada a esa región.") : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        id: "parametros",
                        index: "06",
                        title: "Parámetros creados",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Medida principal."
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, this),
                                    " Ingresos, noches o reservas. Cambia la serie de barras del eje doble, el orden de los tipos y el tamaño de los símbolos del mapa. El número terracota del primer KPI sigue a esta medida."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Umbral de cancelación."
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 109,
                                        columnNumber: 13
                                    }, this),
                                    " Un porcentaje entre 8% y 20%. Por defecto, 13%. Recalcula el campo Estado de cancelación. Se ve en el color del mapa, del treemap, del ranking, de la dispersión y de la nube, en la línea de referencia y en el KPI de plazas en alerta."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Filtros visibles."
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, this),
                                    " Año de check-in, región comercial, canal y tipo de propiedad. Están en las hojas 1 y 2."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Acción de filtro."
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 115,
                                        columnNumber: 13
                                    }, this),
                                    " Un clic en una plaza del mapa o del ranking filtra KPIs, eje doble, dona, tipos, treemap, dispersión, nube y mix. El mapa y el ranking quedan a la vista para elegir otra plaza. La selección viaja de una hoja a la otra. Se suelta con el mismo clic, con Quitar selección o con Esc."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Acción de resaltado."
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this),
                                    " Un clic en un anfitrión del treemap baja la opacidad del resto en el treemap y en la dispersión. El segundo clic lo suelta. La navegación entre las tres hojas está en el encabezado y en el pie, y no reemplaza esta acción."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        id: "colores",
                        index: "07",
                        title: "Sistema de colores",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "El mismo color tiene el mismo rol en las tres hojas. El fondo es papel. La tipografía es Fraunces en los títulos y Outfit en los números y el texto."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-2",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COLOR_SYSTEM"].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex gap-3 rounded-xl border border-line bg-ivory p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-0.5 size-8 shrink-0 rounded-md border border-line",
                                                style: {
                                                    background: color.hex
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                                lineNumber: 127,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "block text-sm font-medium text-ink",
                                                        children: [
                                                            color.nombre,
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "num font-normal text-stone",
                                                                children: color.hex
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                                                lineNumber: 130,
                                                                columnNumber: 36
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                                        lineNumber: 129,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "mt-0.5 block text-sm leading-relaxed text-stone",
                                                        children: color.rol
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                                lineNumber: 128,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, color.hex, true, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 124,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Los cuatro azules y el ocre de la dona identifican canales y no salen de ese gráfico. Las formas también tienen un solo sentido. En el mapa, triángulo es Patagonia, cuadrado es norte y círculo es el resto. En la dispersión, triángulo es casa o cabaña, círculo es departamento y cuadrado es estudio. El color de esos gráficos está reservado al estado de cancelación."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        id: "conclusiones",
                        index: "08",
                        title: "Conclusiones",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Estas tres lecturas corresponden al corte con el que abre el tablero: check-in 2025, todas las regiones, todos los canales, umbral 13%."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "rounded-xl border border-line bg-ivory p-4 text-sm leading-relaxed",
                                        children: [
                                            "Entre enero y noviembre de 2025 los ingresos ",
                                            opening.kpis.varIngresos != null && opening.kpis.varIngresos >= 0 ? "crecen" : "caen",
                                            " ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(Math.abs((_opening_kpis_varIngresos = opening.kpis.varIngresos) !== null && _opening_kpis_varIngresos !== void 0 ? _opening_kpis_varIngresos : 0)),
                                            " contra el mismo tramo de 2024, y la cancelación queda en ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(opening.kpis.cancelPct),
                                            opening.kpis.varCancelPp != null ? ", ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPp"])(opening.kpis.varCancelPp), " respecto de 2024") : "",
                                            ". El promedio de la red todavía pasa el umbral. ",
                                            opening.alertCount,
                                            " plazas no: ",
                                            cities.map((city)=>city.nombre).join(", "),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 145,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "rounded-xl border border-line bg-ivory p-4 text-sm leading-relaxed",
                                        children: [
                                            ushuaia ? "".concat(ushuaia.nombre, " es la plaza cara que no se cae: precio por noche de ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatARS"])(ushuaia.adr), " y cancelación de ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(ushuaia.cancelPct), ".") : "",
                                            " Conviene cuidar esa tarifa antes de empujar descuentos. El anfitrión más flojo del corte es ",
                                            (_hosts_ = hosts[0]) === null || _hosts_ === void 0 ? void 0 : _hosts_.nombre,
                                            ", con ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])((_hosts__cancelPct = (_hosts_1 = hosts[0]) === null || _hosts_1 === void 0 ? void 0 : _hosts_1.cancelPct) !== null && _hosts__cancelPct !== void 0 ? _hosts__cancelPct : 0),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "rounded-xl border border-line bg-ivory p-4 text-sm leading-relaxed",
                                        children: [
                                            "La reserva hecha con más de 30 días cancela ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(opening.cancelLarga),
                                            ", contra ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(opening.cancelCorta),
                                            " de la última semana. En 2024 la cancelación del año completo fue ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(year2024.kpis.cancelPct),
                                            ". La seña en la reserva larga ataca la pérdida sin tocar el precio de las plazas que ya cobran bien."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-line bg-paper px-4 py-3 text-sm text-stone",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium text-ink",
                                        children: "Lectura del corte actual"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 157,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1",
                                        children: view.headline
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1",
                                        children: [
                                            view.actions.map((action)=>action.titulo).join(" · "),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/documentacion.tsx",
                                        lineNumber: 159,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        id: "glosario",
                        index: "09",
                        title: "Glosario",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Gloss, {
                                term: "ADR",
                                text: "Average daily rate. Acá es el promedio del precio por noche publicado en las reservas del corte."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Gloss, {
                                term: "pp",
                                text: "Puntos porcentuales. Si la cancelación pasa de 11% a 12,4%, subió 1,4 pp. No es una suba del 1,4%."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Gloss, {
                                term: "FIXED",
                                text: "Cálculo que ignora el filtro de una dimensión. Acá, el mix de la red ignora región, canal, tipo y ciudad."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Gloss, {
                                term: "Check-in",
                                text: "Fecha en la que empieza la estadía. El año del tablero se lee por esa fecha, no por la fecha de reserva."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/documentacion.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/documentacion.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/documentacion.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(Documentacion, "gn8d+zt+AcER2bkZMX1ODw3qIDI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboard"]
    ];
});
_c = Documentacion;
function Section(param) {
    let { id, index, title, children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: id,
        className: "mt-10 scroll-mt-28 space-y-3 text-sm leading-relaxed text-ink",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "font-heading text-2xl text-ink",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "num mr-2 text-base text-stone",
                        children: index
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/documentacion.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    title
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/documentacion.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/documentacion.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
}
_c1 = Section;
function ModelCard(param) {
    let { title, detail } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-line bg-ivory p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-medium text-ink",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/dashboard/documentacion.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-sm leading-relaxed text-stone",
                children: detail
            }, void 0, false, {
                fileName: "[project]/components/dashboard/documentacion.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/documentacion.tsx",
        lineNumber: 188,
        columnNumber: 5
    }, this);
}
_c2 = ModelCard;
function Gloss(param) {
    let { term, text } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: [
                    term,
                    "."
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/documentacion.tsx",
                lineNumber: 198,
                columnNumber: 7
            }, this),
            " ",
            text
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/documentacion.tsx",
        lineNumber: 197,
        columnNumber: 5
    }, this);
}
_c3 = Gloss;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Documentacion");
__turbopack_context__.k.register(_c1, "Section");
__turbopack_context__.k.register(_c2, "ModelCard");
__turbopack_context__.k.register(_c3, "Gloss");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_65ca0fe8._.js.map