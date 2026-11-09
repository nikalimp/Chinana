import type { Metadata } from "next";
import Link from "next/link";
import { universities, uniPath } from "@/content/universities";
import { cny } from "@/content/university-types";
import { Container, GridLines, Section, SectionHead } from "@/components/container";
import { Button } from "@/components/ui/button";
import { UniCard } from "@/components/cards";
import { FaqList } from "@/components/faq";
import { CtaFinal } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, graph, itemList } from "@/lib/schema";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: "Университеты Китая для россиян: каталог, цены, гранты" },
  description: `Каталог из ${universities.length} университетов Китая для иностранцев: рейтинг QS, цены на языковые курсы, бакалавриат и магистратуру, гранты и требования HSK.`,
  alternates: { canonical: "/universities/" },
};

const faq = [
  { q: "Какие университеты Китая лучшие для иностранцев?", a: "По рейтингу QS 2026 в топ-50 входят Пекинский университет, Цинхуа, Фудань, Цзяотун и Чжэцзянский университет. Лучший вуз для вас зависит от программы, языка обучения, бюджета и города." },
  { q: "Сколько стоит учёба в университете Китая?", a: "По данным вузов каталога языковые курсы стоят от 6500 до 18 000 юаней за семестр, бакалавриат и магистратура — обычно от 20 000 до 50 000 юаней в год. Программы на английском бывают дороже." },
  { q: "Можно ли учиться в Китае бесплатно?", a: "Да, по гранту. Полный грант правительства Китая (CSC) покрывает обучение, общежитие и страховку и платит стипендию 2500⁠–⁠3500 юаней в месяц. Есть ещё гранты провинций, городов и самих вузов." },
  { q: "В каких вузах учатся на английском?", a: "Программы на английском есть во многих крупных вузах, например в Цинхуа, Цзяотуне и Чжэцзянском университете. Язык программы указан на странице каждого вуза." },
];

export default function UniversitiesPage() {
  const cities = [...new Set(universities.map((u) => u.city))];
  return (
    <>
      <JsonLd data={graph(itemList(universities.map((u) => ({ name: u.nameRu, path: uniPath(u) }))), faqSchema(faq))} />

      <section className="relative overflow-hidden pb-[clamp(48px,7vw,96px)] pt-[clamp(40px,6vw,80px)] text-center">
        <GridLines />
        <div aria-hidden="true" lang="zh-Hans" className="zh-bg left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 text-[clamp(200px,30vw,420px)] text-primary opacity-[0.06]">大学</div>
        <Container>
          <p className="font-mono text-xs uppercase tracking-wide text-primary">Каталог вузов</p>
          <h1 className="mx-auto mt-[18px] max-w-[16ch] text-[clamp(36px,6vw,80px)]">Университеты Китая <em>для россиян</em></h1>
          <p className="mx-auto mt-6 max-w-[64ch] text-[clamp(17px,1.6vw,20px)] text-muted-foreground">
            В каталоге {universities.length} университетов Китая, которые принимают иностранцев. Для каждого — рейтинг, программы, цены в юанях, гранты, требования HSK и общежитие по данным сайта вуза. Языковые курсы стоят от 6500 до 18 000 юаней за семестр, бакалавриат и магистратура — обычно от 20 000 до 50 000 юаней в год. Каталог пополняется каждую неделю.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild><a href={site.cta.href}>Подобрать вуз →</a></Button>
            <Button asChild variant="outline"><Link href="/cost/">Сколько стоит год в Китае</Link></Button>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHead eyebrow={`${universities.length} вузов · ${cities.length} городов`} title="Каталог" accent="университетов" />
          <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((u) => <UniCard key={u.slug} zh={u.zhShort} name={u.nameRu} city={u.city} partner={u.partner} href={uniPath(u)} />)}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead eyebrow="Сравнение" title="Цены и рейтинги" accent="в одной таблице" text="Цены — в юанях, по данным сайтов вузов. Подробности и источники — на странице вуза." />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-[15px]">
              <thead>
                <tr>{["Вуз", "Город", "QS 2026", "Языковые курсы", "Бакалавриат, год", "Магистратура, год"].map((h) => <th key={h} scope="col" className="border border-border bg-secondary px-4 py-3 text-left font-mono text-xs font-medium uppercase">{h}</th>)}</tr>
              </thead>
              <tbody>
                {universities.map((u) => {
                  const p = (t: string) => u.programs.find((x) => x.type === t && x.priceCny);
                  const lang = p("language");
                  return (
                    <tr key={u.slug} className="bg-card">
                      <th scope="row" className="border border-border px-4 py-3 text-left font-medium"><Link href={uniPath(u)} className="hover:text-primary">{u.nameRu}</Link></th>
                      <td className="border border-border px-4 py-3">{u.city}</td>
                      <td className="border border-border px-4 py-3 tabular-nums">{u.rankings.find((r) => r.name.startsWith("QS"))?.value ?? "—"}</td>
                      <td className="whitespace-nowrap border border-border px-4 py-3 tabular-nums">{lang ? cny(lang.priceCny) + (lang.priceNote?.match(/семестр|полугод/) ? " / сем." : " / год") : "—"}</td>
                      <td className="whitespace-nowrap border border-border px-4 py-3 tabular-nums">{p("bachelor") ? cny(p("bachelor")!.priceCny) : "—"}</td>
                      <td className="whitespace-nowrap border border-border px-4 py-3 tabular-nums">{p("master") ? cny(p("master")!.priceCny) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead eyebrow="Частые вопросы" title="Университеты Китая" accent="вопросы и ответы" />
          <FaqList items={faq} />
        </Container>
      </Section>

      <CtaFinal />
    </>
  );
}
