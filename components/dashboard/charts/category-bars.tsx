"use client";

import { useState } from "react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { useDashboard } from "@/components/dashboard/provider";
import { ChartTip } from "@/components/dashboard/tip";
import { formatARS, formatInt, formatMeasure, formatPct, measureLabel } from "@/lib/format";
import { COLOR } from "@/lib/theme";
import { measureValue, type TipoPoint } from "@/lib/view";

export function CategoryBars() {
  const { view, filters, toggleTipo } = useDashboard();
  const [hover, setHover] = useState<string | null>(null);
  const ranked = [...view.tipos].sort((a, b) => measureValue(b, filters.medida) - measureValue(a, filters.medida));
  const max = Math.max(...ranked.map((tipo) => measureValue(tipo, filters.medida)), 1);
  const active = ranked.find((tipo) => tipo.tipo === (hover ?? (filters.tipo !== "todas" ? filters.tipo : ranked[0]?.tipo)));

  return (
    <ChartCard
      kicker="Barras"
      title={`Tipo de propiedad por ${measureLabel(filters.medida).toLowerCase()}`}
      description="El largo es la medida elegida. El punto musgo o alerta dice si la cancelación de ese tipo pasa el umbral. Un clic filtra el resto del tablero."
      testId="barras-categoria"
      footer={active ? <TipoDetail tipo={active} /> : "Pasá el cursor para ver la cancelación, que no está en el largo de la barra."}
    >
      <ul className="space-y-2">
        {ranked.map((tipo) => {
          const value = measureValue(tipo, filters.medida);
          const selected = filters.tipo === tipo.tipo;
          const dim = filters.tipo !== "todas" && !selected;
          return (
            <li key={tipo.tipo}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => toggleTipo(tipo.tipo)}
                onMouseEnter={() => setHover(tipo.tipo)}
                onFocus={() => setHover(tipo.tipo)}
                className="grid w-full grid-cols-[7.6rem_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-paper focus-visible:bg-paper"
                style={{ opacity: dim ? 0.38 : 1 }}
              >
                <span className="inline-flex items-center gap-1.5 text-sm text-ink">
                  <i className="size-2 shrink-0 rounded-full" style={{ background: tipo.estado === "Sobre umbral" ? COLOR.alert : COLOR.moss }} />
                  <span className="truncate">{tipo.tipo}</span>
                </span>
                <span className="h-2.5 overflow-hidden rounded-full bg-paper">
                  <span className="block h-full rounded-full bg-terra" style={{ width: `${(value / max) * 100}%` }} />
                </span>
                <span className="num text-xs text-ink">{formatMeasure(filters.medida, value)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}

function TipoDetail({ tipo }: { tipo: TipoPoint }) {
  return (
    <ChartTip
      title={tipo.tipo}
      meta={tipo.estado}
      rows={[
        { label: "Ingresos", value: formatARS(tipo.ingresos) },
        { label: "Noches", value: formatInt(tipo.noches) },
        { label: "Reservas", value: formatInt(tipo.reservas) },
        { label: "Cancelación", value: formatPct(tipo.cancelPct) },
      ]}
    />
  );
}
