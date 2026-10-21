import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatPp, formatVarPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Variation({
  value,
  caption,
  mode = "pct",
  intent = "mas-es-mejor",
}: {
  value: number | null;
  caption?: string | null;
  mode?: "pct" | "pp";
  intent?: "mas-es-mejor" | "menos-es-mejor";
}) {
  if (value == null || !Number.isFinite(value)) {
    return <p className="text-xs text-stone">Sin año base</p>;
  }
  const up = value > 0.0005;
  const down = value < -0.0005;
  const Icon = up ? ArrowUpRight : down ? ArrowDownRight : Minus;
  const favorable = intent === "menos-es-mejor" ? down : up;
  const color = !up && !down ? "text-stone" : favorable ? "text-moss" : "text-alert";
  const word = !up && !down ? "Estable" : intent === "menos-es-mejor" ? (up ? "Sube" : "Baja") : up ? "Alza" : "Caída";
  return (
    <p className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs font-medium", color)}>
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span className="num">{mode === "pp" ? formatPp(value) : formatVarPct(value)}</span>
      <span className="font-normal">{word}</span>
      {caption ? <span className="font-normal text-stone">{caption}</span> : null}
    </p>
  );
}
