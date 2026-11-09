// Собирает src/content/data/universities.json из specs/research/universities-*.json.
// Порядок — по частотности запросов (01-research), вузы без программ не попадают в каталог.
// Запуск: node scripts/merge-universities.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const order = ["nanjing", "tsinghua", "peking", "fudan", "sjtu", "zhejiang", "wuhan", "hit", "blcu", "heilongjiang", "jilin", "dlut", "sysu", "ustc", "tongji", "bnu", "nankai", "xiamen", "sichuan", "shisu"];
// Короткое имя для вертикальной подписи в карточке (как вуз называют в Китае)
const zhShort = { tsinghua: "清华", peking: "北大", fudan: "复旦", sjtu: "交大", zhejiang: "浙大", nanjing: "南大", wuhan: "武大", hit: "哈工大", blcu: "北语", sysu: "中大", ustc: "中科大", tongji: "同济", bnu: "北师大", nankai: "南开", xiamen: "厦大", sichuan: "川大", jilin: "吉大", dlut: "大工", heilongjiang: "黑大", shisu: "上外" };
const partners = new Set([]); // TODO(партнёр): слаги вузов, куда партнёр ведёт поступление

const all = [1, 2].flatMap((n) => JSON.parse(readFileSync(`specs/research/universities-${n}.json`, "utf8")));
const out = all
  .filter((u) => u.programs?.length)
  .map(({ gaps, ...u }) => ({ ...u, zhShort: zhShort[u.slug] ?? u.nameZh.slice(0, 2), partner: partners.has(u.slug) }))
  .sort((a, b) => (order.indexOf(a.slug) + 100) % 100 - (order.indexOf(b.slug) + 100) % 100);

mkdirSync("src/content/data", { recursive: true });
writeFileSync("src/content/data/universities.json", JSON.stringify(out, null, 1) + "\n");
console.log(`Вузов в каталоге: ${out.length} из ${all.length}. Пропущены: ${all.filter((u) => !u.programs?.length).map((u) => u.slug).join(", ") || "—"}`);
