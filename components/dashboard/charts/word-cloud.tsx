"use client";

import { useMemo } from "react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { useDashboard } from "@/components/dashboard/provider";
import { useElementWidth } from "@/components/dashboard/use-size";
import { formatARS, formatPct } from "@/lib/format";
import { COLOR } from "@/lib/theme";
import { layoutWords } from "@/lib/words";

export function WordCloud() {
  const { view } = useDashboard();
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const height = 300;
  const placed = useMemo(() => layoutWords(view.words, Math.max(width, 0), height), [view.words, width]);
  const max = view.words[0]?.peso ?? 1;

  return (
    <ChartCard
      kicker="Nube de palabras"
      title="Barrios con más reservas"
      description="El tamaño es la cantidad de reservas. El color es el estado de cancelación del barrio, el mismo musgo y la misma alerta del mapa."
      testId="nube"
      footer="El tooltip suma la ciudad, la cancelación y los ingresos: eso no está escrito en la palabra."
    >
      <div ref={ref} className="min-h-[300px]">
        {width > 0 ? (
          <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Nube de barrios">
            {placed.map((word) => {
              const source = view.words.find((item) => item.token === word.token);
              const alert = source?.estado === "Sobre umbral";
              return (
                <text key={word.token} x={word.x} y={word.y + word.size} fontSize={word.size} fill={alert ? COLOR.alert : COLOR.moss} fontFamily="inherit" fontWeight={alert ? 600 : 500}>
                  <title>{source ? `${word.token} · ${source.ciudad} · cancelación ${formatPct(source.cancelPct)} · ${formatARS(source.ingresos)}` : word.token}</title>
                  {word.token}
                </text>
              );
            })}
          </svg>
        ) : null}
      </div>
      <ul className="mt-2 flex flex-wrap gap-3 text-[11px] text-stone">
        <li className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-alert" /> Sobre el umbral</li>
        <li className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-moss" /> En rango</li>
        <li>El peso relativo máximo de este corte es {max} reservas.</li>
      </ul>
    </ChartCard>
  );
}
