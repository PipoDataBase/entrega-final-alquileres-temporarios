import type { Metadata } from "next";
import { Documentacion } from "@/components/dashboard/documentacion";

export const metadata: Metadata = { title: "Documentación" };

export default function Page() {
  return <Documentacion />;
}
