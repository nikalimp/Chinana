// Проектные проверки Chinana — раздел 8 scripts/check.mjs.
import fs from "node:fs";
import path from "node:path";

const isCjk = (c) => {
  const o = c.codePointAt(0);
  return (o >= 0x2e80 && o <= 0x9fff) || (o >= 0xf900 && o <= 0xfaff) || (o >= 0x3000 && o <= 0x303f) || (o >= 0xff00 && o <= 0xffef);
};

function walk(dir, ext) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p, ext) : ext.some((x) => p.endsWith(x)) ? [p] : [];
  });
}

export default async ({ ROOT, OUT, fail, ok }) => {
  // Иероглифы на страницах должны быть в подмножестве шрифта (scripts/cjk-font.py), иначе браузер покажет системный шрифт
  const chars = (file) => new Set([...(fs.readFileSync(path.join(ROOT, file), "utf8").match(/chars: (.*) \*\//)?.[1] ?? "")]);
  const covered = chars("src/app/zh-font.css");
  const libCovered = chars("src/app/library/zh-lib.css"); // Библиотека — свой шрифт (scripts/cjk-font.py)
  const sep = path.sep;
  let used = 0;
  const missing = new Set();
  // Статьи блога и новости не считаем: их текст набран Onest, иероглифы в нём рисует системный шрифт — подмножество нужно только для font-zh
  for (const f of walk(OUT, [".html"]).filter((f) => !f.includes(`${sep}blog${sep}`) && !f.includes(`${sep}news${sep}`))) {
    const lib = f.includes(`${sep}library${sep}`);
    for (const c of fs.readFileSync(f, "utf8").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, "")) // только видимый текст, без alt и разметки
      if (isCjk(c)) { used++; if (!covered.has(c) && !(lib && libCovered.has(c))) missing.add(c); }
  }
  if (missing.size) fail(`Иероглифов нет в шрифте: ${[...missing].join("")} — запусти python3 scripts/cjk-font.py`);
  else ok(`Китайский шрифт: все иероглифы сайта в подмножестве (${covered.size} в общем, ${libCovered.size} в библиотеке)`);
};
