"use client";

import { Minus, Plus, SlidersHorizontal } from "lucide-react";
import { CANALES, REGIONES, TIPOS, type Medida, type Region, type Tipo } from "@/lib/types";
import { formatPct, measureLabel } from "@/lib/format";
import type { Anio, Canal } from "@/lib/types";
import { useDashboard } from "@/components/dashboard/provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const YEARS: { value: Anio; label: string }[] = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "todos", label: "Todo" },
];

const MEASURES: { value: Medida; label: string }[] = [
  { value: "ingresos", label: "Ingresos" },
  { value: "noches", label: "Noches" },
  { value: "reservas", label: "Reservas" },
];

export function FilterBar() {
  return (
    <div className="space-y-2">
      <div className="hidden lg:block">
        <FilterFields />
      </div>
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <Sheet>
          <SheetTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "bg-ivory")}>
            <SlidersHorizontal className="size-3.5" />
            Filtros y parámetros
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,22rem)] overflow-y-auto bg-paper">
            <SheetHeader>
              <SheetTitle>Filtros y parámetros</SheetTitle>
              <SheetDescription>El umbral y la medida cambian los gráficos en las dos hojas.</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-6">
              <FilterFields stacked />
            </div>
          </SheetContent>
        </Sheet>
        <ResetButton />
      </div>
      <p className="text-xs text-stone">
        Clic en una plaza o en un tipo de propiedad para cruzar las hojas. El mismo clic, o Esc, suelta la selección.
      </p>
    </div>
  );
}

function FilterFields({ stacked = false }: { stacked?: boolean }) {
  const { filters, update, isDefault } = useDashboard();
  const umbral = Math.round(filters.umbral * 100);

  return (
    <div className={cn("gap-4", stacked ? "grid" : "flex flex-wrap items-end")}>
      <Segmented
        label="Año"
        value={filters.anio}
        options={YEARS}
        onChange={(anio) => update({ anio })}
        testId="filtro-anio"
      />
      <Segmented
        label="Medida principal"
        value={filters.medida}
        options={MEASURES}
        onChange={(medida) => update({ medida })}
        testId="parametro-medida"
      />
      <Choice
        label="Región"
        value={filters.region}
        onChange={(region) => update({ region: region as Region | "todas" })}
        options={[{ value: "todas", label: "Todas" }, ...REGIONES.map((region) => ({ value: region, label: region }))]}
      />
      <Choice
        label="Canal"
        value={filters.canal}
        onChange={(canal) => update({ canal: canal as Canal | "todos" })}
        options={[{ value: "todos", label: "Todos" }, ...CANALES.map((canal) => ({ value: canal, label: canal }))]}
      />
      <Choice
        label="Tipo"
        value={filters.tipo}
        onChange={(tipo) => update({ tipo: tipo as Tipo | "todas" })}
        options={[{ value: "todas", label: "Todos" }, ...TIPOS.map((tipo) => ({ value: tipo, label: tipo }))]}
      />
      <div className={cn(stacked ? "w-full" : "w-72")}>
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <p className="text-[11px] font-medium tracking-[0.14em] text-stone uppercase">Umbral de cancelación</p>
          <p data-testid="umbral-value" className="num text-sm font-medium text-ink">
            {formatPct(filters.umbral, 0)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="bg-ivory text-ink"
            aria-label="Bajar el umbral un punto"
            disabled={umbral <= 8}
            onClick={() => update({ umbral: Math.max(8, umbral - 1) / 100 })}
          >
            <Minus />
          </Button>
          <Slider
            data-testid="parametro-umbral"
            className="min-w-0 flex-1"
            min={8}
            max={20}
            step={1}
            value={[umbral]}
            onValueChange={(value) => {
              const next = Array.isArray(value) ? value[0] : value;
              update({ umbral: next / 100 });
            }}
            aria-label="Umbral de cancelación"
          />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="bg-ivory text-ink"
            aria-label="Subir el umbral un punto"
            disabled={umbral >= 20}
            onClick={() => update({ umbral: Math.min(20, umbral + 1) / 100 })}
          >
            <Plus />
          </Button>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-stone">
          <span className="num">8%</span>
          <span>Parámetro. Recolorea lo que queda arriba.</span>
          <span className="num">20%</span>
        </div>
      </div>
      {!stacked && !isDefault ? <ResetButton /> : null}
      {stacked && !isDefault ? <ResetButton /> : null}
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  testId,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  testId?: string;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-medium tracking-[0.14em] text-stone uppercase">{label}</p>
      <div role="group" aria-label={label} data-testid={testId} className="flex flex-wrap gap-1">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant="ghost"
              aria-pressed={active}
              className={active ? "bg-ink text-ivory hover:bg-ink hover:text-ivory" : "text-stone hover:text-ink"}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
      {label === "Medida principal" ? (
        <p className="mt-1 text-[11px] text-stone">Parámetro. Cambia barras, orden y tamaño del mapa: {measureLabel(value as Medida).toLowerCase()}.</p>
      ) : null}
    </div>
  );
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-medium tracking-[0.14em] text-stone uppercase">{label}</p>
      <Select value={value} onValueChange={(next) => next && onChange(next)}>
        <SelectTrigger className="w-full min-w-36 bg-ivory" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ResetButton() {
  const { reset, isDefault } = useDashboard();
  if (isDefault) return null;
  return (
    <Button type="button" variant="outline" size="sm" className="bg-ivory" onClick={reset}>
      Restablecer
    </Button>
  );
}
