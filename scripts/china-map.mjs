// Генерирует контур Китая и координаты городов для карты на главной: src/content/data/china-map.json.
// Контур — Natural Earth 1:50m (общественное достояние) из пакета world-atlas. Запуск: node scripts/china-map.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { geoConicEqualArea, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const world = require("world-atlas/countries-50m.json");
const china = feature(world, world.objects.countries).features.find((f) => f.id === "156");

// Города каталога: [долгота, широта]
const cities = {
  Пекин: [116.4, 39.9], Тяньцзинь: [117.2, 39.08], Шанхай: [121.47, 31.23], Нанкин: [118.8, 32.06], Ханчжоу: [120.15, 30.27],
  Хэфэй: [117.23, 31.82], Ухань: [114.31, 30.59], Чэнду: [104.06, 30.66], Гуанчжоу: [113.26, 23.13], Сямэнь: [118.09, 24.48],
  Харбин: [126.53, 45.8], Чанчунь: [125.32, 43.82], Далянь: [121.61, 38.91],
};

const W = 1000, H = 760;
const projection = geoConicEqualArea().parallels([25, 47]).rotate([-105, 0]).fitExtent([[12, 12], [W - 12, H - 12]], china);
const round = (s) => s.replace(/\d+\.\d+/g, (n) => String(Math.round(+n)));
// Округляем до целых пикселей и сливаем близкие точки — контур легче без видимой разницы
const path = round(geoPath(projection)(china))
  .split("M").filter(Boolean)
  .map((ring) => {
    const pts = ring.replace("Z", "").split("L");
    const xy = pts.map((p) => p.split(",").map(Number));
    const kept = [];
    for (const [x, y] of xy) {
      const last = kept.at(-1);
      if (!last || Math.hypot(x - last[0], y - last[1]) >= 3) kept.push([x, y]); // точки ближе 3 px сливаем
    }
    return kept.length > 3 ? "M" + kept.map((p) => p.join(",")).join("L") + "Z" : "";
  })
  .join("");

const used = new Set(JSON.parse(readFileSync("src/content/data/universities.json", "utf8")).map((u) => u.city));
const missing = [...used].filter((c) => !cities[c]);
if (missing.length) throw new Error(`Нет координат для городов: ${missing.join(", ")}`);

const out = {
  viewBox: `0 0 ${W} ${H}`,
  path,
  cities: Object.fromEntries(Object.entries(cities).map(([name, ll]) => [name, projection(ll).map((v) => Math.round(v))])),
};
writeFileSync("src/content/data/china-map.json", JSON.stringify(out) + "\n");
console.log(`Контур: ${(path.length / 1024).toFixed(1)} КБ, городов: ${Object.keys(out.cities).length}`);
