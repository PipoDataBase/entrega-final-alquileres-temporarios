"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_FILTERS } from "@/lib/metrics";
import { fromSearchParams, sameFilters, toQuery } from "@/lib/query";
import { RESERVAS } from "@/lib/reservas";
import type { DashboardFilters, Tipo } from "@/lib/types";
import { buildView, type DashboardView } from "@/lib/view";

type DashboardContextValue = {
  filters: DashboardFilters;
  view: DashboardView;
  update: (patch: Partial<DashboardFilters>) => void;
  toggleCiudad: (id: string) => void;
  toggleAnfitrion: (id: string) => void;
  toggleTipo: (tipo: Tipo) => void;
  reset: () => void;
  isDefault: boolean;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

const CITY_REGION = new Map(RESERVAS.map((row) => [row.ciudadId, row.region]));

function sanitize(next: DashboardFilters): DashboardFilters {
  const umbral = Math.min(0.2, Math.max(0.08, next.umbral));
  let ciudadId = next.ciudadId;
  if (ciudadId && next.region !== "todas" && CITY_REGION.get(ciudadId) !== next.region) ciudadId = null;
  return { ...next, umbral, ciudadId };
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<DashboardFilters>(() => fromSearchParams(params));

  const update = useCallback((patch: Partial<DashboardFilters>) => {
    setFilters((current) => sanitize({ ...current, ...patch }));
  }, []);

  const toggleCiudad = useCallback((id: string) => {
    setFilters((current) => sanitize({ ...current, ciudadId: current.ciudadId === id ? null : id }));
  }, []);

  const toggleAnfitrion = useCallback((id: string) => {
    setFilters((current) => sanitize({ ...current, anfitrionId: current.anfitrionId === id ? null : id }));
  }, []);

  const toggleTipo = useCallback((tipo: Tipo) => {
    setFilters((current) => sanitize({ ...current, tipo: current.tipo === tipo ? "todas" : tipo }));
  }, []);

  const reset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilters((current) => ({ ...current, ciudadId: null, anfitrionId: null }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const query = toQuery(filters);
    const next = query ? `${pathname}?${query}` : pathname;
    const currentQuery = params.toString();
    const current = currentQuery ? `${pathname}?${currentQuery}` : pathname;
    if (next === current) return;
    const timeout = window.setTimeout(() => {
      router.replace(next, { scroll: false });
    }, 160);
    return () => window.clearTimeout(timeout);
  }, [filters, params, pathname, router]);

  const view = useMemo(() => buildView(filters), [filters]);
  const isDefault = sameFilters(filters, DEFAULT_FILTERS);
  const value = useMemo(
    () => ({ filters, view, update, toggleCiudad, toggleAnfitrion, toggleTipo, reset, isDefault }),
    [filters, view, update, toggleCiudad, toggleAnfitrion, toggleTipo, reset, isDefault],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const value = useContext(DashboardContext);
  if (!value) throw new Error("useDashboard tiene que vivir dentro del tablero");
  return value;
}
