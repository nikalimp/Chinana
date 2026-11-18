import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { universities } from "@/content/universities";
import { getNews, topicLabel } from "@/lib/news";
import { Container, GridLines, Section, SectionHead } from "@/components/container";
import { NewsList } from "@/components/news";
import { NewsFilter } from "@/components/news-filter";
import { CtaFinal } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { graph, itemList } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Новости вузов Китая на русском: набор, гранты, экзамены" },
  description: "Новости университетов Китая на русском языке: набор иностранных студентов, гранты, экзамены HSK и CSCA, рейтинги и жизнь кампуса. Со ссылкой на сайт вуза.",
  alternates: { canonical: "/news/" },
  ...(!site.features.news && { robots: { index: false, follow: true } }),
};

export default function NewsPage() {
  const news = getNews();
  const unis = universities.filter((u) => news.some((n) => n.universities.includes(u.slug))).map((u) => ({ slug: u.slug, name: u.nameRu }));
  const topics = Object.entries(topicLabel).filter(([id]) => news.some((n) => n.topic === id)).map(([id, label]) => ({ id, label }));
  return (
    <>
      <JsonLd data={graph({ "@type": "CollectionPage", name: "Новости вузов Китая", url: `${site.url}/news/` }, itemList(news.slice(0, 50).map((n) => ({ name: n.title, path: `/news/${n.slug}/` }))))} />
      <section className="relative overflow-hidden pb-[clamp(40px,5vw,64px)] pt-[clamp(40px,6vw,80px)]">
        <GridLines />
        <Container>
          <SectionHead
            as="h1"
            eyebrow="Новости вузов"
            title="Новости вузов Китая"
            accent="на русском"
            text={`Каждый день читаем сайты ${universities.length} университетов каталога и пересказываем по-русски то, что важно иностранному студенту: набор и сроки, гранты, экзамены, рейтинги, жизнь кампуса. У каждой новости — ссылка на оригинал.`}
            className="mb-0"
          />
        </Container>
      </section>
      <Section className="pt-0">
        <Container>
          <div className="w-cols-8">
            {news.length > 0 && <NewsFilter unis={unis} topics={topics} />}
            <NewsList items={news} />
            <p id="news-empty" hidden={news.length > 0} className="border border-border bg-card px-[22px] py-6 text-muted-foreground">
              {news.length ? "По этому фильтру новостей пока нет." : "Первые новости появятся в ближайшие дни."} Пока можно посмотреть <Link href="/universities/" className="text-brand underline underline-offset-4">каталог вузов</Link> с ценами и грантами.
            </p>
          </div>
        </Container>
      </Section>
      <CtaFinal />
    </>
  );
}
