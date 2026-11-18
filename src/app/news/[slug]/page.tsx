import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { site } from "@/content/site";
import { universities, uniPath } from "@/content/universities";
import { formatDate } from "@/lib/posts";
import { getNews, getNewsItem, newsOf, topicLabel } from "@/lib/news";
import { Container, Section } from "@/components/container";
import { Button } from "@/components/ui/button";
import { NewsList } from "@/components/news";
import { CtaFinal } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { graph, orgId } from "@/lib/schema";

export const dynamicParams = false;
export function generateStaticParams() {
  const n = getNews();
  // Статический экспорт требует хотя бы один путь — заглушка не попадает в sitemap
  return n.length ? n.map((x) => ({ slug: x.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const n = getNewsItem((await params).slug);
  if (!n) return { robots: { index: false } };
  return {
    title: { absolute: n.title },
    description: n.description,
    alternates: { canonical: `/news/${n.slug}/` },
    openGraph: { type: "article", title: n.title, description: n.description, url: `${site.url}/news/${n.slug}/`, publishedTime: n.date, images: ["/og.png"] },
  };
}

export default async function NewsItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const n = getNewsItem((await params).slug);
  if (!n) notFound();
  const unis = universities.filter((u) => n.universities.includes(u.slug));
  const more = unis.flatMap((u) => newsOf(u.slug)).filter((x) => x.slug !== n.slug).slice(0, 3);
  const host = (() => { try { return new URL(n.sourceUrl).host; } catch { return n.sourceUrl; } })();
  const schema = {
    "@type": "NewsArticle",
    headline: n.title,
    description: n.description,
    url: `${site.url}/news/${n.slug}/`,
    datePublished: n.date,
    inLanguage: "ru-RU",
    author: { "@id": orgId },
    publisher: { "@id": orgId },
    isBasedOn: n.sourceUrl,
    about: unis.map((u) => ({ "@type": "CollegeOrUniversity", name: u.nameRu, alternateName: [u.nameZh, u.nameEn], url: `${site.url}${uniPath(u)}` })),
  };
  return (
    <>
      <JsonLd data={graph(schema)} />
      <Section className="pt-12">
        {/* Новость — 8 из 12 колонок по центру, как статья блога */}
        <Container><div className="w-cols-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-wide text-primary">
            <Link href="/news/" className="hover:underline">Новости вузов</Link> / {topicLabel[n.topic]}
          </p>
          <h1 className="text-[clamp(28px,4vw,48px)] leading-tight">{n.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {site.name}, <time dateTime={n.date}>{formatDate(n.date)}</time>
            {unis.map((u) => <span key={u.slug}>, <Link href={uniPath(u)} className="text-brand hover:underline">{u.nameRu}</Link></span>)}
          </p>
          <article className="prose-site mt-8">
            <Markdown remarkPlugins={[remarkGfm]}>{n.body}</Markdown>
          </article>
          <p className="mt-8 border-t border-grid-line pt-4 text-sm text-muted-foreground">
            Источник: <a href={n.sourceUrl} rel="noopener" target="_blank" className="text-brand underline underline-offset-4">сайт вуза, {host}</a>
            {n.sourcePublished && <>, {formatDate(n.sourcePublished)}</>}. Это пересказ на русском, не официальный перевод: сроки и условия проверяйте по оригиналу.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {unis.map((u) => <Button key={u.slug} asChild variant="outline"><Link href={uniPath(u)}>{u.nameRu}: цены и гранты →</Link></Button>)}
            <Button asChild><a href={site.cta.href} data-lead>{site.cta.label}</a></Button>
          </div>
          {more.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-5 text-[clamp(22px,2.6vw,30px)]">Ещё новости <em>вуза</em></h2>
              <NewsList items={more} showUni={false} />
            </div>
          )}
        </div></Container>
      </Section>
      <CtaFinal />
    </>
  );
}
