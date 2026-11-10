import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { programs } from "@/content/programs";
import { getPosts } from "@/lib/posts";
import { wikiArticles as answers } from "@/content/wiki";
import { universities, unisChecked } from "@/content/universities";
import { cities, citiesChecked, cityPath } from "@/content/cities";

export const dynamic = "force-static";

// Новая страница = новая строка здесь. Правила (стандарт AI-Ready сайта, §2 «Индексация»):
// - только страницы, открытые для индексации: noindex-страниц и политики конфиденциальности здесь нет;
// - lastmod — только настоящая дата изменения (у статей — updated/date из frontmatter). Дату сборки не ставим:
//   сайт пересобирается при каждом push, и «всё обновилось сегодня» приучает Google игнорировать lastmod.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  return [
    { url: `${site.url}/`, priority: 1 },
    { url: `${site.url}/programs/`, priority: 0.9 },
    ...programs.map((p) => ({ url: `${site.url}/programs/${p.slug}/`, priority: 0.8 })),
    { url: `${site.url}/wiki/`, priority: 0.9 },
    ...answers.map((a) => ({ url: `${site.url}${a.path}`, lastModified: a.updated, priority: 0.8 })),
    { url: `${site.url}/wiki/cities/`, lastModified: citiesChecked, priority: 0.7 },
    ...cities.map((c) => ({ url: `${site.url}${cityPath(c)}`, lastModified: citiesChecked, priority: 0.6 })),
    { url: `${site.url}/universities/`, lastModified: unisChecked, priority: 0.9 },
    ...universities.map((u) => ({ url: `${site.url}/universities/${u.slug}/`, lastModified: unisChecked, priority: 0.7 })),
    { url: `${site.url}/contacts/`, priority: 0.6 },
    ...(site.features.blog && posts.length ? [{ url: `${site.url}/blog/`, lastModified: posts.map((p) => p.updated ?? p.date).sort().at(-1), priority: 0.7 }] : []),
    ...(site.features.blog ? posts : []).map((p) => ({ url: `${site.url}/blog/${p.slug}/`, lastModified: p.updated ?? p.date, priority: 0.7 })),
  ];
}
