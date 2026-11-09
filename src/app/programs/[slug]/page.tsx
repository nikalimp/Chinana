import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { programs, formatRub } from "@/content/programs";
import { home } from "@/content/home";
import { Container, Eyebrow, GridLines, Section, SectionHead } from "@/components/container";
import { Button } from "@/components/ui/button";
import { StepCard, UniCard } from "@/components/cards";
import { FaqList } from "@/components/faq";
import { CtaFinal } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, graph, serviceSchema } from "@/lib/schema";

export const dynamicParams = false;
export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = programs.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: { absolute: p.metaTitle }, description: p.metaDescription, alternates: { canonical: `/programs/${p.slug}/` } };
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = programs.find((x) => x.slug === slug);
  if (!p) notFound();
  const others = programs.filter((x) => x.slug !== p.slug);
  return (
    <>
      <JsonLd data={graph(serviceSchema(p), faqSchema(p.faq))} />

      <section className="relative overflow-hidden pb-[clamp(64px,9vw,120px)] pt-[clamp(40px,6vw,80px)] text-center">
        <GridLines />
        <div aria-hidden="true" lang="zh-Hans" className="zh-bg left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-[clamp(220px,32vw,440px)] text-primary opacity-[0.06]">{p.zh}</div>
        <Container>
          <p className="font-mono text-xs uppercase tracking-wide text-primary">Программа {p.num} · {p.zh}</p>
          <h1 className="mx-auto mt-[18px] max-w-[9.3em] text-[clamp(38px,6.4vw,84px)]">{p.h1} <em>{p.h1Accent}</em></h1>
          <p className="mx-auto mt-6 max-w-[42.6em] text-[clamp(17px,1.6vw,20px)] text-muted-foreground">{p.answer}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild><a href={site.cta.href}>{p.cta} →</a></Button>
            <Button asChild variant="outline"><Link href="/grants/csc/">Проверить шанс на грант</Link></Button>
          </div>
          <div className="cards mt-14 grid-cols-1 text-left sm:grid-cols-2 lg:grid-cols-4">
            {p.facts.map((f) => (
              <div key={f.label} className="bg-card p-[22px]">
                <span className="font-mono text-xs uppercase text-muted-foreground">{f.label}</span>
                <b className="mt-2 block text-[22px] leading-tight">{f.value}</b>
                <span className="mt-1.5 block text-sm text-muted-foreground">{f.note}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHead eyebrow="Кому подходит" title={p.title} accent="для вас, если" />
          <div className="cards grid-cols-1 md:grid-cols-3">
            {p.forWhom.map((f, i) => <StepCard key={f.title} n={i + 1} title={f.title} text={f.text} />)}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead eyebrow="Сопровождение" title="Что входит" />
          <div className="cards grid-cols-1 md:grid-cols-[2fr_1fr]">
            <div className="bg-card px-[22px] py-[26px]">
              <ul className="sm:columns-2 sm:gap-10">
                {p.includes.map((it) => (
                  <li key={it} className="flex gap-3 break-inside-avoid border-b border-grid-line py-2.5"><span aria-hidden="true" className="font-mono text-primary">—</span>{it}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3.5 bg-secondary px-[22px] py-7">
              <span className="font-mono text-[13px]">Услуга от</span>
              <b className="text-4xl leading-none">{formatRub(p.price)}</b>
              <span className="font-mono text-[11px] text-muted-foreground">Ориентир, уточняется</span>
              <p>Оплата 50/50: вторая часть — после приглашения вуза.</p>
              <Button asChild><a href={site.cta.href}>{p.cta}</a></Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead eyebrow="Порядок" title="Как проходит" accent="поступление" />
          <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {p.process.map((s, i) => <StepCard key={s.title} n={i + 1} {...s} />)}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead eyebrow="Требования" title="Что нужно" accent="для поступления" />
          <table className="w-full border-collapse text-base">
            <tbody>
              {p.requirements.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className="w-1/4 border border-border bg-card px-[22px] py-4 text-left align-top font-mono text-xs font-medium uppercase text-muted-foreground">{r.label}</th>
                  <td className="border border-border px-[22px] py-4 align-top">{r.value}{r.note && <small className="mt-1 block text-[13px] text-muted-foreground">{r.note}</small>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead eyebrow="Где учиться" title="Вузы" accent="для этой программы" text="Каталог вузов с ценами и грантами — в разделе «Вузы»." />
          <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {home.universities.slice(0, 3).map((u) => <UniCard key={u.name} {...u} href={`/universities/${u.slug}/`} />)}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead eyebrow="Частые вопросы" title={`Про ${p.title.toLowerCase()}`} />
          <FaqList items={p.faq} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead title="Другие программы" />
          <div className="cards grid-cols-1 md:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/programs/${o.slug}/`} className="block bg-card px-[22px] py-[26px] transition-colors hover:bg-card-hover">
                <span className="font-mono text-[13px]">{o.num}</span>
                <h3 className="mb-1.5 mt-2.5 text-[22px] font-bold uppercase">{o.title}</h3>
                <p className="text-[15px] text-muted-foreground">{o.short}</p>
              </Link>
            ))}
          </div>
          <Eyebrow className="sr-only">Связанные программы</Eyebrow>
        </Container>
      </Section>

      <CtaFinal />
    </>
  );
}
