export function ChartTip({ title, meta, rows }: { title: string; meta?: string; rows: { label: string; value: string }[] }) {
  return (
    <div className="min-w-52 rounded-lg border border-line bg-ivory px-3 py-2.5 text-ink shadow-[0_12px_30px_rgba(28,25,21,0.1)]">
      <p className="text-sm font-medium">{title}</p>
      {meta ? <p className="mt-0.5 text-xs leading-snug text-stone">{meta}</p> : null}
      <dl className="mt-2 space-y-1">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-6 text-xs">
            <dt className="text-stone">{row.label}</dt>
            <dd className="num font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
