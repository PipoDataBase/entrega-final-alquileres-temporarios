"use client";

import { ChartCard } from "@/components/dashboard/chart-card";
import { useDashboard } from "@/components/dashboard/provider";
import { formatPct } from "@/lib/format";

export function MixFixed() {
  const { view, filters } = useDashboard();
  const rows = [...view.mix].sort((a, b) => b.mixSeleccion - a.mixSeleccion);
  const max = Math.max(...rows.flatMap((row) => [row.mixSeleccion, row.mixCadena]), 0.01);

  return (
    <ChartCard
      kicker="LOD FIXED"
      title="Mix de la selección contra el mix de la red"
      description="La barra terracota responde a región, canal, tipo y ciudad. La barra piedra es el mix FIXED de la red: no se mueve si cambiás la región. El año sí, porque es el marco del análisis."
      testId="mix-fixed"
      footer="La región elegida se marca. El FIXED sigue mostrando cómo se reparte el ingreso del año, aunque la selección quede en una sola región."
    >
      <ul className="space-y-3">
        {rows.map((row) => {
          const marked = filters.region === row.region;
          const dim = filters.region !== "todas" && !marked;
          return (
            <li key={row.region} className="grid grid-cols-[7.2rem_minmax(0,1fr)] items-center gap-3" style={{ opacity: dim ? 0.4 : 1 }}>
              <span className="text-sm text-ink">{row.region}</span>
              <div className="space-y-1">
                <Bar width={row.mixSeleccion / max} className="bg-terra" label={formatPct(row.mixSeleccion)} />
                <Bar width={row.mixCadena / max} className="bg-stone" label={formatPct(row.mixCadena)} />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-stone">
        <span className="inline-flex items-center gap-1.5"><i className="h-2 w-4 rounded-full bg-terra" /> Selección</span>
        <span className="inline-flex items-center gap-1.5"><i className="h-2 w-4 rounded-full bg-stone" /> Red, FIXED</span>
      </div>
    </ChartCard>
  );
}

function Bar({ width, className, label }: { width: number; className: string; label: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2">
      <span className="h-2 overflow-hidden rounded-full bg-paper">
        <span className={`block h-full rounded-full ${className}`} style={{ width: `${Math.max(width * 100, 0)}%` }} />
      </span>
      <span className="num text-[11px] text-stone">{label}</span>
    </div>
  );
}
