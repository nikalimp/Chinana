// Модель вуза — spec §4 «Серийные страницы». Данные — src/content/data/universities.json
// (собраны из specs/research/universities-*.json, у каждого факта есть url).
type Num = number | string | null | undefined;

export type UniProgram = {
  type: "language" | "bachelor" | "master" | "phd";
  language?: string;
  duration?: string;
  priceCny?: Num; // «10500» или «23000–42000»; период — в priceNote
  priceNote?: string;
  url: string;
};

export type Uni = {
  slug: string;
  partner: boolean; // true — партнёр ведёт поступление; false — справка + консультация
  nameRu: string;
  nameZh: string;
  zhShort: string;
  nameEn: string;
  city: string;
  founded?: number | null;
  rankings: { name: string; value: string; year: number; url: string }[];
  programs: UniProgram[];
  grants: { name: string; url: string }[];
  hskMin?: { bachelor?: string; master?: string; url?: string };
  dorm?: { priceCny?: Num; period?: string; url?: string };
  applicationFeeCny?: Num;
  applicationWindow?: string;
  facts: { text: string; url: string }[];
  sources: string[];
};

export const programLabel: Record<UniProgram["type"], string> = {
  language: "Языковые курсы",
  bachelor: "Бакалавриат",
  master: "Магистратура",
  phd: "Аспирантура",
};

// «23000–42000» → «23 000–42 000 ¥»
export function cny(v: Num): string {
  if (v === null || v === undefined || v === "") return "";
  return String(v).replace(/\d{4,}/g, (d) => Number(d).toLocaleString("ru-RU").replace(/ /g, " ")) + " ¥";
}
