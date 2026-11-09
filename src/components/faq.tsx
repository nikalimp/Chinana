import type { Faq } from "@/content/programs";

// FAQ на <details>: ответ в HTML, раскрытие без JavaScript. Ширина — 8 из 12 колонок по центру.
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="mx-auto md:max-w-[calc(100%*8/12)]">
      {items.map((f, i) => (
        <details key={f.q} open={i === 0} className="group border-t border-border last:border-b">
          <summary className="flex cursor-pointer list-none justify-between gap-5 py-5 [&::-webkit-details-marker]:hidden">
            <h3 className="text-lg font-semibold">{f.q}</h3>
            <span aria-hidden="true" className="font-mono text-[22px] leading-none text-primary group-open:hidden">+</span>
            <span aria-hidden="true" className="hidden font-mono text-[22px] leading-none text-primary group-open:inline">−</span>
          </summary>
          <p className="max-w-[64ch] pb-5 text-muted-foreground">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
