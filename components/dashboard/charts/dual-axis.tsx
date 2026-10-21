"use client";

import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceArea } from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { useDashboard } from "@/components/dashboard/provider";
import { ChartTip } from "@/components/dashboard/tip";
import { formatARS, formatInt, formatPct, labelMesLargo, measureLabel } from "@/lib/format";
import { COLOR, SEASON_BAND } from "@/lib/theme";
import type { Temporada } from "@/lib/types";
import type { MonthPoint } from "@/lib/view";

export function DualAxis() {
  const { view, filters } = useDashboard();
  const key = filters.medida;
  const months = view.months;
  const measureMax = Math.max(...months.map((month) => month[key]), 1);
  const rates = months.map((month) => month.cancelPct);
  const yMin = Math.max(0, Math.min(...rates, filters.umbral) - 0.04);
  const yMax = Math.min(0.45, Math.max(...rates, filters.umbral) + 0.04);
  const high = months.filter((month) => month.cancelPct > filters.umbral);
  const highest = months.reduce((best, month) => (month.cancelPct > best.cancelPct ? month : best), months[0]);

  return (
    <ChartCard
      kicker="Eje doble"
      title={`${measureLabel(key)} y cancelación`}
      description="Las barras siguen la medida del parámetro. La línea es la tasa de cancelación. El punto se pone alerta cuando el mes supera el umbral."
      testId="eje-doble"
      footer={
        highest
          ? `Cancelación más alta del corte: ${highest.label}, ${formatPct(highest.cancelPct)}. ${
              high.length
                ? `Meses sobre el umbral: ${high
                    .slice(0, 4)
                    .map((month) => `${month.label} ${formatPct(month.cancelPct)}`)
                    .join(" · ")}.`
                : "Ningún mes de este corte supera el umbral."
            }`
          : undefined
      }
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={months} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            {seasonBands(months).map((band) => (
              <ReferenceArea key={`${band.x1}-${band.temporada}`} x1={band.x1} x2={band.x2} yAxisId="right" fill={SEASON_BAND[band.temporada]} fillOpacity={1} strokeOpacity={0} />
            ))}
            <CartesianGrid stroke={COLOR.line} vertical={false} />
            <XAxis
              dataKey="mes"
              ticks={months.filter((month) => month.mesNum === 1 || month.mesNum === 7).map((month) => month.mes)}
              tickFormatter={(mes: string) => months.find((month) => month.mes === mes)?.label ?? mes}
              tick={{ fill: COLOR.stone, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(value: number) => (key === "ingresos" ? formatARS(value) : formatInt(value))}
              domain={[0, measureMax * 1.15]}
              tick={{ fill: COLOR.stone, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value: number) => formatPct(value, 0)} domain={[yMin, yMax]} tick={{ fill: COLOR.stone, fontSize: 11 }} axisLine={false} tickLine={false} width={42} />
            <Tooltip
              cursor={{ fill: "rgba(28,25,21,0.04)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const month = payload[0].payload as MonthPoint;
                return (
                  <ChartTip
                    title={labelMesLargo(month.mes)}
                    meta={`Temporada del mes: ${month.temporada}`}
                    rows={[
                      { label: "Ingresos", value: formatARS(month.ingresos) },
                      { label: "Noches", value: formatInt(month.noches) },
                      { label: "Reservas", value: formatInt(month.reservas) },
                      { label: "Cancelación", value: formatPct(month.cancelPct) },
                    ]}
                  />
                );
              }}
            />
            <Bar yAxisId="left" dataKey={key} fill={COLOR.terra} radius={[3, 3, 0, 0]} maxBarSize={18} isAnimationActive={false} />
            <Line
              yAxisId="right"
              dataKey="cancelPct"
              stroke={COLOR.moss}
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props as { cx?: number; cy?: number; payload?: MonthPoint };
                if (cx == null || cy == null || !payload) return <g />;
                const above = payload.cancelPct > filters.umbral;
                return <circle key={payload.mes} cx={cx} cy={cy} r={above ? 3.5 : 2.4} fill={above ? COLOR.alert : COLOR.ivory} stroke={above ? COLOR.alert : COLOR.moss} strokeWidth={1.6} />;
              }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-stone">
        <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-terra" /> {measureLabel(key)}</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-full border border-moss bg-ivory" /> Cancelación en rango</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-alert" /> Cancelación sobre el umbral</span>
        <span>Las bandas suaves marcan la temporada del mes y no son una medida.</span>
      </div>
    </ChartCard>
  );
}

function seasonBands(months: MonthPoint[]) {
  const bands: { x1: string; x2: string; temporada: Temporada }[] = [];
  let start = 0;
  for (let index = 1; index <= months.length; index += 1) {
    const changed = index === months.length || months[index].temporada !== months[start].temporada;
    if (!changed) continue;
    bands.push({ x1: months[start].mes, x2: months[index - 1].mes, temporada: months[start].temporada });
    start = index;
  }
  return bands;
}
