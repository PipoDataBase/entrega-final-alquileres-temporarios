import type { ReactNode } from "react";

export function ChartCard({
  kicker,
  title,
  description,
  children,
  footer,
  testId,
}: {
  kicker: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  testId?: string;
}) {
  return (
    <section data-testid={testId} className="flex h-full flex-col rounded-2xl border border-line bg-ivory p-4 md:p-5">
      <header className="mb-3">
        <p className="text-[11px] font-medium tracking-[0.14em] text-stone uppercase">{kicker}</p>
        <h2 className="mt-1 font-heading text-[1.35rem] leading-tight text-ink">{title}</h2>
        {description ? <p className="mt-1.5 text-sm leading-relaxed text-stone">{description}</p> : null}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      {footer ? <div className="mt-3 text-xs leading-relaxed text-stone">{footer}</div> : null}
    </section>
  );
}
