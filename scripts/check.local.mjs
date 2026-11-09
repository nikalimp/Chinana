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
  const css = fs.readFileSync(path.join(ROOT, "src/app/zh-font.css"), "utf8");
  const covered = new Set([...(css.match(/chars: (.*) \*\//)?.[1] ?? "")]);
  const used = new Set();
  for (const f of walk(OUT, [".html"])) for (const c of fs.readFileSync(f, "utf8")) if (isCjk(c)) used.add(c);
  const missing = [...used].filter((c) => !covered.has(c));
  if (missing.length) fail(`Иероглифов нет в шрифте: ${missing.join("")} — запусти python3 scripts/cjk-font.py`);
  else ok(`Китайский шрифт: все ${used.size} иероглифов сайта в подмножестве`);
};
