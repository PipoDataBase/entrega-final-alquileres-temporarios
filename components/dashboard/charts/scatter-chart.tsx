"use client";

import { CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { useDashboard } from "@/components/dashboard/provider";
import { ChartTip } from "@/components/dashboard/tip";
import { formatARS, formatPct, formatVarPct } from "@/lib/format";
import { COLOR } from "@/lib/theme";
import type { FormaAnfitrion } from "@/lib/types";
import type { HostPoint } from "@/lib/view";

export function ProductScatter() {
  const { view, filters, toggleAnfitrion } = useDashboard();
  const points = view.hosts.filter((host) => host.varIngresos != null);
  const above = [...points].filter((host) => host.estado === "Sobre umbral").sort((a, b) => b.cancelPct - a.cancelPct);
  const xs = points.map((host) => host.varIngresos ?? 0);
  const ys = points.map((host) => host.cancelPct);
  const xPad = 0.04;
  const xMin = Math.min(...xs, 0) - xPad;
  const xMax = Math.max(...xs, 0) + xPad;
  const yMin = Math.max(0, Math.min(...ys, filters.umbral) - 0.04);
  const yMax = Math.min(0.45, Math.max(...ys, filters.umbral) + 0.04);
  const sales = points.map((host) => host.ingresos);
  const minSales = Math.min(...sales);
  const maxSales = Math.max(...sales);

  return (
    <ChartCard
      kicker="Dispersión"
      title="Variación contra cancelación"
      description="Cada punto es un anfitrión. La forma es el tipo de propiedad donde más ingresa. La línea horizontal es el umbral y se mueve con el parámetro."
      testId="dispersion"
      footer={
        points.length === 0
          ? "2023 no tiene año base: la dispersión necesita la variación. Pasá a 2024 o 2025."
          : above.length
            ? `Sobre el umbral: ${above
                .slice(0, 4)
                .map((host) => `${host.nombre} ${formatPct(host.cancelPct)}`)
                .join(" · ")}.`
            : "Ningún anfitrión de este corte queda sobre el umbral."
      }
    >
      {points.length === 0 ? (
        <p className="py-16 text-center text-sm text-stone">Sin variación para graficar en este año.</p>
      ) : (
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={COLOR.line} />
              <XAxis type="number" dataKey="varIngresos" domain={[xMin, xMax]} tickFormatter={(value: number) => formatPct(value, 0)} tick={{ fill: COLOR.stone, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="number" dataKey="cancelPct" domain={[yMin, yMax]} tickFormatter={(value: number) => formatPct(value, 0)} tick={{ fill: COLOR.stone, fontSize: 11 }} axisLine={false} tickLine={false} width={42} />
              <ZAxis dataKey="ingresos" range={[60, 280]} />
              <ReferenceLine x={0} stroke={COLOR.stone} strokeDasharray="3 3" />
              <ReferenceLine y={filters.umbral} stroke={COLOR.alert} strokeDasharray="4 3" label={{ value: "Umbral", fill: COLOR.alert, fontSize: 11, position: "insideTopRight" }} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const host = payload[0].payload as HostPoint;
                  return (
                    <ChartTip
                      title={host.nombre}
                      meta={`${host.forma} · ${formatPct(host.superPct, 0)} de sus reservas son de superanfitrión`}
                      rows={[
                        { label: "Ingresos", value: formatARS(host.ingresos) },
                        { label: "Cancelación", value: formatPct(host.cancelPct) },
                        { label: "Variación de ingresos", value: formatVarPct(host.varIngresos) },
                        { label: "Precio por noche", value: formatARS(host.adr) },
                      ]}
                    />
                  );
                }}
              />
              <Scatter
                data={points}
                isAnimationActive={false}
                shape={(raw) => {
                  const props = raw as { cx?: number; cy?: number; payload?: HostPoint };
                  if (props.cx == null || props.cy == null || !props.payload) return <g />;
                  const host = props.payload;
                  const selected = filters.anfitrionId === host.id;
                  const dim = Boolean(filters.anfitrionId) && !selected;
                  const r = pointRadius(host.ingresos, minSales, maxSales);
                  return (
                    <g opacity={dim ? 0.2 : 1} className="cursor-pointer" onClick={() => toggleAnfitrion(host.id)}>
                      <HostShape forma={host.forma} cx={props.cx} cy={props.cy} r={r} fill={host.estado === "Sobre umbral" ? COLOR.alert : COLOR.moss} selected={selected} />
                    </g>
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone">
        <li>▲ casa o cabaña</li>
        <li>● departamento, PH o loft</li>
        <li>■ estudio</li>
        <li>Color = estado de cancelación, no el tipo</li>
      </ul>
    </ChartCard>
  );
}

function pointRadius(value: number, min: number, max: number) {
  if (max <= min) return 8;
  return 6 + Math.sqrt((value - min) / (max - min)) * 10;
}

function HostShape({ forma, cx, cy, r, fill, selected }: { forma: FormaAnfitrion; cx: number; cy: number; r: number; fill: string; selected: boolean }) {
  const stroke = selected ? COLOR.ink : COLOR.ivory;
  const strokeWidth = selected ? 2 : 1;
  if (forma === "Casa o cabaña") {
    const h = r * 1.1;
    return <path d={`M ${cx} ${cy - h} L ${cx + r} ${cy + h * 0.7} L ${cx - r} ${cy + h * 0.7} Z`} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
  }
  if (forma === "Estudio") {
    return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
  }
  return <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
}
