"use client";

import { useDashboard } from "@/components/dashboard/provider";
import { Button } from "@/components/ui/button";

export function ActionBanner() {
  const { view, filters, toggleCiudad, toggleAnfitrion } = useDashboard();
  if (!filters.ciudadId && !filters.anfitrionId) return null;
  return (
    <div data-testid="banner-accion" className="flex flex-col gap-3 rounded-2xl border border-line bg-ivory px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm leading-relaxed text-ink">
        {view.selectedCity ? (
          <p>
            Acción de filtro: <strong>{view.selectedCity.nombre}</strong>. Los números, la dona, los tipos, los anfitriones y la nube muestran solo esa plaza. El mapa y el ranking siguen completos.
          </p>
        ) : null}
        {view.selectedHost ? (
          <p className={view.selectedCity ? "mt-1" : undefined}>
            Resaltado: <strong>{view.selectedHost.nombre}</strong>. El resto de los anfitriones queda en segundo plano.
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {filters.ciudadId ? (
          <Button type="button" variant="outline" size="sm" className="bg-paper" onClick={() => toggleCiudad(filters.ciudadId!)}>
            Quitar selección
          </Button>
        ) : null}
        {filters.anfitrionId ? (
          <Button type="button" variant="outline" size="sm" className="bg-paper" onClick={() => toggleAnfitrion(filters.anfitrionId!)}>
            Quitar resaltado
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function StoryHeader({ kicker, title, dek }: { kicker: string; title: string; dek: string }) {
  return (
    <header className="max-w-4xl">
      <p className="text-[11px] font-medium tracking-[0.16em] text-stone uppercase">{kicker}</p>
      <h1 data-testid="headline" className="mt-2 font-heading text-[1.7rem] leading-[1.15] text-balance text-ink md:text-[2.35rem]">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone md:text-[15px]">{dek}</p>
    </header>
  );
}

export function EmptyState() {
  const { reset } = useDashboard();
  return (
    <div className="rounded-2xl border border-dashed border-line bg-ivory px-6 py-16 text-center">
      <p className="font-heading text-2xl text-ink">Este corte no tiene reservas.</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone">La combinación de filtros dejó el tablero vacío. Restablecé el corte para volver a 2025.</p>
      <Button type="button" className="mt-5" onClick={reset}>
        Restablecer filtros
      </Button>
    </div>
  );
}
