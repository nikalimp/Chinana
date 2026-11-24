import Link from "next/link";
import { site } from "@/content/site";
import { home } from "@/content/home";
import { programs } from "@/content/programs";
import { Container, Eyebrow, GridLines, Section, SectionHead } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ProgramCard, StepCard } from "@/components/cards";
import { FaqList } from "@/components/faq";
import { CtaFinal } from "@/components/cta";
import { UniMap } from "@/components/uni-map";
import { Goals, HomeBlog, HskPath, Myths, WhyChinese } from "@/components/home-sections";
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-ukiyoe.jpg"
          alt=""
          aria-hidden="true"
          width={1600}
          height={900}
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 size-full select-none object-cover object-bottom opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 68% 64% at 50% 44%, oklch(98.1% 0.018 81.3 / 88%) 0%, oklch(98.1% 0.018 81.3 / 52%) 56%, transparent 100%), linear-gradient(180deg, oklch(98.1% 0.018 81.3 / 55%) 0%, transparent 18%, transparent 82%, oklch(98.1% 0.018 81.3) 100%)" }}
        />
        <GridLines />
        <Container>
          <Eyebrow>{home.eyebrow}</Eyebrow>
          <h1 className="mx-auto mt-5 max-w-[8em] text-[clamp(40px,7.4vw,96px)]">
            {home.h1} <span className="mark">{home.h1Mark}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-[41.2em] text-[clamp(17px,1.6vw,20px)] text-muted-foreground">{home.answer}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild><a href={site.cta.href} data-lead>{site.cta.label} →</a></Button>
            <Button asChild variant="outline"><Link href="/wiki/csc/">Проверить шанс на грант</Link></Button>
          </div>
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

      <WhyChinese />

      <Goals />

      <Section tone="inverse" id="grant">
        <Container>
          <div className="mx-auto mb-12 max-w-[900px] text-center">
            <div aria-hidden="true" lang="zh-Hans" className="mb-4 font-zh text-[clamp(90px,12vw,150px)] font-black leading-none text-primary">{home.grant.zh}</div>
            <Eyebrow className="mb-3.5 text-accent">{home.grant.eyebrow}</Eyebrow>
            <h2 className="text-[clamp(28px,4.2vw,48px)]">{home.grant.title} <em>{home.grant.accent}</em></h2>
          </div>
          <div className="grid items-start md:grid-cols-2">
            <div className="md:pr-10">
              <p className="max-w-[34.6em] text-inverse-muted">{home.grant.text}</p>
              <Button asChild variant="inverse" className="mt-7"><Link href="/wiki/csc/">Как получить грант →</Link></Button>
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

      <Section id="unis">
        <Container>
          <SectionHead title={home.unisHead.title} accent={home.unisHead.accent} text={home.unisHead.text} />
          <UniMap />
          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline"><Link href="/universities/">Весь каталог →</Link></Button>
          </div>
        </Container>
      </Section>

      <Myths />

      <HskPath />

      <Section id="steps">
        <Container>
          <SectionHead title={home.stepsHead.title} accent={home.stepsHead.accent} text={home.stepsHead.text} />
          <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => <StepCard key={s.title} n={i + 1} {...s} />)}
          </div>
        </Container>
      </Section>

      <HomeBlog />

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
