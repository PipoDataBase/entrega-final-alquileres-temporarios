"use client";

import { useState } from "react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { useDashboard } from "@/components/dashboard/provider";
import { ChartTip } from "@/components/dashboard/tip";
import { formatARS, formatPct, formatVarPct } from "@/lib/format";
import { COLOR } from "@/lib/theme";
import type { CityPoint } from "@/lib/view";

export function StoreRank() {
  const { view, filters, toggleCiudad } = useDashboard();
  const [hover, setHover] = useState<string | null>(null);
  const ranked = [...view.cities].filter((city) => city.reservas > 0).sort((a, b) => b.cancelPct - a.cancelPct);
  const domain = Math.max(0.28, filters.umbral + 0.04, ...ranked.map((city) => city.cancelPct));
  const active = ranked.find((city) => city.id === (hover ?? filters.ciudadId)) ?? ranked[0];

  return (
    <ChartCard
      kicker="Ranking"
      title="Cancelación por plaza"
      description="La línea punteada es el umbral. Si lo movés, las plazas cambian de color. Un clic hace la misma acción de filtro que el mapa."
      testId="ranking-tiendas"
      footer={active ? <CityDetail city={active} tipoOn={filters.tipo !== "todas"} /> : null}
    >
      <ul className="space-y-1">
        {ranked.map((city) => {
          const selected = filters.ciudadId === city.id;
          const dim = Boolean(filters.ciudadId) && !selected;
          return (
            <li key={city.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => toggleCiudad(city.id)}
                onMouseEnter={() => setHover(city.id)}
                onFocus={() => setHover(city.id)}
                className="grid w-full grid-cols-[8.2rem_minmax(0,1fr)_3.2rem] items-center gap-2 rounded-md px-0.5 py-0.5 text-left"
                style={{ opacity: dim ? 0.35 : 1 }}
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-ink">
                  <Shape forma={city.forma} />
                  <span className="truncate">{city.nombre}</span>
                </span>
                <span className="relative h-2 overflow-hidden rounded-full bg-paper">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${Math.max(0, (city.cancelPct / domain) * 100)}%`,
                      background: city.estado === "Sobre umbral" ? COLOR.alert : COLOR.moss,
                      outline: selected ? `1px solid ${COLOR.ink}` : undefined,
                    }}
                  />
                  <span className="pointer-events-none absolute inset-y-0 z-10 border-l border-dashed border-alert" style={{ left: `${(filters.umbral / domain) * 100}%` }} />
                </span>
                <span className="num text-right text-xs text-ink">{formatPct(city.cancelPct, 0)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}

function Shape({ forma }: { forma: CityPoint["forma"] }) {
  if (forma === "Patagonia") {
    return <svg viewBox="0 0 10 10" className="size-2.5 shrink-0" aria-hidden><path d="M5 1 L9 9 H1 Z" fill={COLOR.ink} /></svg>;
  }
  if (forma === "Norte") return <i className="size-2 shrink-0 bg-ink" aria-hidden />;
  return <i className="size-2 shrink-0 rounded-full bg-ink" aria-hidden />;
}

function CityDetail({ city, tipoOn }: { city: CityPoint; tipoOn: boolean }) {
  const rows = [
    { label: "Ingresos", value: formatARS(city.ingresos) },
    { label: "Cancelación", value: formatPct(city.cancelPct) },
    { label: "Precio por noche", value: formatARS(city.adr) },
    { label: "Variación de ingresos", value: formatVarPct(city.varIngresos) },
    { label: "Reservas", value: String(city.reservas) },
  ];
  if (tipoOn) rows.push({ label: "Ingresos de la ciudad, todos los tipos", value: formatARS(city.ingresosFixed) });
  return <ChartTip title={city.nombre} meta={`${city.provincia} · ${city.forma} · ${city.region} · ${city.estado}`} rows={rows} />;
}
