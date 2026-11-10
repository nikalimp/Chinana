import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate, getPost, getPosts } from "@/lib/posts";
import { site } from "@/content/site";
import { Container, Section } from "@/components/container";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { articleSchema, graph } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getPosts();
  // Next.js со статическим экспортом требует хотя бы один путь — заглушка не попадает в sitemap
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return { robots: { index: false } };
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}/` },
    openGraph: { type: "article", title: p.title, description: p.description, url: `${site.url}/blog/${p.slug}/`, publishedTime: p.date, modifiedTime: p.updated ?? p.date, images: [p.cover ?? "/og.png"] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  return (
    <>
      <JsonLd data={graph(articleSchema(p))} />
      <Section className="pt-12">
        <Container className="max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-wide text-primary">Блог{p.rubric ? ` / ${p.rubric}` : ""}</p>
          <h1 className="text-[clamp(30px,4.4vw,52px)] leading-tight">{p.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {site.person ? site.person.name : site.name}, <time dateTime={p.date}>{formatDate(p.date)}</time>
            {p.updated && p.updated !== p.date && <>, обновлено <time dateTime={p.updated}>{formatDate(p.updated)}</time></>}
          </p>
          {p.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.cover} alt={p.coverAlt ?? ""} className="mt-8 aspect-[16/9] w-full border border-border object-cover" />
          )}
          <article className="prose-site mt-10">
            <Markdown remarkPlugins={[remarkGfm]}>{p.body}</Markdown>
          </article>
        </Container>
      </Section>
      <Cta />
    </>
  );
}
