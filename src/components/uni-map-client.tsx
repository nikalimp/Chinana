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

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${on ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:border-foreground"}`}>
      {children}
    </button>
  );
}

export function UniMapClient({ path, viewBox, cities, unis }: { path: string; viewBox: string; cities: Record<string, [number, number]>; unis: MapUni[] }) {
  const [type, setType] = useState<string | null>(null);
  const [lang, setLang] = useState<string | null>(null);
  const [csc, setCsc] = useState(false);
  const [hover, setHover] = useState<string | null>(null); // город под курсором
  const [picked, setPicked] = useState<string | null>(null); // город по клику — для телефона и клавиатуры

  const match = useMemo(
    () => unis.filter((u) => (!type || u.types.includes(type)) && (!lang || u.langs.includes(lang)) && (!csc || u.csc)),
    [unis, type, lang, csc],
  );
  const byCity = useMemo(() => {
    const m = new Map<string, MapUni[]>();
    for (const u of match) m.set(u.city, [...(m.get(u.city) ?? []), u]);
    return m;
  }, [match]);
  const allCities = [...new Set(unis.map((u) => u.city))];
  const city = hover ?? picked;
  const shown = city ? byCity.get(city) ?? [] : match;
  const filtered = !!(type || lang || csc);

  return (
    <div className="cards grid-cols-1 lg:grid-cols-[2fr_1fr]">
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
        <p className="mt-2 text-right font-mono text-[11px] text-muted-foreground">Контур — Natural Earth</p>
      </div>

      <div className="flex flex-col bg-card px-[22px] py-[22px]">
        <fieldset>
          <legend className="font-mono text-xs uppercase text-muted-foreground">Программа</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {typeOpts.map((o) => <Chip key={o.v} on={type === o.v} onClick={() => setType(type === o.v ? null : o.v)}>{o.l}</Chip>)}
          </div>
        </fieldset>
        <fieldset className="mt-4">
          <legend className="font-mono text-xs uppercase text-muted-foreground">Язык обучения</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {langOpts.map((o) => <Chip key={o.v} on={lang === o.v} onClick={() => setLang(lang === o.v ? null : o.v)}>{o.l}</Chip>)}
            <Chip on={csc} onClick={() => setCsc(!csc)}>Есть грант CSC</Chip>
          </div>
        </fieldset>

        <div className="mt-6 flex items-baseline justify-between border-t border-grid-line pt-4" aria-live="polite">
          <b className="text-lg">{city ?? (filtered ? "Подходят" : "Все вузы")}</b>
          <span className="font-mono text-xs text-muted-foreground">
            {shown.length} {shown.length === 1 ? "вуз" : shown.length > 1 && shown.length < 5 ? "вуза" : "вузов"}
            {filtered && <button type="button" onClick={() => { setType(null); setLang(null); setCsc(false); setPicked(null); }} className="ml-3 text-primary hover:underline">Сбросить</button>}
          </span>
        </div>
        <ul className="mt-2 max-h-[420px] flex-1 overflow-y-auto">
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
  );
}
