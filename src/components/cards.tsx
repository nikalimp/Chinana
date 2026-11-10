import Link from "next/link";
import { site } from "@/content/site";
import { formatRub, type Program } from "@/content/programs";

export function ProgramCard({ p }: { p: Program }) {
  const rows = p.facts.slice(0, 3);
  return (
    <article className="flex min-h-[400px] flex-col gap-3.5 bg-card px-[22px] pb-6 pt-[26px] transition-colors hover:bg-card-hover">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[22px] font-bold uppercase leading-tight">{p.title}</h3>
        <span aria-hidden="true" lang="zh-Hans" className="font-zh text-[26px] font-black leading-none text-primary">{p.zh}</span>
      </div>
      <p>{p.short}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1.5 border-t border-grid-line pt-3.5 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="contents">
            <dt className="pt-0.5 font-mono text-xs uppercase text-muted-foreground">{r.label}</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-auto text-[15px]">
        Услуга от<b className="block text-2xl">{formatRub(p.price)}</b>
        <span className="font-mono text-[11px] text-muted-foreground">Ориентир, уточняется</span>
      </p>
      <Link href={`/programs/${p.slug}/`} className="font-semibold text-brand hover:underline">Подробнее →</Link>
    </article>
  );
}

export function UniCard({ zh, name, city, partner = false, href }: { zh: string; name: string; city: string; partner?: boolean; href?: string }) {
  return (
    <a href={href ?? site.cta.href} className="grid grid-cols-[auto_1fr] items-center gap-x-[18px] gap-y-1 bg-card p-[22px] transition-colors hover:bg-secondary">
      <span lang="zh-Hans" className="row-span-3 font-zh text-[34px] font-black leading-none tracking-[0.05em] text-primary [writing-mode:vertical-rl]">{zh}</span>
      <b className="text-[17px]">{name}</b>
      <span className="text-sm text-muted-foreground">{city}</span>
      {partner
        ? <span className="justify-self-start rounded-full bg-primary px-2.5 py-0.5 font-mono text-xs text-primary-foreground">Поступить →</span>
        : <span className="font-mono text-xs text-brand">{href ? "Подробнее →" : "Консультация →"}</span>}
    </a>
  );
}

export function StepCard({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="min-h-[220px] bg-card px-[22px] pb-7 pt-[26px]">
      <span className="font-mono text-[13px] text-primary">{String(n).padStart(2, "0")}</span>
      <h3 className="mb-2 mt-2.5 text-[19px] font-semibold">{title}</h3>
      <p className="text-[15px] text-muted-foreground">{text}</p>
    </div>
  );
}
