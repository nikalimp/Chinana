import Link from "next/link";
import { site } from "@/content/site";
import { home } from "@/content/home";
import { programs } from "@/content/programs";
import { Container, Eyebrow, GridLines, Section, SectionHead } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ProgramCard, StepCard, UniCard } from "@/components/cards";
import { FaqList } from "@/components/faq";
import { CtaFinal } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, graph } from "@/lib/schema";

export default function Home() {
  const steps = [
    { title: "Диагностика", text: "Разбираем цель, возраст, язык и бюджет. Говорим честно, какие варианты реальны." },
    { title: "Подбор вузов", text: "3⁠–⁠5 вузов и грантов под ваш профиль, с ценой и сроками подачи." },
    { title: "Документы и подача", text: "Переводы, study plan, мотивационное письмо, заявки в вузы." },
    { title: "Приглашение и виза", text: "Получаем приглашение, помогаем с визой и дорогой." },
  ];
  return (
    <>
      <JsonLd data={graph(faqSchema(home.faq))} />

      <section className="relative overflow-hidden pb-[clamp(64px,9vw,120px)] pt-[clamp(56px,8vw,104px)] text-center">
        <GridLines />
        <div aria-hidden="true" lang="zh-Hans" className="zh-bg left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 text-[clamp(220px,34vw,470px)] text-primary opacity-[0.06]">去中国</div>
        <Container>
          <Eyebrow>{home.eyebrow}</Eyebrow>
          <h1 className="mx-auto mt-5 max-w-[12ch] text-[clamp(40px,7.4vw,96px)]">
            {home.h1} <span className="mark">{home.h1Mark}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-[62ch] text-[clamp(17px,1.6vw,20px)] text-muted-foreground">{home.answer}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild><a href={site.cta.href}>{site.cta.label} →</a></Button>
            <Button asChild variant="outline"><Link href="/grants/csc/">Проверить шанс на грант</Link></Button>
          </div>
          <ul aria-label="Кому подходит" className="mt-6 flex flex-wrap justify-center gap-2">
            {home.tags.map((t) => <li key={t} className="rounded-full border border-foreground bg-background px-3 py-1.5 font-mono text-xs">{t}</li>)}
          </ul>
        </Container>
      </section>

      <Section id="programs">
        <Container>
          <SectionHead title={home.programsHead.title} accent={home.programsHead.accent} text={home.programsHead.text} />
          <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => <ProgramCard key={p.slug} p={p} />)}
          </div>
        </Container>
      </Section>

      <Section tone="inverse" id="grant">
        <Container>
          <div className="mx-auto mb-12 max-w-[900px] text-center">
            <div aria-hidden="true" lang="zh-Hans" className="mb-4 font-zh text-[clamp(90px,12vw,150px)] font-black leading-none text-primary">{home.grant.zh}</div>
            <Eyebrow className="mb-3.5 text-accent">{home.grant.eyebrow}</Eyebrow>
            <h2 className="text-[clamp(28px,4.2vw,48px)]">{home.grant.title} <em>{home.grant.accent}</em></h2>
          </div>
          <div className="grid items-start md:grid-cols-2">
            <div className="md:pr-10">
              <p className="max-w-[52ch] text-inverse-muted">{home.grant.text}</p>
              <Button asChild variant="inverse" className="mt-7"><Link href="/grants/csc/">Как получить грант →</Link></Button>
            </div>
            <ul className="mt-9 border-t border-inverse-foreground/20 md:mt-0">
              {home.grant.items.map((it, i) => (
                <li key={it} className="flex gap-[18px] border-b border-inverse-foreground/20 py-4">
                  <span className="min-w-7 font-mono text-[13px] text-accent">{String(i + 1).padStart(2, "0")}</span>{it}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section id="terms">
        <Container>
          <SectionHead title={home.stepsHead.title} accent={home.stepsHead.accent} text={home.stepsHead.text} />
          <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => <StepCard key={s.title} n={i + 1} {...s} />)}
          </div>
          <div className="grid border border-t-0 border-border bg-secondary sm:grid-cols-2">
            <div className="px-[22px] py-7">
              <Eyebrow>{home.terms.eyebrow}</Eyebrow>
              <h3 className="text-[26px] font-bold uppercase leading-tight">{home.terms.title}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-7 border-t border-border px-[22px] py-7 sm:border-l sm:border-t-0">
              <div className="flex items-center gap-3"><span className="grid size-14 place-items-center border-[1.5px] border-foreground bg-accent font-mono font-medium">50%</span>{home.terms.first}</div>
              <div className="flex items-center gap-3"><span className="grid size-14 place-items-center border-[1.5px] border-foreground font-mono font-medium">50%</span>{home.terms.second}</div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="unis">
        <Container>
          <SectionHead title={home.unisHead.title} text={home.unisHead.text} />
          <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {home.universities.map((u) => <UniCard key={u.name} {...u} href={`/universities/${u.slug}/`} />)}
          </div>
          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline"><Link href="/universities/">Весь каталог →</Link></Button>
          </div>
        </Container>
      </Section>

      <Section id="faq">
        <Container>
          <SectionHead eyebrow={home.faqHead.eyebrow} title={home.faqHead.title} accent={home.faqHead.accent} />
          <FaqList items={home.faq} />
        </Container>
      </Section>

      <CtaFinal />
    </>
  );
}
