import type { Metadata } from "next";
import { Panorama } from "@/components/dashboard/panorama";

export const metadata: Metadata = { title: "Panorama" };

export default function Page() {
  return <Panorama />;
}
