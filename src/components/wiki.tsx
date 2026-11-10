import Link from "next/link";
import { site } from "@/content/site";
import type { Answer } from "@/content/answer-types";
import { wikiSections, wikiSectionOf } from "@/content/wiki";
import { Container, GridLines } from "@/components/container";
import { Button } from "@/components/ui/button";
import { FaqList } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { answerSchema, faqSchema, graph } from "@/lib/schema";

// Оглавление Wiki: на десктопе — колонка слева, на телефоне — раскрывающийся блок над статьёй (без JavaScript).
export function WikiNav({ current }: { current?: string }) {
  const list = (
    <nav aria-label="Разделы Wiki" className="text-[15px]">
      <Link href="/wiki/" className={`mb-4 block font-mono text-xs uppercase ${current === "/wiki/" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>Все разделы Wiki</Link>
      {wikiSections.map((s) => (
        <div key={s.id} className="mb-5">
          <p className="mb-1.5 flex items-baseline gap-2 font-semibold">
            <span aria-hidden="true" lang="zh-Hans" className="font-zh text-sm font-black text-primary">{s.zh}</span>{s.title}
          </p>
          <ul className="border-l border-grid-line">
            {[...s.articles.map((a) => ({ href: a.path, title: a.crumb })), ...(s.extra ?? [])].map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={l.href === current ? "page" : undefined} className={`-ml-px block border-l py-1 pl-3 ${l.href === current ? "border-primary font-medium text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{l.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
  return (
    <>
      <details className="mb-8 border border-border bg-card lg:hidden">
        <summary className="cursor-pointer px-4 py-3 font-mono text-xs uppercase">Все статьи Wiki</summary>
        <div className="border-t border-border px-4 py-4">{list}</div>
      </details>
      <aside className="hidden lg:col-span-2 lg:col-start-11 lg:row-start-1 lg:block">
        <div className="sticky top-[92px] max-h-[calc(100vh-110px)] overflow-y-auto pl-4">{list}</div>
      </aside>
    </>
  );
}

export function WikiShell({ current, children }: { current?: string; children: React.ReactNode }) {
  return (
    <section className="relative overflow-clip pb-[clamp(64px,9vw,120px)] pt-[clamp(32px,5vw,64px)]">
      <GridLines />
      <Container>
        <div className="grid lg:grid-cols-12">
          <WikiNav current={current} />
          <div className="min-w-0 lg:col-span-10 lg:col-start-1 lg:row-start-1 lg:pr-[clamp(24px,3vw,48px)]">{children}</div>
        </div>
      </Container>
    </section>
  );
}

function Ref({ n }: { n?: number | number[] }) {
  if (n === undefined) return null;
  const list = Array.isArray(n) ? n : [n];
  return (
    <sup className="ml-0.5 font-mono text-[11px]">
      {list.map((i, k) => <span key={i}>{k > 0 && ","}<a href={`#src-${i}`} className="text-primary hover:underline">[{i}]</a></span>)}
    </sup>
  );
}

const dateRu = (iso: string) => new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

// Статья Wiki: прямой ответ, ключевые цифры, оглавление, разделы, вопросы, источники.
export function WikiArticle({ a }: { a: Answer }) {
  const sec = wikiSectionOf(a);
  return (
    <WikiShell current={a.path}>
      <JsonLd data={graph(answerSchema(a), a.faq.length > 0 && faqSchema(a.faq))} />
      <article className="max-w-[46em]">
        <p className="font-mono text-xs uppercase tracking-wide text-primary">Wiki / {sec.title}</p>
        <h1 className="mt-4 text-[clamp(32px,4.6vw,60px)]">{a.h1} <em>{a.h1Accent}</em></h1>
        <p className="mt-6 text-[clamp(17px,1.5vw,19px)]">{a.answer}</p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">Факты проверены {dateRu(a.updated)}, источники внизу страницы</p>

        {a.facts.length > 0 && (
          <div className="cards mt-8 grid-cols-1 sm:grid-cols-2">
            {a.facts.map((f) => (
              <div key={f.label} className="bg-card p-[18px]">
                <span className="font-mono text-xs uppercase text-muted-foreground">{f.label}</span>
                <b className="mt-1.5 block text-xl leading-tight">{f.value}<Ref n={f.src} /></b>
                {f.note && <span className="mt-1 block text-sm text-muted-foreground">{f.note}</span>}
              </div>
            ))}
          </div>
        )}

        {a.sections.length > 2 && (
          <nav aria-label="На этой странице" className="mt-8 border-l-2 border-primary pl-4">
            <p className="font-mono text-xs uppercase text-muted-foreground">На этой странице</p>
            <ol className="mt-2 space-y-1 text-[15px]">
              {a.sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="hover:text-primary">{s.title}{s.accent ? ` ${s.accent}` : ""}</a></li>)}
            </ol>
          </nav>
        )}

        {a.sections.map((s) => (
          <section key={s.id} id={s.id} className="mt-12 scroll-mt-24">
            <h2 className="text-[clamp(24px,2.8vw,34px)]">{s.title} {s.accent && <em>{s.accent}</em>}</h2>
            <div className="mt-4 space-y-4 text-[17px]">
              {s.paragraphs?.map((p, i) => <p key={i}>{p}{i === s.paragraphs!.length - 1 && !s.list && !s.table && !s.steps && <Ref n={s.src} />}</p>)}
              {s.steps && (
                <ol className="cards grid-cols-1 sm:grid-cols-2">
                  {s.steps.map((st, i) => (
                    <li key={st.title} className="bg-card p-[18px]">
                      <span className="font-mono text-[13px] text-primary">{String(i + 1).padStart(2, "0")}</span>
                      <b className="mt-1.5 block">{st.title}</b>
                      <span className="mt-1 block text-[15px] text-muted-foreground">{st.text}</span>
                    </li>
                  ))}
                </ol>
              )}
              {s.list && (
                <ul>
                  {s.list.map((it) => <li key={it} className="flex gap-3 border-b border-grid-line py-2"><span aria-hidden="true" className="font-mono text-primary">—</span><span>{it}</span></li>)}
                </ul>
              )}
              {s.table && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] border-collapse text-[15px]">
                    {s.table.caption && <caption className="mb-2 text-left font-mono text-xs text-muted-foreground">{s.table.caption} <Ref n={s.table.src ?? s.src} /></caption>}
                    <thead><tr>{s.table.head.map((h, i) => <th key={i} scope="col" className="border border-border bg-secondary px-3 py-2.5 text-left font-mono text-xs font-medium uppercase">{h}</th>)}</tr></thead>
                    <tbody>
                      {s.table.rows.map((r, i) => (
                        <tr key={i} className="bg-card">
                          {r.map((c, j) => j === 0 ? <th key={j} scope="row" className="border border-border px-3 py-2.5 text-left align-top font-medium">{c}</th> : <td key={j} className="border border-border px-3 py-2.5 align-top tabular-nums">{c}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {(s.list || s.table || s.steps) && s.src && <p className="text-sm text-muted-foreground">Источник: <Ref n={s.src} /></p>}
            </div>
          </section>
        ))}

        <aside className="mt-14 grid gap-4 border border-border bg-secondary p-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <p><b className="block text-lg">Разберём ваш случай</b><span className="text-muted-foreground">Напишите менеджеру — подберём программу, вуз и грант под вас.</span></p>
          <Button asChild><a href={site.cta.href} data-lead>Оставить заявку</a></Button>
        </aside>

        {a.faq.length > 0 && (
          <section id="faq" className="mt-14">
            <h2 className="text-[clamp(24px,2.8vw,34px)]">Частые <em>вопросы</em></h2>
            <div className="mt-4"><FaqList items={a.faq} /></div>
          </section>
        )}

        <section id="sources" className="mt-14">
          <h2 className="text-[clamp(22px,2.4vw,28px)]">Источники</h2>
          <ol className="mt-4 space-y-1.5 text-[14px]">
            {a.sources.map((s, i) => (
              <li key={s.url} id={`src-${i + 1}`} className="flex gap-3 border-b border-grid-line py-1.5">
                <span className="font-mono text-primary">[{i + 1}]</span>
                <a href={s.url} rel="noopener" target="_blank" className="break-words hover:text-primary">{s.title}</a>
              </li>
            ))}
          </ol>
          {a.related.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {a.related.map((r) => <Button key={r.href} asChild variant="outline"><Link href={r.href}>{r.label}</Link></Button>)}
            </div>
          )}
        </section>
      </article>
    </WikiShell>
  );
}
