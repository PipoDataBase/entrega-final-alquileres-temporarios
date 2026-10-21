import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Suspense } from "react";
import { DashboardProvider } from "@/components/dashboard/provider";
import { Shell } from "@/components/dashboard/shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Alquileres temporarios",
    template: "%s · Alquileres",
  },
  description:
    "Tablero de alquileres temporarios en Argentina. Ingresos, cancelación y plazas para revisar entre 2023 y 2025.",
  authors: [{ name: "Valentino Nicolas Vallone" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-paper text-ink">
        <TooltipProvider>
          <Suspense fallback={<p className="px-6 py-10 text-sm text-stone">Cargando el tablero…</p>}>
            <DashboardProvider>
              <Shell>{children}</Shell>
            </DashboardProvider>
          </Suspense>
        </TooltipProvider>
      </body>
    </html>
  );
}
