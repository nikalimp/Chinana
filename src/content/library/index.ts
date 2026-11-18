// Библиотека — справочные коллекции для изучения китайского (решение Ника 2026-11-18). Первая — ключи иероглифов.
import { radicals } from "./radicals";

export type Collection = { slug: string; href: string; title: string; zh: string; text: string; count: number };

export const libraryCollections: Collection[] = [
  {
    slug: "radicals",
    href: "/library/radicals/",
    title: "Ключи иероглифов",
    zh: "部首",
    text: "214 ключей, из которых собираются иероглифы: значение, пиньинь, число черт и примеры знаков.",
    count: radicals.length,
  },
];
