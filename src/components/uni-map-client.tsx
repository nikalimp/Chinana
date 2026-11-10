"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type MapUni = {
  slug: string;
  href: string;
  name: string;
  zh: string;
  city: string;
  types: string[];
  langs: string[];
  csc: boolean;
  partner: boolean;
};

// Сторона подписи подобрана так, чтобы соседние города не наезжали друг на друга
const label: Record<string, { dx: number; dy: number; anchor: "start" | "end" | "middle" }> = {
  Пекин: { dx: -14, dy: -6, anchor: "end" },
  Тяньцзинь: { dx: -12, dy: 20, anchor: "end" },
  Далянь: { dx: 14, dy: 5, anchor: "start" },
  Шанхай: { dx: 14, dy: 5, anchor: "start" },
  Нанкин: { dx: 0, dy: -16, anchor: "middle" },
  Хэфэй: { dx: -14, dy: 5, anchor: "end" },
  Ханчжоу: { dx: 10, dy: 24, anchor: "start" },
  Ухань: { dx: -14, dy: 5, anchor: "end" },
  Чэнду: { dx: -14, dy: 5, anchor: "end" },
  Гуанчжоу: { dx: -14, dy: 5, anchor: "end" },
  Сямэнь: { dx: 14, dy: 5, anchor: "start" },
  Харбин: { dx: 14, dy: 5, anchor: "start" },
  Чанчунь: { dx: 14, dy: 5, anchor: "start" },
};

const typeOpts = [
  { v: "language", l: "Языковые курсы" },
  { v: "bachelor", l: "Бакалавриат" },
  { v: "master", l: "Магистратура" },
];
const langOpts = [
  { v: "zh", l: "На китайском" },
  { v: "en", l: "На английском" },
];

export function UniMapClient({ path, viewBox, cities, unis }: { path: string; viewBox: string; cities: Record<string, [number, number]>; unis: MapUni[] }) {
  const [type, setType] = useState<string | null>(null);
  const [lang, setLang] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null); // город под курсором
  const [picked, setPicked] = useState<string | null>(null); // город по клику — для телефона и клавиатуры

  const match = useMemo(
    () => unis.filter((u) => (!type || u.types.includes(type)) && (!lang || u.langs.includes(lang)) ),
    [unis, type, lang],
  );
  const byCity = useMemo(() => {
    const m = new Map<string, MapUni[]>();
    for (const u of match) m.set(u.city, [...(m.get(u.city) ?? []), u]);
    return m;
  }, [match]);
  const allCities = [...new Set(unis.map((u) => u.city))];
  const city = hover ?? picked;
  const shown = city ? byCity.get(city) ?? [] : match;
  const filtered = !!(type || lang);

  const select = "h-11 rounded-full border border-border bg-card pl-4 pr-10 text-[15px] appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat hover:border-foreground focus-visible:outline-2 focus-visible:outline-primary";
  const chevron = { backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231F1410' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" };
  return (
    <div>
    <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
      <label className="sr-only" htmlFor="map-type">Программа</label>
      <select id="map-type" value={type ?? ""} onChange={(e) => { setType(e.target.value || null); setPicked(null); }} className={select} style={chevron}>
        <option value="">Все программы</option>
        {typeOpts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <label className="sr-only" htmlFor="map-lang">Язык обучения</label>
      <select id="map-lang" value={lang ?? ""} onChange={(e) => { setLang(e.target.value || null); setPicked(null); }} className={select} style={chevron}>
        <option value="">Любой язык обучения</option>
        {langOpts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
    <div className="cards grid-cols-1 lg:grid-cols-2">
      <div className="relative bg-card p-[clamp(12px,2.5vw,28px)]">
        <svg viewBox={viewBox} role="img" aria-label={`Карта Китая: ${match.length} вузов в ${byCity.size} городах`} className="h-auto w-full">
          <path d={path} className="fill-secondary/60 stroke-foreground" strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {allCities.map((c) => {
            const xy = cities[c];
            if (!xy) return null;
            const n = byCity.get(c)?.length ?? 0;
            const active = c === city;
            const l = label[c] ?? { dx: 14, dy: 5, anchor: "start" as const };
            return (
              <g
                key={c}
                role="button"
                tabIndex={n ? 0 : -1}
                aria-label={`${c}: ${n} вузов`}
                aria-pressed={c === picked}
                onMouseEnter={() => n && setHover(c)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => n && setHover(c)}
                onBlur={() => setHover(null)}
                onClick={() => n && setPicked(c === picked ? null : c)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && n && (e.preventDefault(), setPicked(c === picked ? null : c))}
                className={`outline-none ${n ? "cursor-pointer" : "opacity-25"}`}
              >
                <circle cx={xy[0]} cy={xy[1]} r={28} fill="transparent" />
                <circle cx={xy[0]} cy={xy[1]} r={n > 1 ? 18 : 13} className="fill-primary/15" />
                <circle cx={xy[0]} cy={xy[1]} r={active ? 13 : 8} className={active ? "fill-primary" : "fill-brand"} style={{ transition: "r .15s" }} />
                <text x={xy[0] + l.dx} y={xy[1] + l.dy} textAnchor={l.anchor} className={`hidden font-mono text-[17px] sm:block ${active ? "fill-primary font-bold" : "fill-foreground font-medium"}`}>
                  {c}{n > 1 ? ` · ${n}` : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="relative bg-card">
        <div className="flex h-full max-h-[460px] flex-col px-[22px] py-[22px] lg:absolute lg:inset-0 lg:max-h-none">
        <div className="flex items-baseline justify-between border-b border-grid-line pb-3" aria-live="polite">
          <b className="text-lg">{city ?? (filtered ? "Подходят" : "Все вузы")}</b>
          <span className="font-mono text-xs text-muted-foreground">
            {shown.length} {shown.length === 1 ? "вуз" : shown.length > 1 && shown.length < 5 ? "вуза" : "вузов"}
            {filtered && <button type="button" onClick={() => { setType(null); setLang(null); setPicked(null); }} className="ml-3 text-primary hover:underline">Сбросить</button>}
          </span>
        </div>
        <ul className="mt-1 min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {shown.map((u) => (
            <li key={u.slug}>
              <Link href={u.href} className="flex items-baseline gap-2 border-b border-grid-line py-2 hover:text-primary">
                <span lang="zh-Hans" className="w-[3.2em] shrink-0 whitespace-nowrap font-zh text-sm font-black text-primary">{u.zh}</span>
                <span className="flex-1">{u.name}</span>
                {!city && <span className="font-mono text-xs text-muted-foreground">{u.city}</span>}
              </Link>
            </li>
          ))}
          {!shown.length && <li className="py-3 text-muted-foreground">Под эти условия вузов в каталоге пока нет. Напишите менеджеру — подберём.</li>}
        </ul>
        </div>
      </div>
    </div>
    </div>
  );
}
