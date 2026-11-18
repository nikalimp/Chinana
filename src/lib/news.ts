import fs from "node:fs";
import path from "node:path";
import { typograf } from "./typograf.mjs";
import { site } from "@/content/site";

// Новости вузов: content/news/<дата>-<вуз>-<id>.md — пишет scripts/news/run.mjs (каждый день в 12:34 на Маке Ника).
// Пересказ на русском со ссылкой на источник (design-news-factory.md §5).
export type NewsTopic = "admission" | "scholarship" | "exams" | "ranking" | "campus" | "science" | "career";
export type News = {
  slug: string;
  title: string;
  description: string;
  date: string;
  universities: string[];
  topic: NewsTopic;
  sourceUrl: string;
  sourceTitle: string;
  sourcePublished?: string;
  body: string;
};

export const topicLabel: Record<NewsTopic, string> = {
  admission: "Поступление",
  scholarship: "Гранты",
  exams: "Экзамены",
  ranking: "Рейтинги",
  campus: "Студенческая жизнь",
  science: "Наука",
  career: "Карьера",
};

const dir = path.join(process.cwd(), "content/news");
const unq = (v: string) => (v.startsWith('"') ? JSON.parse(v) : v);

function parse(file: string): News {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`Нет frontmatter: ${file}`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = unq(line.slice(i + 1).trim());
  }
  return {
    slug: file.replace(/\.md$/, ""),
    title: typograf(meta.title),
    description: typograf(meta.description),
    date: meta.date,
    universities: meta.universities.split(",").map((s) => s.trim()).filter(Boolean),
    topic: (meta.topic in topicLabel ? meta.topic : "campus") as NewsTopic,
    sourceUrl: meta.sourceUrl,
    sourceTitle: meta.sourceTitle,
    sourcePublished: meta.sourcePublished || undefined,
    body: typograf(m[2].trim()),
  };
}

let cache: News[] | null = null;
export function getNews(): News[] {
  if (!site.features.news || !fs.existsSync(dir)) return [];
  cache ??= fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(parse)
    .sort((a, b) => b.date.localeCompare(a.date) || (b.sourcePublished ?? "").localeCompare(a.sourcePublished ?? ""));
  return cache;
}

export const newsOf = (uni: string) => getNews().filter((n) => n.universities.includes(uni));
export const getNewsItem = (slug: string) => getNews().find((n) => n.slug === slug);
