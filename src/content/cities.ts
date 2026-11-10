// Города Wiki — данные specs/research/wiki-cities.json (проверены 2026-11-10), у каждого факта есть url.
import data from "@/content/data/cities.json";
import { universities } from "@/content/universities";

export type City = {
  slug: string;
  nameRu: string;
  nameZh: string;
  province: string;
  population: { value?: number | null; note?: string; url?: string };
  climate: { janC?: number | null; julC?: number | null; note?: string; url?: string };
  metro: { lines?: number | null; year?: number | null; url?: string };
  flightsFromRussia: { cities: string[]; note?: string; url?: string };
  ground: { note?: string; url?: string };
  facts: { text: string; url: string }[];
};

export const cities = data as unknown as City[];
export const citiesChecked = "2026-11-10";
export const cityPath = (c: City) => `/wiki/cities/${c.slug}/`;
export const cityUnis = (c: City) => universities.filter((u) => u.city === c.nameRu);
export const cityBySlugRu = (nameRu: string) => cities.find((c) => c.nameRu === nameRu);

export const mln = (n?: number | null) => (n ? `${(n / 1e6).toFixed(1).replace(".", ",")} млн` : "—");
export const deg = (n?: number | null) => (n === null || n === undefined ? "—" : `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toString().replace(".", ",")} °C`);

// Прямой ответ страницы города — только из данных
export function cityAnswer(c: City): string {
  const unis = cityUnis(c);
  const fl = c.flightsFromRussia.cities;
  return [
    `${c.nameRu} (${c.nameZh}) — ${c.province.toLowerCase().startsWith("город") ? c.province.toLowerCase() : `город в провинции ${c.province}`}, население — ${mln(c.population.value)} человек.`,
    c.climate.janC !== undefined && c.climate.janC !== null ? `Средняя температура января — ${deg(c.climate.janC)}, июля — ${deg(c.climate.julC)}.` : "",
    c.metro.lines ? `В городе ${c.metro.lines} линий метро.` : "",
    fl.length ? `Прямые рейсы из России: ${fl.join(", ")}.` : "Прямых пассажирских рейсов из России нет: летят с пересадкой в Пекине или Шанхае.",
    unis.length ? `В нашем каталоге ${unis.length === 1 ? "1 вуз" : `${unis.length} вуза`} этого города: ${unis.map((u) => u.nameRu).join(", ")}.` : "",
  ].filter(Boolean).join(" ");
}
