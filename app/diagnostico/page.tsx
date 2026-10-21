import type { Metadata } from "next";
import { Diagnostico } from "@/components/dashboard/diagnostico";

export const metadata: Metadata = { title: "Diagnóstico" };

export default function Page() {
  return <Diagnostico />;
}
