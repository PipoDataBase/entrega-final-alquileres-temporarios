"use client";

import { ActionBanner, EmptyState, StoryHeader } from "@/components/dashboard/action-banner";
import { MixFixed } from "@/components/dashboard/charts/mix-fixed";
import { ProductScatter } from "@/components/dashboard/charts/scatter-chart";
import { StoreRank } from "@/components/dashboard/charts/store-rank";
import { ProductTreemap } from "@/components/dashboard/charts/treemap-chart";
import { WordCloud } from "@/components/dashboard/charts/word-cloud";
import { useDashboard } from "@/components/dashboard/provider";
import { formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Diagnostico() {
  const { view, filters } = useDashboard();
  if (view.empty) {
    return (
      <div className="space-y-5">
        <StoryHeader kicker="Hoja 2 · Diagnóstico" title="Este corte no tiene reservas." dek={view.dek} />
        <EmptyState />
      </div>
    );
  }
  const worst = [...view.tipos].filter((tipo) => tipo.reservas > 0).sort((a, b) => b.cancelPct - a.cancelPct)[0];

  return (
    <div className="space-y-5">
      <StoryHeader kicker="Hoja 2 · Diagnóstico" title={view.resolutionTitle} dek={view.dek} />
      <ActionBanner />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores del diagnóstico">
        <Mini label="Tipo que más cancela" value={worst ? formatPct(worst.cancelPct) : "—"} note={worst?.tipo ?? ""} alert={worst ? worst.cancelPct > filters.umbral : false} />
        <Mini label="Plazas en alerta" value={String(view.alertCount)} note={`umbral ${formatPct(filters.umbral, 0)}`} alert={view.alertCount > 0} />
        <Mini
          label="Brecha de anticipación"
          value={view.brechaLargaCorta == null ? "—" : `${(view.brechaLargaCorta * 100).toFixed(1).replace(".", ",")} pp`}
          note="reserva larga menos última semana"
          alert={(view.brechaLargaCorta ?? 0) > 0.01}
        />
        <Mini label="Cancelación a último momento" value={formatPct(view.cancelCorta)} note="check-in en los 7 días siguientes" />
      </section>
      <ol className="grid gap-3 md:grid-cols-3">
        {view.actions.map((action, index) => (
          <li key={action.titulo} className="rounded-2xl border border-line bg-ivory p-4">
            <p className="text-[11px] font-medium tracking-[0.14em] text-stone uppercase">Decisión 0{index + 1}</p>
            <h2 className="mt-1 font-heading text-xl leading-tight text-ink">{action.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone">{action.detalle}</p>
          </li>
        ))}
      </ol>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <ProductTreemap />
        <ProductScatter />
        <StoreRank />
        <WordCloud />
      </div>
      <MixFixed />
    </div>
  );
}

function Mini({ label, value, note, alert = false }: { label: string; value: string; note: string; alert?: boolean }) {
  return (
    <article className="rounded-2xl border border-line bg-ivory px-4 py-3.5">
      <p className="text-[11px] font-medium tracking-[0.14em] text-stone uppercase">{label}</p>
      <p className={cn("num mt-1.5 text-[1.55rem] leading-none font-semibold tracking-tight", alert ? "text-alert" : "text-ink")}>{value}</p>
      <p className="mt-2 text-xs text-stone">{note}</p>
    </article>
  );
}
