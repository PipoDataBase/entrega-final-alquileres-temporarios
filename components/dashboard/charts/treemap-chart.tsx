"use client";

import { useMemo } from "react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { useDashboard } from "@/components/dashboard/provider";
import { useElementWidth } from "@/components/dashboard/use-size";
import { formatARS, formatPct } from "@/lib/format";
import { COLOR } from "@/lib/theme";
import { squarify } from "@/lib/treemap";

export function ProductTreemap() {
  const { view, filters, toggleAnfitrion } = useDashboard();
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const height = 320;
  const rects = useMemo(
    () => squarify(view.hosts.map((host) => ({ id: host.id, value: host.ingresos })), Math.max(width, 0), height),
    [view.hosts, width],
  );
  const byId = new Map(view.hosts.map((host) => [host.id, host]));

  return (
    <ChartCard
      kicker="Treemap"
      title="Anfitriones por ingreso"
      description="El área es el ingreso. El color es el estado de cancelación, el mismo musgo y la misma alerta del mapa. Un clic resalta al anfitrión en la dispersión."
      testId="treemap"
    >
      <div ref={ref}>
        {width > 0 ? (
          <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Treemap de anfitriones">
            {rects.map((rect) => {
              const host = byId.get(rect.id);
              if (!host) return null;
              const selected = filters.anfitrionId === host.id;
              const dim = Boolean(filters.anfitrionId) && !selected;
              const fill = host.estado === "Sobre umbral" ? COLOR.alert : COLOR.moss;
              const showName = rect.w > 78 && rect.h > 36;
              const showRate = rect.w > 78 && rect.h > 54;
              return (
                <g
                  key={rect.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  aria-label={`${host.nombre}, ${formatPct(host.cancelPct)}`}
                  className="cursor-pointer outline-none"
                  opacity={dim ? 0.28 : 1}
                  onClick={() => toggleAnfitrion(host.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleAnfitrion(host.id);
                    }
                  }}
                >
                  <rect x={rect.x + 1} y={rect.y + 1} width={Math.max(rect.w - 2, 0)} height={Math.max(rect.h - 2, 0)} rx={4} fill={fill} stroke={selected ? COLOR.ink : COLOR.ivory} strokeWidth={selected ? 2 : 1} />
                  {showName ? (
                    <text x={rect.x + 8} y={rect.y + 18} fill="#FBF8F3" fontSize={12} fontFamily="inherit">
                      {truncate(host.nombre, Math.floor(rect.w / 7))}
                    </text>
                  ) : null}
                  {showRate ? (
                    <text x={rect.x + 8} y={rect.y + 34} fill="#FBF8F3" fontSize={11} fontFamily="inherit">
                      {formatPct(host.cancelPct)} · {formatARS(host.ingresos)}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        ) : (
          <div className="h-[320px]" />
        )}
      </div>
    </ChartCard>
  );
}

function truncate(value: string, length: number) {
  if (length < 4) return "";
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}
