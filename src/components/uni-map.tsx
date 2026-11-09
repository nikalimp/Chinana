import Link from "next/link";
import map from "@/content/data/china-map.json";
import { universities, uniPath } from "@/content/universities";

// Контурная карта Китая с городами каталога (контур — scripts/china-map.mjs, Natural Earth).
// Без JavaScript: наведение на город в списке подсвечивает точку на карте через :has().
// Подписи на карте: сторона подписи подобрана так, чтобы соседние города не наезжали друг на друга.
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

export function UniMap() {
  const cities = [...new Set(universities.map((u) => u.city))].map((city, i) => ({
    city,
    i,
    xy: (map.cities as Record<string, number[]>)[city],
    unis: universities.filter((u) => u.city === city),
  })).sort((a, b) => b.unis.length - a.unis.length);
  const css = cities
    .map(({ i }) => `.unimap:has([data-c="${i}"]:hover,[data-c="${i}"]:focus-within) [data-p="${i}"]{--pin:var(--primary);--pin-r:14px}`)
    .join("");

  return (
    <div className="unimap cards grid-cols-1">
      <style>{css}</style>
      <div className="relative bg-card p-[clamp(12px,3vw,32px)]">
        <div className="mx-auto max-w-[860px]">
        <svg viewBox={map.viewBox} role="img" aria-label={`Карта Китая: ${universities.length} вузов в ${cities.length} городах`} className="h-auto w-full">
          <path d={map.path} className="fill-secondary/60 stroke-foreground" strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {cities.map(({ city, i, xy, unis }) => {
            const l = label[city] ?? { dx: 14, dy: 5, anchor: "start" as const };
            return (
              <g key={city} data-p={i} className="[--pin-r:8px] [--pin:var(--brand)]">
                <circle cx={xy[0]} cy={xy[1]} r={unis.length > 1 ? 16 : 12} className="fill-primary/15" />
                <circle cx={xy[0]} cy={xy[1]} style={{ r: "var(--pin-r)", fill: "var(--pin)", transition: "r .15s" }} />
                <text x={xy[0] + l.dx} y={xy[1] + l.dy} textAnchor={l.anchor} className="hidden fill-foreground font-mono text-[17px] font-medium sm:block">
                  {city}{unis.length > 1 ? ` · ${unis.length}` : ""}
                </text>
              </g>
            );
          })}
        </svg>
        </div>
        <p className="mt-2 text-right font-mono text-[11px] text-muted-foreground">Контур — Natural Earth</p>
      </div>

      <div className="bg-card px-[22px] py-[22px]">
        <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map(({ city, i, unis }) => (
            <li key={city} data-c={i} className="break-inside-avoid border-b border-grid-line py-3">
              <span className="font-mono text-xs uppercase text-muted-foreground">{city}</span>
              <ul className="mt-1">
                {unis.map((u) => (
                  <li key={u.slug}>
                    <Link href={uniPath(u)} className="flex items-baseline gap-2 py-0.5 hover:text-primary">
                      <span lang="zh-Hans" className="w-[3.2em] shrink-0 whitespace-nowrap font-zh text-sm font-black text-primary">{u.zhShort}</span>
                      <span>{u.nameRu}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
