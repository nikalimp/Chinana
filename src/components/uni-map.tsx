import map from "@/content/data/china-map.json";
import { universities, uniPath } from "@/content/universities";
import { UniMapClient, type MapUni } from "./uni-map-client";

// Контурная карта Китая с городами каталога (контур — scripts/china-map.mjs, Natural Earth).
// Сервер готовит лёгкие данные для карты: в браузер уходят только поля для фильтров, не весь каталог.
const has = (s: string | undefined, re: RegExp) => !!s && re.test(s.toLowerCase());

export function UniMap() {
  const unis: MapUni[] = universities.map((u) => ({
    slug: u.slug,
    href: uniPath(u),
    name: u.nameRu,
    zh: u.zhShort,
    city: u.city,
    types: [...new Set(u.programs.map((p) => p.type))],
    langs: [...new Set(u.programs.flatMap((p) => [has(p.language, /кит/) && "zh", has(p.language, /англ/) && "en"].filter(Boolean) as string[]))],
    csc: u.grants.some((g) => /правительств\S* кита|csc|cgs/i.test(g.name)),
    partner: u.partner,
  }));
  return <UniMapClient path={map.path} viewBox={map.viewBox} cities={map.cities as unknown as Record<string, [number, number]>} unis={unis} />;
}
