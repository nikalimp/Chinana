import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { universities, uniAnswer, uniFaq, uniPath } from "@/content/universities";
import { cny, programLabel } from "@/content/university-types";
import { cityBySlugRu, cityPath } from "@/content/cities";
import { Container, GridLines, Section, SectionHead } from "@/components/container";
import { Button } from "@/components/ui/button";
import { UniCard } from "@/components/cards";
import { FaqList } from "@/components/faq";
import { CtaFinal } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, graph, uniSchema } from "@/lib/schema";

export const dynamicParams = false;
export function generateStaticParams() {
  return universities.map((u) => ({ slug: u.slug }));
}

const title = (u: (typeof universities)[number]) =>
  [`${u.nameRu} (${u.nameZh}): поступление, гранты, цены`, `${u.nameRu}: поступление для россиян, цены`, `${u.nameRu}: поступление и цены`, `${u.nameRu} — поступление`].find((t) => t.length <= 65) ?? u.nameRu;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const u = universities.find((x) => x.slug === slug);
  if (!u) return {};
  const base = `${u.nameRu}, ${u.city}: цены для иностранцев в юанях, гранты, требования HSK и общежитие — по данным сайта вуза`;
  const description = (base + ", со ссылками на источники.").length <= 160 ? base + ", со ссылками на источники." : base + ".";
  return { title: { absolute: title(u) }, description, alternates: { canonical: uniPath(u) } };
}

export default async function UniPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = universities.find((x) => x.slug === slug);
  if (!u) notFound();
  const faq = uniFaq(u);
  const qs = u.rankings.find((r) => r.name.startsWith("QS"));
  const others = universities.filter((x) => x.slug !== u.slug && x.city === u.city).concat(universities.filter((x) => x.slug !== u.slug && x.city !== u.city)).slice(0, 3);
  const sources = [...new Set([...u.sources, ...u.programs.map((p) => p.url), ...u.facts.map((f) => f.url)])].filter(Boolean);
  const cta = u.partner ? `Поступить в ${u.nameRu}` : "Бесплатная консультация";

  return (
    <>
      <JsonLd data={graph(uniSchema(u), faqSchema(faq))} />

      <section className="relative overflow-hidden pb-[clamp(64px,9vw,120px)] pt-[clamp(40px,6vw,80px)] text-center">
        <GridLines />
        <div aria-hidden="true" lang="zh-Hans" className="zh-bg left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-[clamp(180px,26vw,380px)] text-primary opacity-[0.06]">{u.zhShort}</div>
        <Container>
          <p className="font-mono text-xs uppercase tracking-wide text-primary"><span lang="zh-Hans" className="font-zh text-sm font-black">{u.nameZh}</span> · {u.city}</p>
          <h1 className="mx-auto mt-[18px] max-w-[12em] text-[clamp(34px,5.6vw,76px)]">{u.nameRu}: <em>поступление для россиян</em></h1>
          <p className="mx-auto mt-6 max-w-[42.6em] text-[clamp(17px,1.6vw,20px)] text-muted-foreground">{uniAnswer(u)}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild><a href={site.cta.href}>{cta} →</a></Button>
            <Button asChild variant="outline"><Link href="/wiki/csc/">Как получить грант</Link></Button>
          </div>
          <div className="cards mt-14 grid-cols-2 text-left lg:grid-cols-4">
            {[
              ["Город", u.city],
              ["Основан", u.founded ? String(u.founded) : "—"],
              ["QS 2026", qs ? qs.value : "вне топ-500"],
              ["Заявка", u.applicationFeeCny ? cny(u.applicationFeeCny) : "—"],
            ].map(([l, v]) => (
              <div key={l} className="bg-card p-[22px]">
                <span className="font-mono text-xs uppercase text-muted-foreground">{l}</span>
                <b className="mt-2 block text-[22px] leading-tight">
                  {l === "Город" && cityBySlugRu(u.city) ? <Link href={cityPath(cityBySlugRu(u.city)!)} className="underline decoration-primary/40 underline-offset-4 hover:text-primary">{v}</Link> : v}
                </b>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {u.facts.length > 0 && (
        <Section>
          <Container>
            <SectionHead eyebrow="О вузе" title="Чем известен" accent={u.nameRu} />
            <ul className="mx-auto max-w-[47.9em] text-[17px]">
              {u.facts.map((f) => (
                <li key={f.text} className="flex gap-3 border-b border-grid-line py-2.5"><span aria-hidden="true" className="font-mono text-primary">—</span><span>{f.text} <a href={f.url} rel="noopener" target="_blank" className="font-mono text-[11px] text-primary hover:underline">[источник]</a></span></li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <SectionHead eyebrow="Программы и цены" title="Сколько стоит" accent="учёба" text="Цены — в юанях, по данным сайта вуза. Точную сумму вуз называет при зачислении." />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-[15px]">
              <thead>
                <tr>{["Программа", "Язык", "Срок", "Цена", "Подробности"].map((h) => <th key={h} scope="col" className="border border-border bg-secondary px-4 py-3 text-left font-mono text-xs font-medium uppercase">{h}</th>)}</tr>
              </thead>
              <tbody>
                {u.programs.map((p, i) => (
                  <tr key={i} className="bg-card">
                    <th scope="row" className="border border-border px-4 py-3 text-left align-top font-medium">{programLabel[p.type]}</th>
                    <td className="border border-border px-4 py-3 align-top">{p.language || "—"}</td>
                    <td className="border border-border px-4 py-3 align-top">{p.duration || "—"}</td>
                    <td className="whitespace-nowrap border border-border px-4 py-3 align-top tabular-nums">{p.priceCny ? cny(p.priceCny) : "уточняется"}</td>
                    <td className="border border-border px-4 py-3 align-top text-muted-foreground">{p.priceNote} <a href={p.url} rel="noopener" target="_blank" className="font-mono text-[11px] text-primary hover:underline">[источник]</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead eyebrow="Требования и жильё" title="Что нужно" accent="для поступления" />
          <table className="mx-auto w-full max-w-[900px] border-collapse text-base">
            <tbody>
              {[
                ["HSK, бакалавриат", u.hskMin?.bachelor, u.hskMin?.url],
                ["HSK, магистратура", u.hskMin?.master, u.hskMin?.url],
                ["Общежитие", u.dorm?.priceCny ? `${cny(u.dorm.priceCny)} — ${u.dorm.period ?? ""}` : undefined, u.dorm?.url],
                ["Сроки подачи", u.applicationWindow, undefined],
              ].filter(([, v]) => v).map(([l, v, url]) => (
                <tr key={l}>
                  <th scope="row" className="w-1/4 border border-border bg-card px-[22px] py-4 text-left align-top font-mono text-xs font-medium uppercase text-muted-foreground">{l}</th>
                  <td className="border border-border px-[22px] py-4 align-top">{v}{url && <> <a href={url} rel="noopener" target="_blank" className="font-mono text-[11px] text-primary hover:underline">[источник]</a></>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mx-auto mt-6 max-w-[47.9em] text-muted-foreground">Если китайского пока нет, путь обычно такой: языковые курсы в Китае, затем экзамен HSK, затем поступление на степень. Для бакалавриата по гранту правительства Китая нужен ещё экзамен <Link href="/wiki/csca/" className="text-primary hover:underline">CSCA</Link>.</p>
        </Container>
      </Section>

      {u.grants.length > 0 && (
        <Section>
          <Container>
            <SectionHead eyebrow="Гранты" title="Гранты" accent="для иностранцев" text="Полный грант правительства Китая покрывает обучение, общежитие и страховку и платит стипендию." />
            <ul className="mx-auto max-w-[47.9em] text-[17px]">
              {u.grants.map((g) => (
                <li key={g.name} className="flex gap-3 border-b border-grid-line py-2.5"><span aria-hidden="true" className="font-mono text-primary">—</span><span>{g.name} <a href={g.url} rel="noopener" target="_blank" className="font-mono text-[11px] text-primary hover:underline">[источник]</a></span></li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center"><Button asChild variant="outline"><Link href="/wiki/csc/">Всё о гранте CSC →</Link></Button></div>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <div className="cards grid-cols-1 md:grid-cols-[2fr_1fr]">
            <div className="bg-card px-[22px] py-[26px]">
              <h2 className="text-[clamp(24px,3vw,34px)]">{u.partner ? <>Как мы ведём поступление <em>в {u.nameRu}</em></> : <>Хотите учиться <em>в {u.city === "Пекин" || u.city === "Шанхай" ? u.city + "е" : "Китае"}</em>?</>}</h2>
              <p className="mt-4 text-muted-foreground">
                {u.partner
                  ? "Подбираем программу, собираем и проверяем документы, подаём заявку и сопровождаем до приглашения и визы."
                  : "Разберём ваши шансы на бесплатной консультации и подберём вузы, куда мы ведём поступление: с похожими программами, ценами и грантами."}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3.5 bg-secondary px-[22px] py-7">
              <Button asChild><a href={site.cta.href}>{cta}</a></Button>
              <Button asChild variant="outline"><Link href="/programs/">Выбрать программу</Link></Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead eyebrow="Частые вопросы" title={u.nameRu} accent="вопросы и ответы" />
          <FaqList items={faq} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead title="Похожие вузы" />
          <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => <UniCard key={o.slug} zh={o.zhShort} name={o.nameRu} city={o.city} partner={o.partner} href={uniPath(o)} />)}
          </div>
          <details className="mx-auto mt-12 max-w-[47.9em] text-sm text-muted-foreground">
            <summary className="cursor-pointer font-mono text-xs uppercase">Источники ({sources.length})</summary>
            <ol className="mt-3 space-y-1.5">
              {sources.map((s) => <li key={s}><a href={s} rel="noopener" target="_blank" className="break-all hover:text-primary">{s}</a></li>)}
            </ol>
          </details>
        </Container>
      </Section>

      <CtaFinal />
    </>
  );
}
