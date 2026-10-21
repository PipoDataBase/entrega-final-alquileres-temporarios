"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { useDashboard } from "@/components/dashboard/provider";
import { ChartTip } from "@/components/dashboard/tip";
import { formatARS, formatPct } from "@/lib/format";
import { CANAL_COLOR } from "@/lib/theme";
import type { ChannelPoint } from "@/lib/view";

export function Donut() {
  const { view } = useDashboard();
  const leader = [...view.channels].sort((a, b) => b.ingresos - a.ingresos)[0];

  return (
    <ChartCard
      kicker="Dona"
      title="Mix por canal"
      description="El color identifica al canal y se repite solo acá. La cancelación de cada uno está en el detalle, no en la torta."
      testId="dona"
    >
      <div className="relative h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={view.channels} dataKey="ingresos" nameKey="canal" innerRadius="62%" outerRadius="88%" stroke="#FBF8F3" strokeWidth={3} isAnimationActive={false}>
              {view.channels.map((channel) => (
                <Cell key={channel.canal} fill={CANAL_COLOR[channel.canal]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const channel = payload[0].payload as ChannelPoint;
                return (
                  <ChartTip
                    title={channel.canal}
                    meta="La cancelación no se ve en la dona: está acá."
                    rows={[
                      { label: "Ingresos", value: formatARS(channel.ingresos) },
                      { label: "Participación", value: formatPct(channel.mix) },
                      { label: "Cancelación", value: formatPct(channel.cancelPct) },
                    ]}
                  />
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {leader ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[11px] tracking-[0.14em] text-stone uppercase">Líder</p>
            <p className="max-w-28 text-center font-heading text-lg leading-tight text-ink">{leader.canal}</p>
            <p className="num text-sm text-stone">{formatPct(leader.mix, 0)}</p>
          </div>
        ) : null}
      </div>
      <ul className="mt-2 space-y-1.5">
        {view.channels.map((channel) => (
          <li key={channel.canal} className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2">
              <i className="size-2.5 rounded-full" style={{ background: CANAL_COLOR[channel.canal] }} />
              {channel.canal}
            </span>
            <span className="num text-stone">
              {formatPct(channel.mix)} · {formatARS(channel.ingresos)}
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
