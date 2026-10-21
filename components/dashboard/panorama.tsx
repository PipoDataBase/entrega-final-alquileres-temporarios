"use client";

import type { ReactNode } from "react";
import { ActionBanner, EmptyState, StoryHeader } from "@/components/dashboard/action-banner";
import { CategoryBars } from "@/components/dashboard/charts/category-bars";
import { Donut } from "@/components/dashboard/charts/donut";
import { DualAxis } from "@/components/dashboard/charts/dual-axis";
import { SymbolMap } from "@/components/dashboard/charts/symbol-map";
import { useDashboard } from "@/components/dashboard/provider";
import { Variation } from "@/components/dashboard/variation";
import { formatARS, formatInt, formatPct, measureLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Panorama() {
  const { view, filters } = useDashboard();
  if (view.empty) {
    return (
      <div className="space-y-5">
        <StoryHeader kicker="Hoja 1 · Panorama" title="Este corte no tiene reservas." dek={view.dek} />
        <EmptyState />
      </div>
    );
  }

  const primary =
    filters.medida === "noches" ? formatInt(view.kpis.noches) : filters.medida === "reservas" ? formatInt(view.kpis.reservas) : formatARS(view.kpis.ingresos);
  const primaryValue = filters.medida === "noches" ? view.kpis.varNoches : filters.medida === "reservas" ? view.kpis.varReservas : view.kpis.varIngresos;

  return (
    <div className="space-y-5">
      <StoryHeader kicker="Hoja 1 · Panorama" title={view.headline} dek={view.dek} />
      <ActionBanner />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores">
        <Kpi testId="kpi-medida" label={measureLabel(filters.medida)} value={primary} accent>
          <Variation value={primaryValue} caption={view.kpis.variationCaption} />
        </Kpi>
        <Kpi testId="kpi-margen" label="Cancelación" value={formatPct(view.kpis.cancelPct)}>
          <div className="flex flex-wrap items-center gap-2">
            <Variation value={view.kpis.varCancelPp} caption={view.kpis.variationCaption} mode="pp" intent="menos-es-mejor" />
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", view.kpis.estadoCancel === "Sobre umbral" ? "bg-alert/10 text-alert" : "bg-moss/10 text-moss")}>
              {view.kpis.estadoCancel}
            </span>
          </div>
        </Kpi>
        <Kpi testId="kpi-ticket" label="Precio por noche" value={formatARS(view.kpis.adr)}>
          <p className="text-xs text-stone">Promedio de la tarifa publicada</p>
        </Kpi>
        <Kpi testId="kpi-alerta" label={`Plazas sobre ${formatPct(filters.umbral, 0)}`} value={String(view.alertCount)} alert={view.alertCount > 0}>
          <p className="text-xs text-stone">de {view.cityCount} plazas visibles en el mapa</p>
        </Kpi>
      </section>
      <div className="grid items-start gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <DualAxis />
        </div>
        <div className="lg:col-span-4">
          <Donut />
        </div>
        <div className="lg:col-span-7">
          <SymbolMap />
        </div>
        <div className="lg:col-span-5">
          <CategoryBars />
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  children,
  accent = false,
  alert = false,
  testId,
}: {
  label: string;
  value: string;
  children: ReactNode;
  accent?: boolean;
  alert?: boolean;
  testId?: string;
}) {
  return (
    <article data-testid={testId} className="rounded-2xl border border-line bg-ivory px-4 py-3.5">
      <p className="text-[11px] font-medium tracking-[0.14em] text-stone uppercase">{label}</p>
      <p className={cn("num mt-1.5 text-[1.7rem] leading-none font-semibold tracking-tight", alert ? "text-alert" : accent ? "text-terra" : "text-ink")}>{value}</p>
      <div className="mt-2">{children}</div>
    </article>
  );
}
