"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FilterBar } from "@/components/dashboard/filters";
import { Logo } from "@/components/dashboard/logo";
import { useDashboard } from "@/components/dashboard/provider";
import { buttonVariants } from "@/components/ui/button";
import { hrefFor } from "@/lib/query";
import { cn } from "@/lib/utils";

const SHEETS = [
  { href: "/", label: "Panorama", index: "01", testId: "nav-panorama" },
  { href: "/diagnostico", label: "Diagnóstico", index: "02", testId: "nav-diagnostico" },
  { href: "/documentacion", label: "Documentación", index: "03", testId: "nav-documentacion" },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { filters } = useDashboard();
  const analytical = pathname === "/" || pathname.startsWith("/diagnostico");
  const current = SHEETS.find((sheet) => (sheet.href === "/" ? pathname === "/" : pathname.startsWith(sheet.href)));

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-ivory focus:px-3 focus:py-2">
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link href={hrefFor("/", filters)} className="flex items-center gap-3">
            <Logo />
            <span>
              <span className="block font-heading text-xl leading-none text-ink">Alquileres</span>
              <span className="mt-1 block text-[11px] tracking-[0.16em] text-stone uppercase">Temporarios</span>
            </span>
          </Link>
          <nav aria-label="Hojas del tablero" className="flex flex-wrap gap-1">
            {SHEETS.map((sheet) => {
              const active = sheet.href === "/" ? pathname === "/" : pathname.startsWith(sheet.href);
              return (
                <Link
                  key={sheet.href}
                  href={hrefFor(sheet.href, filters)}
                  data-testid={sheet.testId}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    active ? "bg-ink text-ivory hover:bg-ink hover:text-ivory" : "text-stone hover:text-ink",
                  )}
                >
                  <span className="num text-[10px] opacity-70">{sheet.index}</span>
                  {sheet.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {analytical ? (
          <div className="mx-auto max-w-[1240px] px-4 pb-3 md:px-6">
            <FilterBar />
          </div>
        ) : null}
      </header>
      <main id="contenido" className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-4 py-5 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-stone">
              Valentino Nicolas Vallone · {current ? `Hoja ${current.index} de 03 · ${current.label}` : "Alquileres"} · Importes en pesos · Check-in 2023–2025
            </p>
            <nav aria-label="Navegación inferior" className="flex flex-wrap gap-1">
              {SHEETS.map((sheet) => {
                const active = sheet.href === "/" ? pathname === "/" : pathname.startsWith(sheet.href);
                return (
                  <Link
                    key={`foot-${sheet.href}`}
                    href={hrefFor(sheet.href, filters)}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "bg-ivory",
                      active && "border-ink",
                    )}
                  >
                    {sheet.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <p className="max-w-3xl text-xs leading-relaxed text-stone">
            Dataset de la pre-entrega 1: alquileres temporarios en Argentina. No es Supertienda. La región del filtro es comercial: Mar del Plata y La Plata están en Centro, y CABA está en AMBA.
          </p>
        </div>
      </footer>
    </div>
  );
}
