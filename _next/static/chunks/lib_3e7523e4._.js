(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/reservas.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ANFITRION_IDS",
    ()=>ANFITRION_IDS,
    "CIUDAD_IDS",
    ()=>CIUDAD_IDS,
    "RESERVAS",
    ()=>RESERVAS,
    "slug",
    ()=>slug
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$reservas$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/data/reservas.json (json)");
;
const REGION_BY_PROVINCIA = {
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
    "Rio Negro": "Patagonia"
};
const GEO_PROVINCIA = {
    CABA: "Ciudad Autónoma de Buenos Aires",
    Cordoba: "Córdoba",
    Tucuman: "Tucumán",
    "Rio Negro": "Río Negro"
};
const CANAL = {
    "App movil": "App móvil",
    "Sitio web": "Sitio web",
    "Agencia turistica": "Agencia turística",
    "Reserva directa": "Reserva directa"
};
function slug(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function daysBetween(from, to) {
    return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}
const RESERVAS = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$reservas$2e$json__$28$json$29$__["default"].map(_c = (row)=>{
    const region = REGION_BY_PROVINCIA[row.provincia];
    if (!region) throw new Error("Provincia sin región: ".concat(row.provincia));
    const canal = CANAL[row.canal];
    if (!canal) throw new Error("Canal desconocido: ".concat(row.canal));
    var _GEO_PROVINCIA_row_provincia;
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
        provinciaGeo: (_GEO_PROVINCIA_row_provincia = GEO_PROVINCIA[row.provincia]) !== null && _GEO_PROVINCIA_row_provincia !== void 0 ? _GEO_PROVINCIA_row_provincia : row.provincia,
        region,
        barrio: row.barrio,
        tipo: row.tipo,
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
        lon: row.lon
    };
});
_c1 = RESERVAS;
const CIUDAD_IDS = [
    ...new Set(RESERVAS.map((row)=>row.ciudadId))
];
const ANFITRION_IDS = new Set(RESERVAS.map((row)=>row.anfitrionId));
var _c, _c1;
__turbopack_context__.k.register(_c, "RESERVAS$(raw as Raw[]).map");
__turbopack_context__.k.register(_c1, "RESERVAS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/metrics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_FILTERS",
    ()=>DEFAULT_FILTERS,
    "addReserva",
    ()=>addReserva,
    "closeTotals",
    ()=>closeTotals,
    "collect",
    ()=>collect,
    "emptyTotals",
    ()=>emptyTotals,
    "estadoCancelacion",
    ()=>estadoCancelacion,
    "estadoReserva",
    ()=>estadoReserva,
    "formaAnfitrion",
    ()=>formaAnfitrion,
    "formaMapa",
    ()=>formaMapa,
    "inScope",
    ()=>inScope,
    "measureOf",
    ()=>measureOf,
    "monthSet",
    ()=>monthSet,
    "ratio",
    ()=>ratio,
    "semaforoVariacion",
    ()=>semaforoVariacion,
    "temporadaMes",
    ()=>temporadaMes,
    "variationWindow",
    ()=>variationWindow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reservas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/reservas.ts [app-client] (ecmascript)");
;
const DEFAULT_FILTERS = {
    anio: "2025",
    region: "todas",
    canal: "todos",
    tipo: "todas",
    medida: "ingresos",
    umbral: 0.13,
    ciudadId: null,
    anfitrionId: null
};
function emptyTotals() {
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
        larga: 0
    };
}
function addReserva(bucket, row) {
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
function closeTotals(bucket) {
    const cobradas = bucket.reservas - bucket.canceladas;
    return {
        ...bucket,
        cancelPct: bucket.reservas > 0 ? bucket.canceladas / bucket.reservas : 0,
        adr: bucket.reservas > 0 ? bucket.precioNoche / bucket.reservas : 0,
        ticket: cobradas > 0 ? bucket.ingresos / cobradas : 0,
        cal: bucket.calN > 0 ? bucket.calSum / bucket.calN : null,
        anticipacionMedia: bucket.reservas > 0 ? bucket.anticipacion / bucket.reservas : 0,
        superPct: bucket.reservas > 0 ? bucket.superN / bucket.reservas : 0
    };
}
function temporadaMes(mesNum) {
    if (mesNum === 12 || mesNum <= 2) return "Verano";
    if (mesNum <= 5) return "Otoño";
    if (mesNum <= 8) return "Invierno";
    return "Primavera";
}
function estadoReserva(estado) {
    if (estado === "Cancelada") return "Perdida";
    if (estado === "Confirmada") return "Por llegar";
    return "Cumplida";
}
function estadoCancelacion(cancelPct, umbral) {
    return cancelPct > umbral ? "Sobre umbral" : "En rango";
}
function semaforoVariacion(value) {
    if (value == null || !Number.isFinite(value)) return "Sin base";
    if (value >= 0.05) return "Alza";
    if (value <= -0.05) return "Caída";
    return "Estable";
}
function formaMapa(region) {
    if (region === "Patagonia") return "Patagonia";
    if (region === "NOA" || region === "NEA") return "Norte";
    return "Resto";
}
function formaAnfitrion(tipo) {
    if (tipo === "Casa" || tipo === "Cabaña") return "Casa o cabaña";
    if (tipo === "Estudio") return "Estudio";
    return "Departamento";
}
function measureOf(closed, medida) {
    if (medida === "noches") return closed.noches;
    if (medida === "reservas") return closed.reservas;
    return closed.ingresos;
}
function inScope(row, scope) {
    if (scope.anio !== "todos" && row.anio !== Number(scope.anio)) return false;
    if (scope.months && !scope.months.has(row.mesNum)) return false;
    if (scope.region !== "todas" && row.region !== scope.region) return false;
    if (scope.canal !== "todos" && row.canal !== scope.canal) return false;
    if (scope.tipo !== "todas" && row.tipo !== scope.tipo) return false;
    if (scope.ciudadId && row.ciudadId !== scope.ciudadId) return false;
    return true;
}
function collect(scope) {
    const bucket = emptyTotals();
    for (const row of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reservas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RESERVAS"]){
        if (inScope(row, scope)) addReserva(bucket, row);
    }
    return closeTotals(bucket);
}
function monthSet(from, to) {
    const months = new Set();
    for(let month = from; month <= to; month += 1)months.add(month);
    return months;
}
function variationWindow(anio) {
    if (anio === "2025") return {
        current: monthSet(1, 11),
        previousYear: 2024,
        caption: "ene–nov contra 2024"
    };
    if (anio === "2024") return {
        current: monthSet(1, 12),
        previousYear: 2023,
        caption: "contra 2023"
    };
    return null;
}
function ratio(current, previous) {
    if (!previous) return null;
    return (current - previous) / previous;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ANIOS",
    ()=>ANIOS,
    "CANALES",
    ()=>CANALES,
    "MEDIDAS",
    ()=>MEDIDAS,
    "REGIONES",
    ()=>REGIONES,
    "TEMPORADAS",
    ()=>TEMPORADAS,
    "TIPOS",
    ()=>TIPOS
]);
const REGIONES = [
    "AMBA",
    "Centro",
    "Cuyo",
    "NOA",
    "NEA",
    "Patagonia"
];
const CANALES = [
    "App móvil",
    "Sitio web",
    "Agencia turística",
    "Reserva directa"
];
const TIPOS = [
    "Casa",
    "Cabaña",
    "Departamento",
    "PH",
    "Loft",
    "Estudio"
];
const TEMPORADAS = [
    "Verano",
    "Otoño",
    "Invierno",
    "Primavera"
];
const ANIOS = [
    "todos",
    "2023",
    "2024",
    "2025"
];
const MEDIDAS = [
    "ingresos",
    "noches",
    "reservas"
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/query.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fromSearchParams",
    ()=>fromSearchParams,
    "hrefFor",
    ()=>hrefFor,
    "sameFilters",
    ()=>sameFilters,
    "toQuery",
    ()=>toQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metrics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reservas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/reservas.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-client] (ecmascript)");
;
;
;
const YEARS = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANIOS"]);
const CITIES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reservas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CIUDAD_IDS"]);
function toQuery(filters) {
    const params = new URLSearchParams();
    if (filters.anio !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FILTERS"].anio) params.set("anio", filters.anio);
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
function hrefFor(path, filters) {
    const query = toQuery(filters);
    return query ? "".concat(path, "?").concat(query) : path;
}
function fromSearchParams(params) {
    const anioRaw = params.get("anio");
    const anio = anioRaw && YEARS.has(anioRaw) ? anioRaw : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FILTERS"].anio;
    const regionRaw = params.get("region");
    const region = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REGIONES"].includes(regionRaw) ? regionRaw : "todas";
    const canalRaw = params.get("canal");
    const canal = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CANALES"].includes(canalRaw) ? canalRaw : "todos";
    const tipoRaw = params.get("tipo");
    const tipo = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIPOS"].includes(tipoRaw) ? tipoRaw : "todas";
    const medidaRaw = params.get("medida");
    const medida = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MEDIDAS"].includes(medidaRaw) ? medidaRaw : "ingresos";
    const umbralParam = params.get("umbral");
    const umbralRaw = umbralParam == null ? Number.NaN : Number(umbralParam);
    const umbral = Number.isFinite(umbralRaw) ? Math.min(20, Math.max(8, umbralRaw)) / 100 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FILTERS"].umbral;
    const ciudadRaw = params.get("ciudad");
    const ciudadId = ciudadRaw && CITIES.has(ciudadRaw) ? ciudadRaw : null;
    const anfitrionRaw = params.get("anfitrion");
    const anfitrionId = anfitrionRaw && __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reservas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANFITRION_IDS"].has(anfitrionRaw) ? anfitrionRaw : null;
    return {
        anio,
        region,
        canal,
        tipo,
        medida,
        umbral,
        ciudadId,
        anfitrionId
    };
}
function sameFilters(a, b) {
    return a.anio === b.anio && a.region === b.region && a.canal === b.canal && a.tipo === b.tipo && a.medida === b.medida && Math.round(a.umbral * 100) === Math.round(b.umbral * 100) && a.ciudadId === b.ciudadId && a.anfitrionId === b.anfitrionId;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/format.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatARS",
    ()=>formatARS,
    "formatInt",
    ()=>formatInt,
    "formatMeasure",
    ()=>formatMeasure,
    "formatNumber",
    ()=>formatNumber,
    "formatPct",
    ()=>formatPct,
    "formatPp",
    ()=>formatPp,
    "formatVarPct",
    ()=>formatVarPct,
    "labelMes",
    ()=>labelMes,
    "labelMesLargo",
    ()=>labelMesLargo,
    "measureLabel",
    ()=>measureLabel,
    "periodText",
    ()=>periodText
]);
const MESES = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic"
];
const MESES_LARGOS = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
];
function formatNumber(value) {
    let digits = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    if (!Number.isFinite(value)) return "—";
    const sign = value < 0 ? "−" : "";
    const [int, dec] = Math.abs(value).toFixed(digits).split(".");
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return dec ? "".concat(sign).concat(grouped, ",").concat(dec) : "".concat(sign).concat(grouped);
}
function formatARS(value) {
    const abs = Math.abs(value);
    const sign = value < 0 ? "−" : "";
    if (abs >= 1_000_000) return "".concat(sign, "$ ").concat(formatNumber(abs / 1_000_000, 1), " M");
    if (abs >= 10_000) return "".concat(sign, "$ ").concat(formatNumber(abs / 1_000, 0), " mil");
    return "".concat(sign, "$ ").concat(formatNumber(abs, 0));
}
function formatInt(value) {
    return formatNumber(value, 0);
}
function formatPct(value) {
    let digits = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
    if (!Number.isFinite(value)) return "—";
    return "".concat(formatNumber(value * 100, digits), "%");
}
function formatVarPct(value) {
    if (value == null || !Number.isFinite(value)) return "s/ base";
    const sign = value > 0 ? "+" : value < 0 ? "−" : "";
    return "".concat(sign).concat(formatNumber(Math.abs(value * 100), 1), "%");
}
function formatPp(value) {
    if (value == null || !Number.isFinite(value)) return "s/ base";
    const sign = value > 0 ? "+" : value < 0 ? "−" : "";
    return "".concat(sign).concat(formatNumber(Math.abs(value * 100), 1), " pp");
}
function formatMeasure(medida, value) {
    if (medida === "ingresos") return formatARS(value);
    return formatInt(value);
}
function measureLabel(medida) {
    if (medida === "noches") return "Noches";
    if (medida === "reservas") return "Reservas";
    return "Ingresos";
}
function labelMes(mes) {
    const [year, month] = mes.split("-");
    return "".concat(MESES[Number(month) - 1], " ").concat(year.slice(2));
}
function labelMesLargo(mes) {
    const [year, month] = mes.split("-");
    return "".concat(MESES_LARGOS[Number(month) - 1], " ").concat(year);
}
function periodText(anio) {
    if (anio === "2025") return "Enero a noviembre de 2025, contra el mismo tramo de 2024";
    if (anio === "2024") return "Año 2024 completo, contra 2023";
    if (anio === "2023") return "Año 2023 completo";
    return "Check-in de enero de 2023 a diciembre de 2025";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildView",
    ()=>buildView,
    "measureValue",
    ()=>measureValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metrics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reservas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/reservas.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-client] (ecmascript)");
;
;
;
;
function measureValue(point, medida) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["measureOf"])(point, medida);
}
function scopeOf(filters) {
    let extra = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return {
        anio: filters.anio,
        months: null,
        region: filters.region,
        canal: filters.canal,
        tipo: filters.tipo,
        ciudadId: filters.ciudadId,
        ...extra
    };
}
function rowsOf(scope) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reservas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RESERVAS"].filter((row)=>{
        if (scope.anio !== "todos" && row.anio !== Number(scope.anio)) return false;
        if (scope.months && !scope.months.has(row.mesNum)) return false;
        if (scope.region !== "todas" && row.region !== scope.region) return false;
        if (scope.canal !== "todos" && row.canal !== scope.canal) return false;
        if (scope.tipo !== "todas" && row.tipo !== scope.tipo) return false;
        if (scope.ciudadId && row.ciudadId !== scope.ciudadId) return false;
        return true;
    });
}
function closed(rows) {
    const bucket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyTotals"])();
    for (const row of rows)(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addReserva"])(bucket, row);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeTotals"])(bucket);
}
function buildView(filters) {
    const window = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["variationWindow"])(filters.anio);
    var _window_current;
    const base = scopeOf(filters, {
        months: (_window_current = window === null || window === void 0 ? void 0 : window.current) !== null && _window_current !== void 0 ? _window_current : null
    });
    const currentRows = rowsOf(base);
    const kpisBucket = closed(currentRows);
    const comparableNow = window ? kpisBucket : null;
    const comparableThen = window ? closed(rowsOf(scopeOf(filters, {
        anio: String(window.previousYear),
        months: window.current
    }))) : null;
    const varIngresos = comparableNow && comparableThen ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ratio"])(comparableNow.ingresos, comparableThen.ingresos) : null;
    const varNoches = comparableNow && comparableThen ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ratio"])(comparableNow.noches, comparableThen.noches) : null;
    const varReservas = comparableNow && comparableThen ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ratio"])(comparableNow.reservas, comparableThen.reservas) : null;
    const varCancelPp = comparableNow && comparableThen ? comparableNow.cancelPct - comparableThen.cancelPct : null;
    const months = buildMonths(rowsOf(scopeOf(filters, {
        months: null
    })));
    const channels = buildChannels(currentRows);
    const tipos = buildTipos(filters);
    const cities = buildCities(filters);
    const hosts = buildHosts(filters);
    const mix = buildMix(filters);
    const words = buildWords(currentRows, filters.umbral);
    const alertCount = cities.filter((city)=>city.estado === "Sobre umbral" && city.reservas > 0).length;
    var _cities_find;
    const selectedCity = (_cities_find = cities.find((city)=>city.id === filters.ciudadId)) !== null && _cities_find !== void 0 ? _cities_find : null;
    var _hosts_find;
    const selectedHost = (_hosts_find = hosts.find((host)=>host.id === filters.anfitrionId)) !== null && _hosts_find !== void 0 ? _hosts_find : null;
    const lead = leadGap(currentRows);
    var _window_caption;
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
        semaforoIngresos: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["semaforoVariacion"])(varIngresos),
        semaforoNoches: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["semaforoVariacion"])(varNoches),
        semaforoReservas: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["semaforoVariacion"])(varReservas),
        estadoCancel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["estadoCancelacion"])(kpisBucket.cancelPct, filters.umbral),
        variationCaption: (_window_caption = window === null || window === void 0 ? void 0 : window.caption) !== null && _window_caption !== void 0 ? _window_caption : null
    };
    return {
        empty: kpisBucket.reservas === 0,
        kpis,
        alertCount,
        cityCount: cities.filter((city)=>city.reservas > 0).length,
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
        cancelCorta: lead.corta
    };
}
function buildMonths(rows) {
    const groups = new Map();
    for (const row of rows){
        var _groups_get;
        const list = (_groups_get = groups.get(row.mes)) !== null && _groups_get !== void 0 ? _groups_get : [];
        list.push(row);
        groups.set(row.mes, list);
    }
    return [
        ...groups.keys()
    ].sort().map((mes)=>{
        var _groups_get;
        const closedMonth = closed((_groups_get = groups.get(mes)) !== null && _groups_get !== void 0 ? _groups_get : []);
        const [anio, mesNum] = mes.split("-").map(Number);
        return {
            mes,
            mesNum,
            anio,
            label: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["labelMes"])(mes),
            ingresos: closedMonth.ingresos,
            noches: closedMonth.noches,
            reservas: closedMonth.reservas,
            cancelPct: closedMonth.cancelPct,
            temporada: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["temporadaMes"])(mesNum)
        };
    });
}
function buildChannels(rows) {
    const total = closed(rows).ingresos;
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CANALES"].map((canal)=>{
        const bucket = closed(rows.filter((row)=>row.canal === canal));
        return {
            canal,
            ingresos: bucket.ingresos,
            cancelPct: bucket.cancelPct,
            mix: total > 0 ? bucket.ingresos / total : 0
        };
    }).filter((channel)=>channel.ingresos > 0 || channel.cancelPct > 0);
}
function analysisMonths(filters) {
    var _variationWindow;
    var _variationWindow_current;
    return (_variationWindow_current = (_variationWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["variationWindow"])(filters.anio)) === null || _variationWindow === void 0 ? void 0 : _variationWindow.current) !== null && _variationWindow_current !== void 0 ? _variationWindow_current : null;
}
function buildTipos(filters) {
    const rows = rowsOf(scopeOf(filters, {
        tipo: "todas",
        months: analysisMonths(filters)
    }));
    const window = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["variationWindow"])(filters.anio);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIPOS"].map((tipo)=>{
        const own = closed(rows.filter((row)=>row.tipo === tipo));
        const before = window ? closed(rowsOf(scopeOf(filters, {
            tipo: "todas",
            anio: String(window.previousYear),
            months: window.current
        })).filter((row)=>row.tipo === tipo)) : null;
        const now = window ? closed(rows.filter((row)=>row.tipo === tipo && window.current.has(row.mesNum))) : null;
        return {
            tipo,
            ingresos: own.ingresos,
            noches: own.noches,
            reservas: own.reservas,
            cancelPct: own.cancelPct,
            estado: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["estadoCancelacion"])(own.cancelPct, filters.umbral),
            varIngresos: now && before ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ratio"])(now.ingresos, before.ingresos) : null
        };
    });
}
function buildCities(filters) {
    const rows = rowsOf(scopeOf(filters, {
        ciudadId: null,
        months: analysisMonths(filters)
    }));
    const fixedRows = rowsOf(scopeOf(filters, {
        ciudadId: null,
        tipo: "todas",
        months: analysisMonths(filters)
    }));
    const window = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["variationWindow"])(filters.anio);
    const previous = window ? rowsOf(scopeOf(filters, {
        ciudadId: null,
        anio: String(window.previousYear),
        months: window.current
    })) : [];
    const groups = groupBy(rows, (row)=>row.ciudadId);
    return [
        ...groups.entries()
    ].map((param)=>{
        let [id, list] = param;
        const sample = list[0];
        const bucket = closed(list);
        const fixed = closed(fixedRows.filter((row)=>row.ciudadId === id));
        const now = window ? closed(list.filter((row)=>window.current.has(row.mesNum))) : null;
        const then = window ? closed(previous.filter((row)=>row.ciudadId === id)) : null;
        return {
            id,
            nombre: sample.ciudad,
            provincia: sample.provincia,
            provinciaGeo: sample.provinciaGeo,
            region: sample.region,
            forma: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formaMapa"])(sample.region),
            lat: list.reduce((sum, row)=>sum + row.lat, 0) / list.length,
            lon: list.reduce((sum, row)=>sum + row.lon, 0) / list.length,
            ingresos: bucket.ingresos,
            noches: bucket.noches,
            reservas: bucket.reservas,
            cancelPct: bucket.cancelPct,
            adr: bucket.adr,
            ticket: bucket.ticket,
            cal: bucket.cal,
            varIngresos: now && then ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ratio"])(now.ingresos, then.ingresos) : null,
            estado: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["estadoCancelacion"])(bucket.cancelPct, filters.umbral),
            ingresosFixed: fixed.ingresos
        };
    });
}
function buildHosts(filters) {
    const rows = rowsOf(scopeOf(filters, {
        months: analysisMonths(filters)
    }));
    const window = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["variationWindow"])(filters.anio);
    const previous = window ? rowsOf(scopeOf(filters, {
        anio: String(window.previousYear),
        months: window.current
    })) : [];
    const groups = groupBy(rows, (row)=>row.anfitrionId);
    return [
        ...groups.entries()
    ].map((param)=>{
        let [id, list] = param;
        var _sort_;
        const bucket = closed(list);
        const now = window ? closed(list.filter((row)=>window.current.has(row.mesNum))) : null;
        const then = window ? closed(previous.filter((row)=>row.anfitrionId === id)) : null;
        const formas = new Map();
        for (const row of list){
            const forma = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formaAnfitrion"])(row.tipo);
            var _formas_get;
            formas.set(forma, ((_formas_get = formas.get(forma)) !== null && _formas_get !== void 0 ? _formas_get : 0) + row.ingresos);
        }
        var _sort__;
        const forma = (_sort__ = (_sort_ = [
            ...formas.entries()
        ].sort((a, b)=>b[1] - a[1])[0]) === null || _sort_ === void 0 ? void 0 : _sort_[0]) !== null && _sort__ !== void 0 ? _sort__ : "Departamento";
        return {
            id,
            nombre: list[0].anfitrion,
            ingresos: bucket.ingresos,
            noches: bucket.noches,
            reservas: bucket.reservas,
            cancelPct: bucket.cancelPct,
            adr: bucket.adr,
            varIngresos: now && then ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ratio"])(now.ingresos, then.ingresos) : null,
            estado: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["estadoCancelacion"])(bucket.cancelPct, filters.umbral),
            forma,
            superPct: bucket.superPct
        };
    });
}
function buildMix(filters) {
    const selected = rowsOf(scopeOf(filters, {
        months: analysisMonths(filters)
    }));
    const fixed = rowsOf(scopeOf(filters, {
        region: "todas",
        canal: "todos",
        tipo: "todas",
        ciudadId: null,
        months: analysisMonths(filters)
    }));
    const selectedTotal = closed(selected).ingresos;
    const fixedTotal = closed(fixed).ingresos;
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REGIONES"].map((region)=>({
            region,
            mixSeleccion: selectedTotal > 0 ? closed(selected.filter((row)=>row.region === region)).ingresos / selectedTotal : 0,
            mixCadena: fixedTotal > 0 ? closed(fixed.filter((row)=>row.region === region)).ingresos / fixedTotal : 0
        }));
}
function buildWords(rows, umbral) {
    const groups = groupBy(rows, (row)=>"".concat(row.barrio, "|").concat(row.ciudadId));
    return [
        ...groups.values()
    ].map((list)=>{
        const bucket = closed(list);
        const barrio = list[0].barrio;
        const ciudad = list[0].ciudad;
        const token = barrio === "Centro" ? "Centro ".concat(shortCity(ciudad)) : barrio;
        return {
            token,
            peso: bucket.reservas,
            estado: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["estadoCancelacion"])(bucket.cancelPct, umbral),
            ciudad,
            cancelPct: bucket.cancelPct,
            ingresos: bucket.ingresos
        };
    }).sort((a, b)=>b.peso - a.peso).slice(0, 18);
}
function shortCity(ciudad) {
    if (ciudad.startsWith("San Carlos")) return "Bariloche";
    if (ciudad.startsWith("San Miguel")) return "Tucumán";
    if (ciudad.startsWith("San Salvador")) return "Jujuy";
    if (ciudad.startsWith("Villa Carlos")) return "V. Carlos Paz";
    if (ciudad.startsWith("Puerto ")) return ciudad.replace("Puerto ", "P. ");
    return ciudad;
}
function leadGap(rows) {
    const corta = closed(rows.filter((row)=>row.anticipacion <= 7));
    const larga = closed(rows.filter((row)=>row.anticipacion > 30));
    return {
        corta: corta.cancelPct,
        larga: larga.cancelPct,
        gap: corta.reservas > 0 && larga.reservas > 0 ? larga.cancelPct - corta.cancelPct : null
    };
}
function headline(filters, kpis, alertCount) {
    const periodo = filters.anio === "2025" ? "Entre enero y noviembre de 2025" : filters.anio === "todos" ? "En el conjunto 2023-2025" : "En ".concat(filters.anio);
    const ingresos = kpis.varIngresos == null ? moneyPhrase(kpis.ingresos) : "los ingresos ".concat(kpis.varIngresos >= 0 ? "suben" : "bajan", " ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(Math.abs(kpis.varIngresos)));
    const cancel = "la cancelación queda en ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(kpis.cancelPct));
    const plazas = alertCount === 0 ? "ninguna plaza queda sobre el umbral de ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(filters.umbral)) : "".concat(alertCount, " ").concat(alertCount === 1 ? "plaza queda" : "plazas quedan", " sobre el umbral de ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(filters.umbral));
    const bridge = kpis.cancelPct <= filters.umbral && alertCount > 0 ? "Aun así" : "Y";
    return "".concat(periodo, " ").concat(ingresos, " y ").concat(cancel, ". ").concat(bridge, ", ").concat(plazas, ".");
}
function moneyPhrase(ingresos) {
    const millions = ingresos / 1_000_000;
    return "los ingresos suman $ ".concat(millions.toFixed(1).replace(".", ","), " M");
}
function dek(filters, bucket, lead) {
    const leadText = lead.gap != null && lead.gap > 0 ? " Quien reserva con más de 30 días cancela ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(lead.larga), ", contra ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(lead.corta), " de la semana previa al check-in.") : "";
    const cierre = filters.anio === "2025" || filters.anio === "todos" ? " Diciembre de 2025 llega hasta el 17, por eso la comparación de ese año corta en noviembre." : "";
    return "".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["periodText"])(filters.anio), ". ").concat(bucket.reservas.toLocaleString("es-AR"), " reservas en el corte.").concat(leadText).concat(cierre);
}
function actions(filters, cities, hosts, tipos, lead) {
    const best = [
        ...cities
    ].filter((city)=>city.reservas > 0).sort((a, b)=>b.adr - a.adr)[0];
    const worstCity = [
        ...cities
    ].filter((city)=>city.reservas > 0).sort((a, b)=>b.cancelPct - a.cancelPct)[0];
    const worstHost = [
        ...hosts
    ].filter((host)=>host.reservas >= 8).sort((a, b)=>b.cancelPct - a.cancelPct)[0];
    const healthyType = [
        ...tipos
    ].filter((tipo)=>tipo.estado === "En rango").sort((a, b)=>b.ingresos - a.ingresos)[0];
    return [
        {
            titulo: best ? "Cuidar ".concat(best.nombre) : "Cuidar el precio alto",
            detalle: best ? "".concat(best.nombre, " tiene el precio por noche más alto del corte (").concat(pesos(best.adr), ") y cancela ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(best.cancelPct), ". Esa plaza defiende el ingreso: no hace falta llenarla con un descuento.") : "No hay plazas en este corte."
        },
        {
            titulo: worstHost ? "Revisar a ".concat(worstHost.nombre) : "Revisar anfitriones",
            detalle: worstHost ? "".concat(worstHost.nombre, " cancela ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(worstHost.cancelPct), " en ").concat(worstHost.reservas, " reservas. ").concat(worstCity ? "".concat(worstCity.nombre, " es la plaza más floja, con ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(worstCity.cancelPct), ".") : "", " El umbral está en ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(filters.umbral), ".") : "No hay anfitriones en este corte."
        },
        {
            titulo: lead.gap != null && lead.gap > 0.01 ? "Pedir seña en la reserva larga" : healthyType ? "Sostener ".concat(healthyType.tipo) : "Sostener el umbral",
            detalle: lead.gap != null && lead.gap > 0.01 ? "La reserva con más de 30 días cancela ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(lead.larga - lead.corta), " más que la de la última semana. Una seña en esa ventana baja la pérdida antes de discutir el precio.") : "Con el umbral en ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPct"])(filters.umbral), ", el semáforo de cada plaza y cada anfitrión se recalcula en el mapa, el ranking y la dispersión.")
        }
    ];
}
function pesos(value) {
    return "$ ".concat(Math.round(value).toLocaleString("es-AR"));
}
function groupBy(rows, key) {
    const groups = new Map();
    for (const row of rows){
        const id = key(row);
        var _groups_get;
        const list = (_groups_get = groups.get(id)) !== null && _groups_get !== void 0 ? _groups_get : [];
        list.push(row);
        groups.set(id, list);
    }
    return groups;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_3e7523e4._.js.map