import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { wikiArticles, wikiSlug } from "@/content/wiki";
import { WikiArticle } from "@/components/wiki";

export const dynamicParams = false;
export function generateStaticParams() {
  return wikiArticles.map((a) => ({ slug: wikiSlug(a) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = wikiArticles.find((x) => wikiSlug(x) === slug);
  if (!a) return {};
  return { title: { absolute: a.metaTitle }, description: a.metaDescription, alternates: { canonical: a.path } };
}

export default async function WikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = wikiArticles.find((x) => wikiSlug(x) === slug);
  if (!a) notFound();
  return <WikiArticle a={a} />;
}
