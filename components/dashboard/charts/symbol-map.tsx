"use client";

import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { useEffect, useMemo, useState } from "react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { useDashboard } from "@/components/dashboard/provider";
import { ChartTip } from "@/components/dashboard/tip";
import { useElementWidth } from "@/components/dashboard/use-size";
import { formatARS, formatInt, formatPct, formatVarPct, measureLabel } from "@/lib/format";
import { COLOR } from "@/lib/theme";
import type { FormaMapa } from "@/lib/types";
import { measureValue, type CityPoint } from "@/lib/view";

type Geo = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    properties: { codigo: string; nombre: string };
    geometry: GeoPermissibleObjects;
  }[];
};

export function SymbolMap() {
  const { view, filters, toggleCiudad } = useDashboard();
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const [geo, setGeo] = useState<Geo | null>(null);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/geo/provincias.json`)
      .then((response) => {
        if (!response.ok) throw new Error("mapa");
        return response.json() as Promise<Geo>;
      })
      .then((data) => {
        if (!cancelled) setGeo(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const height = width < 720 ? 460 : 470;
  const scene = useMemo(() => {
    if (!geo || width < 40) return null;
    const projection = geoMercator().fitExtent(
      [
        [12, 12],
        [width - 12, height - 12],
      ],
      geo as unknown as GeoPermissibleObjects,
    );
    return { projection, path: geoPath(projection) };
  }, [geo, width, height]);

  const cities = view.cities.filter((city) => city.reservas > 0);
  const values = cities.map((city) => measureValue(city, filters.medida));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const provinces = new Set(cities.map((city) => city.provinciaGeo));
  const hovered = cities.find((city) => city.id === hover) ?? view.selectedCity;

  return (
    <ChartCard
      kicker="Mapa de símbolos"
      title={`Dónde pesa ${measureLabel(filters.medida).toLowerCase()}`}
      description="El tamaño es la medida. El color es el estado de cancelación. La forma es la región: triángulo Patagonia, cuadrado norte, círculo el resto."
      testId="mapa"
      footer={
        hovered ? (
          <CityTip city={hovered} tipoOn={filters.tipo !== "todas"} />
        ) : view.alertCount === 0 ? (
          "Ninguna plaza de este corte queda sobre el umbral."
        ) : (
          `${view.alertCount} ${view.alertCount === 1 ? "plaza queda" : "plazas quedan"} sobre el umbral.`
        )
      }
    >
      <div ref={ref} className="min-h-[420px]">
        {failed ? <p className="text-sm text-alert">No se pudo cargar el mapa de provincias.</p> : null}
        {!geo && !failed ? <p className="text-sm text-stone">Cargando el mapa…</p> : null}
        {scene && geo ? (
          <svg viewBox={`0 0 ${Math.max(width, 1)} ${height}`} className="h-auto w-full" role="img" aria-label="Mapa de plazas de alquiler temporario en Argentina">
            {geo.features.map((feature) => (
              <path
                key={feature.properties.codigo}
                d={scene.path(feature as unknown as GeoPermissibleObjects) ?? ""}
                fill={provinces.has(feature.properties.nombre) ? COLOR.land : COLOR.landEmpty}
                stroke={COLOR.coast}
                strokeWidth={0.7}
              />
            ))}
            {cities.map((city) => (
              <CityMark
                key={city.id}
                city={city}
                point={scene.projection([city.lon, city.lat])}
                radius={radius(measureValue(city, filters.medida), min, max)}
                selected={filters.ciudadId === city.id}
                dim={Boolean(filters.ciudadId) && filters.ciudadId !== city.id}
                labeled={city.estado === "Sobre umbral"}
                onSelect={() => toggleCiudad(city.id)}
                onHover={setHover}
              />
            ))}
          </svg>
        ) : null}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone">
        <li className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-moss" /> En rango</li>
        <li className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-alert" /> Sobre el umbral</li>
        <li>Tamaño = {measureLabel(filters.medida).toLowerCase()}</li>
        <li>▲ Patagonia · ■ norte · ● resto</li>
      </ul>
    </ChartCard>
  );
}

function radius(value: number, min: number, max: number) {
  if (max <= min) return 8;
  const t = (value - min) / (max - min);
  return 6 + Math.sqrt(Math.max(0, t)) * 12;
}

function CityMark({
  city,
  point,
  radius: r,
  selected,
  dim,
  labeled,
  onSelect,
  onHover,
}: {
  city: CityPoint;
  point: [number, number] | null;
  radius: number;
  selected: boolean;
  dim: boolean;
  labeled: boolean;
  onSelect: () => void;
  onHover: (id: string | null) => void;
}) {
  if (!point) return null;
  const [x, y] = point;
  const fill = city.estado === "Sobre umbral" ? COLOR.alert : COLOR.moss;
  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${city.nombre}, ${city.forma}, ${city.estado}`}
      className="cursor-pointer outline-none"
      opacity={dim ? 0.32 : 1}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      onMouseEnter={() => onHover(city.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(city.id)}
      onBlur={() => onHover(null)}
    >
      <circle cx={x} cy={y} r={Math.max(r, 12)} fill="transparent" />
      <Mark forma={city.forma} x={x} y={y} r={r} fill={fill} selected={selected} />
      {labeled ? (
        <text x={x + r + 4} y={y + 3} fontSize={10} fill={COLOR.ink} fontFamily="inherit">
          {city.nombre}
        </text>
      ) : null}
    </g>
  );
}

function Mark({ forma, x, y, r, fill, selected }: { forma: FormaMapa; x: number; y: number; r: number; fill: string; selected: boolean }) {
  const stroke = selected ? COLOR.ink : COLOR.ivory;
  const strokeWidth = selected ? 2 : 1;
  if (forma === "Resto") return <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
  if (forma === "Norte") return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} rx={1.5} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
  const h = r * 1.15;
  return <path d={`M ${x} ${y - h} L ${x + r} ${y + h * 0.72} L ${x - r} ${y + h * 0.72} Z`} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
}

function CityTip({ city, tipoOn }: { city: CityPoint; tipoOn: boolean }) {
  const rows = [
    { label: "Ingresos", value: formatARS(city.ingresos) },
    { label: "Noches", value: formatInt(city.noches) },
    { label: "Reservas", value: String(city.reservas) },
    { label: "Cancelación", value: formatPct(city.cancelPct) },
    { label: "Precio por noche", value: formatARS(city.adr) },
    { label: "Variación de ingresos", value: formatVarPct(city.varIngresos) },
  ];
  if (tipoOn) rows.push({ label: "Ingresos de la ciudad, todos los tipos", value: formatARS(city.ingresosFixed) });
  return <ChartTip title={`${city.nombre} · ${city.provincia}`} meta={`${city.forma} · ${city.region} · ${city.estado}`} rows={rows} />;
}
