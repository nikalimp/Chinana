import Link from "next/link";
import { site } from "@/content/site";
import type { Answer } from "@/content/answer-types";
import { Container, GridLines, Section, SectionHead } from "@/components/container";
import { Button } from "@/components/ui/button";
import { StepCard } from "@/components/cards";
import { FaqList } from "@/components/faq";
import { CtaFinal } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { answerSchema, breadcrumbs, faqSchema, graph } from "@/lib/schema";

// Ссылка-сноска на источник: [1] ведёт к списку источников внизу страницы.
function Ref({ n }: { n?: number | number[] }) {
  if (n === undefined) return null;
  const list = Array.isArray(n) ? n : [n];
  return (
    <sup className="ml-0.5 font-mono text-[11px]">
      {list.map((i, k) => (
        <span key={i}>
          {k > 0 && ","}
          <a href={`#src-${i}`} className="text-primary hover:underline">[{i}]</a>
        </span>
      ))}
    </sup>
  );
}

const dateRu = (iso: string) => new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

export function AnswerPage({ a, children }: { a: Answer; children?: React.ReactNode }) {
  const deep = a.path.split("/").filter(Boolean).length > 1; // крошки — только со второго уровня (стандарт §2.4)
  return (
    <>
      <JsonLd data={graph(answerSchema(a), faqSchema(a.faq), deep && breadcrumbs([{ name: a.crumb, path: a.path }]))} />

      <section className="relative overflow-hidden pb-[clamp(64px,9vw,120px)] pt-[clamp(40px,6vw,80px)] text-center">
        <GridLines />
        <div aria-hidden="true" lang="zh-Hans" className="zh-bg left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-[clamp(200px,30vw,420px)] text-primary opacity-[0.06]">{a.zh}</div>
        <Container>
          {deep ? (
            <nav aria-label="Хлебные крошки" className="font-mono text-xs text-muted-foreground">
              <Link href="/" className="hover:text-primary">Главная</Link> / {a.crumb}
            </nav>
          ) : <p className="font-mono text-xs uppercase text-primary">{a.eyebrow}</p>}
          <h1 className="mx-auto mt-[18px] max-w-[16ch] text-[clamp(36px,6vw,80px)]">{a.h1} <em>{a.h1Accent}</em></h1>
          <p className="mx-auto mt-6 max-w-[64ch] text-[clamp(17px,1.6vw,20px)] text-muted-foreground">{a.answer}</p>
          <p className="mt-4 font-mono text-xs text-muted-foreground">Факты проверены {dateRu(a.updated)}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild><a href={site.cta.href}>Задать вопрос менеджеру →</a></Button>
            <Button asChild variant="outline"><Link href="/programs/">Выбрать программу</Link></Button>
          </div>
          <div className="cards mt-14 grid-cols-1 text-left sm:grid-cols-2 lg:grid-cols-4">
            {a.facts.map((f) => (
              <div key={f.label} className="bg-card p-[22px]">
                <span className="font-mono text-xs uppercase text-muted-foreground">{f.label}</span>
                <b className="mt-2 block text-[22px] leading-tight">{f.value}<Ref n={f.src} /></b>
                {f.note && <span className="mt-1.5 block text-sm text-muted-foreground">{f.note}</span>}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {a.sections.map((s) => (
        <Section key={s.id} id={s.id}>
          <Container>
            <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} />
            <div className="mx-auto max-w-[72ch] space-y-4 text-[17px]">
              {s.paragraphs?.map((p, i) => <p key={i}>{p}{i === s.paragraphs!.length - 1 && !s.list && !s.table && <Ref n={s.src} />}</p>)}
              {s.list && (
                <ul>
                  {s.list.map((it) => (
                    <li key={it} className="flex gap-3 border-b border-grid-line py-2.5"><span aria-hidden="true" className="font-mono text-primary">—</span><span>{it}</span></li>
                  ))}
                  {!s.table && s.src && <li className="pt-2 text-sm text-muted-foreground">Источник: <Ref n={s.src} /></li>}
                </ul>
              )}
            </div>
            {s.steps && (
              <div className="cards mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {s.steps.map((st, i) => <StepCard key={st.title} n={i + 1} {...st} />)}
              </div>
            )}
            {s.table && (
              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-[15px]">
                  {s.table.caption && <caption className="mb-3 text-left font-mono text-xs text-muted-foreground">{s.table.caption} <Ref n={s.table.src ?? s.src} /></caption>}
                  <thead>
                    <tr>{s.table.head.map((h) => <th key={h} scope="col" className="border border-border bg-secondary px-4 py-3 text-left font-mono text-xs font-medium uppercase">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((r, i) => (
                      <tr key={i} className="bg-card">
                        {r.map((c, j) => j === 0
                          ? <th key={j} scope="row" className="border border-border px-4 py-3 text-left align-top font-medium">{c}</th>
                          : <td key={j} className="border border-border px-4 py-3 align-top tabular-nums">{c}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!s.table.caption && (s.table.src ?? s.src) && <p className="mt-2 text-sm text-muted-foreground">Источник: <Ref n={s.table.src ?? s.src} /></p>}
              </div>
            )}
          </Container>
        </Section>
      ))}

      {children}

      <Section>
        <Container>
          <SectionHead eyebrow="Частые вопросы" title={a.crumb} accent="вопросы и ответы" />
          <FaqList items={a.faq} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead eyebrow="Проверка фактов" title="Источники" />
          <ol className="mx-auto max-w-[72ch] space-y-2 text-[15px]">
            {a.sources.map((s, i) => (
              <li key={s.url} id={`src-${i + 1}`} className="flex gap-3 border-b border-grid-line py-2">
                <span className="font-mono text-primary">[{i + 1}]</span>
                <a href={s.url} rel="noopener" target="_blank" className="break-words hover:text-primary">{s.title}</a>
              </li>
            ))}
          </ol>
          <div className="mx-auto mt-10 flex max-w-[72ch] flex-wrap gap-3">
            {a.related.map((r) => <Button key={r.href} asChild variant="outline"><Link href={r.href}>{r.label}</Link></Button>)}
          </div>
        </Container>
      </Section>

      <CtaFinal />
    </>
  );
}
