// Wiki — всё про учёбу в Китае в одном месте (решение Ника 2026-11-10).
// Статья = объект Answer (src/content/answers/*.ts), адрес /wiki/<slug>/. Разделы и порядок — здесь.
import type { Answer } from "@/content/answer-types";
import { csc } from "@/content/answers/csc";
import { csca } from "@/content/answers/csca";
import { hsk } from "@/content/answers/hsk";
import { cost } from "@/content/answers/cost";
import { studentVisa } from "@/content/answers/student-visa";
import { documents } from "@/content/answers/documents";
import { residencePermit } from "@/content/answers/residence-permit";
import { academicYear } from "@/content/answers/academic-year";
import { languageCourses } from "@/content/answers/language-courses";
import { languageToDegree } from "@/content/answers/language-to-degree";
import { diplomaRecognition } from "@/content/answers/diploma-recognition";
import { budget } from "@/content/answers/budget";
import { payments } from "@/content/answers/payments";
import { internet } from "@/content/answers/internet";
import { rulesForForeigners } from "@/content/answers/rules-for-foreigners";
import { cities, cityPath, mln, deg } from "@/content/cities";

export type WikiSection = { id: string; title: string; zh: string; text: string; articles: Answer[]; extra?: { href: string; title: string; text: string }[] };

export const wikiSections: WikiSection[] = [
  { id: "admission", title: "Поступление", zh: "入学", text: "Гранты, экзамены и требования к языку.", articles: [csc, csca, hsk] },
  { id: "visa", title: "Виза и документы", zh: "签证", text: "Студенческая виза, апостиль, медосмотр и вид на жительство.", articles: [studentVisa, documents, residencePermit] },
  { id: "study", title: "Учёба", zh: "学习", text: "Учебный год, языковые курсы, путь к диплому и его признание в России.", articles: [academicYear, languageCourses, languageToDegree, diplomaRecognition] },
  { id: "money", title: "Деньги", zh: "费用", text: "Сколько стоят учёба и жизнь, как платить и переводить деньги.", articles: [cost, budget, payments] },
  { id: "life", title: "Жизнь в Китае", zh: "生活", text: "Связь и интернет, правила для иностранцев, страховка и подработка.", articles: [internet, rulesForForeigners] },
  {
    id: "cities",
    title: "Города",
    zh: "城市",
    text: "Климат, перелёты из России и вузы в 13 городах каталога.",
    articles: [],
    extra: [
      { href: "/wiki/cities/", title: "Сравнить города", text: "Климат, население, метро и рейсы из России — в одной таблице." },
      ...cities.map((c) => ({ href: cityPath(c), title: c.nameRu, text: `${mln(c.population.value)} жителей, январь ${deg(c.climate.janC)}, июль ${deg(c.climate.julC)}.` })),
    ],
  },
];

export const wikiArticles: Answer[] = wikiSections.flatMap((s) => s.articles);
export const wikiSlug = (a: Answer) => a.path.split("/").filter(Boolean).at(-1)!;
export const wikiSectionOf = (a: Answer) => wikiSections.find((s) => s.articles.includes(a))!;
