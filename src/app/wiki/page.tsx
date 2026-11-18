import type { Metadata } from "next";
import Link from "next/link";
import { wikiArticles, wikiSections } from "@/content/wiki";
import { Container, GridLines, Section, SectionHead } from "@/components/container";
import { CtaFinal } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { graph, itemList } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Wiki об учёбе в Китае: гранты, экзамены, виза, жизнь" },
  description: "Всё об учёбе в Китае в одном месте: грант CSC, экзамены CSCA и HSK, стоимость, виза и документы, жизнь, учёба и города. Каждый факт со ссылкой на источник.",
  alternates: { canonical: "/wiki/" },
};

// Общая страница Wiki — каталог: разделы карточками по сетке, города — отдельным блоком (решение Ника 2026-11-18).
// Внутренние страницы — WikiShell: статья 8 колонок, оглавление справа 3 колонки.
export default function WikiHub() {
  const total = wikiArticles.length + wikiSections.reduce((n, s) => n + (s.extra?.length ?? 0), 0);
  const topics = wikiSections.filter((s) => s.articles.length > 0);
  const cities = wikiSections.find((s) => s.id === "cities");
  return (
    <>
      <JsonLd data={graph(itemList(wikiArticles.map((a) => ({ name: a.crumb, path: a.path }))))} />
      <section className="relative overflow-hidden pb-[clamp(48px,6vw,80px)] pt-[clamp(40px,6vw,80px)]">
        <GridLines />
        <Container>
          <SectionHead
            as="h1"
            eyebrow="Wiki"
            title="Учёба в Китае:"
            accent="всё в одном месте"
            text={`Справочник для тех, кто едет учиться в Китай из России: как поступить и получить грант, какие экзамены сдать, сколько это стоит, как оформить визу, как устроены учёба и жизнь, какой город выбрать. У каждого факта есть ссылка на источник и дата проверки. Статей в справочнике: ${total}.`}
            className="mb-0"
          />
          <nav aria-label="Разделы Wiki" className="mt-10 flex flex-wrap justify-center gap-2">
            {wikiSections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="inline-flex items-baseline gap-1.5 rounded-full border border-border px-4 py-1.5 text-[15px] hover:bg-secondary">
                <span aria-hidden="true" lang="zh-Hans" className="font-zh text-sm font-black text-primary">{s.zh}</span>{s.title}
              </a>
            ))}
          </nav>
        </Container>
      </section>

      <Section className="pt-0">
        <Container>
          <div className="cards grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24 bg-card px-[22px] pb-4 pt-[26px]">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-[22px]">{s.title}</h2>
                  <span aria-hidden="true" lang="zh-Hans" className="font-zh text-[26px] font-black leading-none text-primary">{s.zh}</span>
                </div>
                <p className="mt-1.5 text-[15px] text-muted-foreground">{s.text}</p>
                <ul className="mt-4">
                  {s.articles.map((a) => (
                    <li key={a.path} className="border-t border-grid-line">
                      <Link href={a.path} className="group block py-2.5">
                        <b className="font-semibold group-hover:text-primary">{a.crumb} →</b>
                        <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">{a.metaDescription}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {topics.length % 3 !== 0 && (
              <Link href="/library/radicals/" className="group hidden flex-col bg-secondary px-[22px] pb-6 pt-[26px] transition-colors hover:bg-card-hover lg:flex">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[22px] font-medium uppercase">Библиотека</span>
                  <span aria-hidden="true" lang="zh-Hans" className="font-zh text-[26px] font-black leading-none text-primary">部首</span>
                </div>
                <p className="mt-1.5 text-[15px] text-muted-foreground">Учите язык до поездки: 214 ключей, из которых собраны иероглифы, — с переводом, пиньинем и примерами.</p>
                <span className="mt-auto pt-6 font-semibold text-brand group-hover:underline">Ключи иероглифов →</span>
              </Link>
            )}
          </div>
        </Container>
      </Section>

      {cities?.extra && (
        <Section id={cities.id} className="scroll-mt-16">
          <Container>
            <SectionHead eyebrow={cities.zh} title={cities.title} accent="для учёбы" text={cities.text} />
            <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {cities.extra.map((c) => (
                <Link key={c.href} href={c.href} className="group bg-card px-[22px] py-5 transition-colors hover:bg-card-hover">
                  <b className="font-semibold group-hover:text-primary">{c.title} →</b>
                  <span className="mt-1 block text-sm text-muted-foreground">{c.text}</span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CtaFinal />
    </>
  );
}
