import type { Metadata } from "next";
import { programs, extras, formatRub } from "@/content/programs";
import { Container, GridLines, Section, SectionHead } from "@/components/container";
import { ProgramCard } from "@/components/cards";
import { CtaFinal } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { graph, itemList } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Программы обучения в Китае для взрослых из России",
  description: "Языковой год, foundation, бакалавриат и магистратура в Китае: сроки, язык, требования, гранты и цена сопровождения поступления для взрослых 18+.",
  alternates: { canonical: "/programs/" },
};

export default function Programs() {
  return (
    <>
      <JsonLd data={graph(itemList(programs.map((p) => ({ name: p.title, path: `/programs/${p.slug}/` }))))} />
      <section className="relative overflow-hidden pb-[clamp(48px,6vw,80px)] pt-[clamp(40px,6vw,80px)]">
        <GridLines />
        <Container>
          <SectionHead as="h1" title="Программы" accent="обучения в Китае" text="Четыре пути в китайский вуз — по цели и уровню языка. Мы сопровождаем поступление на каждую программу: подбираем вузы и гранты, готовим документы и ведём до приглашения." className="mb-0" />
        </Container>
      </section>
      <Section className="pt-0">
        <Container>
          <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => <ProgramCard key={p.slug} p={p} />)}
          </div>
          <div className="mx-auto mt-14 max-w-[42.6em] space-y-4 text-muted-foreground">
            <h2 className="text-center text-[clamp(24px,3vw,32px)] text-foreground">Как выбрать <em>программу</em></h2>
            <p>Если китайского нет, начните с языкового года: за семестр или год вы получите базу языка и поймёте, хотите ли учиться в Китае дальше. Если цель — бакалавриат, а языка или профильных предметов не хватает, подойдёт foundation: он готовит именно к поступлению.</p>
            <p>Бакалавриат подходит выпускникам школы 18+ и колледжа, магистратура — тем, у кого уже есть диплом бакалавра или специалиста. На обе программы есть гранты правительства Китая и вузов, а также программы на английском языке.</p>
            <p>Можно совместить: языковой год, затем бакалавриат в том же вузе. Сопровождение такого маршрута стоит от {formatRub(extras.price)} {/* estimate */}. Оплата на всех программах — 50/50: вторая часть после приглашения вуза.</p>
          </div>
        </Container>
      </Section>
      <CtaFinal />
    </>
  );
}
