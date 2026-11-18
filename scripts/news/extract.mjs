// Извлечение ссылок-кандидатов в новости со страницы-списка и текста статьи из HTML. Без зависимостей.
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'", ldquo: "“", rdquo: "”", mdash: "—", ndash: "–", middot: "·" };
export const decode = (s) => s.replace(/&(#x?[0-9a-f]+|[a-z0-9]+);/gi, (m, e) => {
  if (e[0] === "#") { const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) ? String.fromCodePoint(n) : m; }
  return ENT[e.toLowerCase()] ?? m;
});
const clean = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

// Дата рядом со ссылкой: 2026-11-05, 2026/11/05, 2026.11.05, 2026年11月5日, 11-05 (+год страницы)
const DATE = /(20\d{2})\s*[-/.年]\s*(\d{1,2})\s*[-/.月]\s*(\d{1,2})/;
const SHORT = /(?:^|[^\d])(\d{1,2})[-/.](\d{1,2})(?:[^\d]|$)/;
const iso = (y, m, d) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
export function findDate(s, year = new Date().getFullYear()) {
  const m = s.match(DATE);
  if (m && +m[2] >= 1 && +m[2] <= 12 && +m[3] >= 1 && +m[3] <= 31) return iso(m[1], m[2], m[3]);
  const k = s.match(SHORT);
  if (k && +k[1] >= 1 && +k[1] <= 12 && +k[2] >= 1 && +k[2] <= 31) return iso(year, k[1], k[2]);
  return "";
}

const SKIP = /(javascript:|mailto:|^#|\.(pdf|docx?|xlsx?|zip|rar|jpg|png)$)/i;
const NAV = /^(首页|更多|more|home|english|中文|登录|login|下一页|上一页|next|prev|返回|联系我们|contact|about)/i;

export function extractLinks(html, baseUrl) {
  const out = new Map();
  const base = new URL(baseUrl);
  const re = /<a\b[^>]*?href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = decode(m[1]).trim();
    if (SKIP.test(href)) continue;
    let url;
    try { url = new URL(href, base); } catch { continue; }
    if (!/^https?:$/.test(url.protocol)) continue;
    const titleAttr = m[0].match(/title\s*=\s*["']([^"']{6,})["']/i)?.[1];
    const title = clean(titleAttr || m[2]);
    if (title.length < 8 || title.length > 200 || NAV.test(title)) continue;
    // Новость обычно лежит глубже главной: /info/1234/5678.htm, /2026/1105/c123a456/page.htm, ?id=
    if (url.pathname.split("/").filter(Boolean).length < 2 && !url.search) continue;
    const ctx = clean(html.slice(Math.max(0, m.index - 200), m.index + m[0].length + 200));
    const date = findDate(m[0]) || findDate(ctx) || findDate(url.pathname.replace(/\//g, "-"));
    url.hash = "";
    const key = url.href;
    if (!out.has(key)) out.set(key, { url: key, title, date });
  }
  return [...out.values()];
}

// Основной текст статьи: самый длинный блок из абзацев; запасной вариант — весь текст без меню
export function extractText(html) {
  const body = html.replace(/<(script|style|noscript|header|footer|nav)\b[\s\S]*?<\/\1>/gi, " ");
  const blocks = [...body.matchAll(/<(div|article|section|td)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((b) => clean(b[2]));
  const paras = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((p) => clean(p[1])).filter((p) => p.length > 20);
  let text = paras.join("\n");
  if (text.length < 300) text = blocks.sort((a, b) => b.length - a.length)[0] ?? clean(body);
  const title = clean(body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? body.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  return { title, text: text.slice(0, 8000), date: findDate(clean(body).slice(0, 4000)) };
}

// Загрузка страницы через curl: идёт через системный прокси, терпит старые сертификаты вузов, отдаёт байты — кодировку (UTF-8 или GBK) определяем сами
import { execFile } from "node:child_process";
export const UA = "Mozilla/5.0 (compatible; ChinanaNewsBot/1.0; +https://chinana.ru/news/)";
export function fetchHtml(url, timeout = 25) {
  return new Promise((resolve) => {
    execFile("curl", ["-sL", "--compressed", "-m", String(timeout), "-A", UA, "-w", "\n__URL__%{url_effective} %{http_code}", url], { encoding: "buffer", maxBuffer: 20 * 1024 * 1024 }, (err, out) => {
      if (err && !out?.length) return resolve(null);
      const tail = out.lastIndexOf(Buffer.from("\n__URL__"));
      const meta = out.subarray(tail + 8).toString().trim().split(" ");
      const bytes = out.subarray(0, tail);
      const head = bytes.subarray(0, 3000).toString("latin1");
      const cs = (head.match(/charset\s*=\s*["']?([\w-]+)/i)?.[1] ?? "utf-8").toLowerCase();
      let html;
      try { html = new TextDecoder(/gb|gbk|gb2312|gb18030/.test(cs) ? "gb18030" : cs).decode(bytes); } catch { html = bytes.toString("utf8"); }
      resolve({ url: meta[0] || url, status: Number(meta[1]) || 0, html });
    });
  });
}
