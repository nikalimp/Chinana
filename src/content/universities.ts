import data from "@/content/data/universities.json";
import type { Uni } from "@/content/university-types";
import { cny, programLabel } from "@/content/university-types";

export const universities = data as unknown as Uni[];

// Дата сбора данных каталога (specs/research/universities-*.json)
export const unisChecked = "2026-11-09";

export const uniPath = (u: Uni) => `/universities/${u.slug}/`;

// Прямой ответ страницы вуза (первые 100 слов) — собирается из данных, без выдумок.
export function uniAnswer(u: Uni): string {
  const qs = u.rankings.find((r) => r.name.startsWith("QS"));
  const lang = u.programs.find((p) => p.type === "language");
  const bach = u.programs.find((p) => p.type === "bachelor" && p.priceCny);
  const mast = u.programs.find((p) => p.type === "master" && p.priceCny);
  const parts = [
    `${u.nameRu} (${u.nameZh}) — университет в городе ${u.city}${u.founded ? `, основан в ${u.founded} году` : ""}.`,
    qs ? `В рейтинге QS ${qs.year} года — ${qs.value} место.` : "",
    "Иностранцев принимают на " + u.programs.map((p) => programLabel[p.type].toLowerCase()).filter((v, i, a) => a.indexOf(v) === i).join(", ") + ".",
    lang?.priceCny ? `Языковые курсы — ${cny(lang.priceCny)}${lang.priceNote?.includes("семестр") ? " за семестр" : ""}.` : "",
    bach ? `Бакалавриат — ${cny(bach.priceCny)} в год.` : "",
    mast ? `Магистратура — ${cny(mast.priceCny)} в год.` : "",
    u.grants.length ? "Для иностранцев есть гранты, в том числе стипендия правительства Китая." : "",
  ];
  return parts.filter(Boolean).join(" ");
}

export function uniFaq(u: Uni) {
  const faq: { q: string; a: string }[] = [];
  if (u.hskMin?.bachelor || u.hskMin?.master)
    faq.push({ q: `Какой HSK нужен для поступления в ${u.nameRu}?`, a: [u.hskMin.bachelor && `Бакалавриат: ${u.hskMin.bachelor}.`, u.hskMin.master && `Магистратура: ${u.hskMin.master}.`].filter(Boolean).join(" ") });
  const lang = u.programs.find((p) => p.type === "language");
  if (lang?.priceNote) faq.push({ q: "Сколько стоят языковые курсы?", a: lang.priceNote });
  if (u.grants.length) faq.push({ q: "Какие гранты есть для иностранцев?", a: u.grants.map((g) => g.name).join("; ") + "." });
  if (u.dorm?.priceCny) faq.push({ q: "Сколько стоит общежитие?", a: `${cny(u.dorm.priceCny)} — ${u.dorm.period ?? ""}`.trim() + "." });
  faq.push({ q: "Можно ли поступить без знания китайского?", a: "Да, через языковые курсы: язык учат с нуля, затем сдают HSK и поступают на степень. Ещё вариант — программы на английском, если они есть в вузе." });
  return faq;
}
