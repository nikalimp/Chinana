#!/usr/bin/env node
// Новостной поток Chinana (specs/design-news-factory.md): сбор новостей вузов каталога → отбор → пересказ на русском → content/news/*.md.
// Запуск каждый день в 12:34 на Маке Ника — задача bb «Новости вузов» вызывает scripts/news/daily.sh.
//
//   node scripts/news/run.mjs            собрать и написать новости (без git)
//   node scripts/news/run.mjs --probe    только проверить источники: сколько ссылок и дат нашлось
//   node scripts/news/run.mjs --dry      отобрать и показать, но не писать файлы
//
// ИИ — самый дешёвый из доступных (функция ai ниже): по умолчанию Claude Haiku через CLI `claude` по подписке Ника (без доплат);
// если в content/factory/.env есть DEEPSEEK_API_KEY или OPENROUTER_API_KEY — можно переключить NEWS_AI=deepseek | openrouter.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { extractLinks, extractText, fetchHtml } from "./extract.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."); // fileURLToPath: путь может содержать пробелы
const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry");
const PROBE = args.has("--probe");

const LIMIT_PER_UNI = 2; // в день
const LIMIT_TOTAL = 12; // в день
const MAX_AGE_DAYS = 30; // старше — не берём
const NEWS_DIR = path.join(ROOT, "content/news");
const SEEN_FILE = path.join(ROOT, "content/factory/news/seen.json");

// --- окружение: ключи из content/factory/.env (в git не попадает) ---
for (const f of [path.join(ROOT, "content/factory/.env")]) {
  if (!fs.existsSync(f)) continue;
  for (const line of fs.readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const today = new Date();
const todayIso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const daysAgo = (iso) => (Date.parse(todayIso) - Date.parse(iso)) / 86400000;
const log = (...a) => console.log(...a);

const unis = JSON.parse(fs.readFileSync(path.join(ROOT, "src/content/data/universities.json"), "utf8"));
const uniBySlug = Object.fromEntries(unis.map((u) => [u.slug, u]));
const sources = JSON.parse(fs.readFileSync(path.join(ROOT, "src/content/data/news-sources.json"), "utf8"));
delete sources._comment;

// --- ИИ ---
const CLAUDE = process.env.CLAUDE_BIN || [path.join(os.homedir(), ".local/bin/claude"), "/usr/local/bin/claude", "/opt/homebrew/bin/claude"].find((p) => fs.existsSync(p)) || "claude";

function run(cmd, argv, input, timeoutMs = 240000) {
  return new Promise((resolve, reject) => {
    // cwd — временная папка: CLI не подхватывает CLAUDE.md проекта, промпт короче и дешевле
    const p = spawn(cmd, argv, { cwd: os.tmpdir(), env: process.env });
    let out = "", err = "";
    const t = setTimeout(() => { p.kill("SIGKILL"); reject(new Error(`timeout ${cmd}`)); }, timeoutMs);
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => { clearTimeout(t); code === 0 ? resolve(out) : reject(new Error(`${cmd} exit ${code}: ${err.slice(0, 300) || out.slice(0, 300)}`)); });
    p.stdin.end(input);
  });
}

async function chatApi(url, key, model, prompt) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.3 }),
    signal: AbortSignal.timeout(180000),
  });
  if (!r.ok) throw new Error(`${url} ${r.status} ${(await r.text()).slice(0, 200)}`);
  return (await r.json()).choices[0].message.content;
}

async function ai(prompt) {
  const mode = process.env.NEWS_AI || "claude";
  if (mode === "deepseek") return chatApi("https://api.deepseek.com/chat/completions", process.env.DEEPSEEK_API_KEY, process.env.NEWS_AI_MODEL || "deepseek-chat", prompt);
  if (mode === "openrouter") return chatApi("https://openrouter.ai/api/v1/chat/completions", process.env.OPENROUTER_API_KEY, process.env.NEWS_AI_MODEL || "deepseek/deepseek-chat-v3-0324:free", prompt);
  return run(CLAUDE, ["-p", "--model", process.env.NEWS_AI_MODEL || "haiku", "--output-format", "text"], prompt);
}

function parseJson(s) {
  const t = s.replace(/```(?:json)?/gi, "");
  const a = t.indexOf("["), o = t.indexOf("{");
  const start = a >= 0 && (o < 0 || a < o) ? a : o;
  const end = Math.max(t.lastIndexOf("]"), t.lastIndexOf("}"));
  return JSON.parse(t.slice(start, end + 1));
}

// --- 1. Сбор ссылок ---
async function collect() {
  const all = [];
  const report = [];
  for (const [slug, urls] of Object.entries(sources)) {
    if (!uniBySlug[slug]) continue;
    for (const url of urls) {
      const r = await fetchHtml(url);
      if (!r || r.status >= 400 || !r.html) { report.push(`${slug} ${url} — не открылся (${r?.status ?? "сеть"})`); continue; }
      const links = extractLinks(r.html, r.url).map((l) => ({ ...l, uni: slug, date: l.date && daysAgo(l.date) >= 0 ? l.date : "" }));
      report.push(`${slug} ${url} — ссылок ${links.length}, с датой ${links.filter((l) => l.date).length}`);
      all.push(...links);
      await new Promise((res) => setTimeout(res, 1500)); // вежливость: не чаще раза в 1,5 с
    }
  }
  return { all, report };
}

// --- 2. Отбор ---
const TOPICS = ["admission", "scholarship", "exams", "ranking", "campus", "science", "career"];
async function select(cands) {
  const list = cands.map((c, i) => `${i}. [${uniBySlug[c.uni].nameEn}] ${c.date || "без даты"} — ${c.title}`).join("\n");
  const prompt = `Ты редактор русскоязычного сайта о поступлении в вузы Китая для взрослых из России (Chinana). Ниже — заголовки со страниц вузов (китайский или английский).
Выбери до ${LIMIT_TOTAL} новостей, полезных взрослому иностранцу, который думает учиться или работать в Китае: набор и сроки подачи, новые программы, стипендии и гранты, экзамены (HSK, CSCA), рейтинги, жизнь иностранных студентов и кампус, крупные научные достижения, карьера и стажировки, сотрудничество с Россией.
Не бери: партийную и идеологическую работу, внутренние совещания, визиты делегаций без пользы для студента, списки фамилий, объявления о закупках, спорт и концерты, если они не про иностранных студентов.
Не больше ${LIMIT_PER_UNI} новостей на один вуз. Если полезного нет — верни [].
Ответ — только JSON-массив без пояснений: [{"i": номер, "topic": одно из ${TOPICS.join("|")}}]

${list}`;
  const picked = parseJson(await ai(prompt));
  return picked.filter((p) => cands[p.i] && TOPICS.includes(p.topic)).map((p) => ({ ...cands[p.i], topic: p.topic }));
}

// --- 3. Пересказ ---
async function write(item, page) {
  const u = uniBySlug[item.uni];
  const prompt = `Напиши новость для сайта Chinana на русском по материалу с сайта вуза. Это пересказ своими словами, не дословный перевод.
Вуз: ${u.nameRu} (${u.nameZh}), ${u.city}.
Заголовок источника: ${page.title || item.title}
Дата публикации в источнике: ${item.date || page.date || "не указана"}
Текст источника:
"""
${page.text.slice(0, 6000)}
"""

Правила:
- Аудитория — взрослые из России, которые думают учиться или работать в Китае. Пиши просто и по делу, без канцелярита, без восклицаний и эмодзи.
- Первый абзац — прямой ответ: что произошло, в каком вузе, когда (40–60 слов).
- Затем 2–4 коротких абзаца или список: подробности и что это значит для студента из России (сроки, требования, ссылки, если они есть в тексте).
- Объём тела — 130–300 слов. Подзаголовки уровня ## можно, H1 не пиши.
- Факты, цифры, даты и названия — только из текста источника. Нет в тексте — не пиши. Не выдумывай сроки и суммы.
- Цитата из источника — не больше одной и не длиннее 15 слов.
- Не обещай поступление и не пиши «гарантируем». Имена людей — по-русски, в скобках можно оригинал.
- Не пиши строку «Источник» — сайт добавит её сам.
- title — 50–90 знаков, по-русски, с названием вуза; description — 120–160 знаков.
- topic — одно из: ${TOPICS.join(", ")}.
- published — дата публикации в источнике в формате ГГГГ-ММ-ДД или "".
Если в тексте нет содержательной новости (только меню, список ссылок или пусто) — верни {"skip": true}.
Ответ — только JSON без пояснений: {"title": "...", "description": "...", "topic": "...", "published": "...", "body": "markdown"}`;
  return parseJson(await ai(prompt));
}

const yaml = (s) => JSON.stringify(String(s ?? ""));
function save(item, n) {
  const date = todayIso;
  const id = crypto.createHash("sha1").update(item.url).digest("hex").slice(0, 6);
  const slug = `${date}-${item.uni}-${id}`;
  // Дата публикации: от ИИ, иначе со страницы-списка, иначе из адреса (/2026/1112/). Дата из будущего — это дата события, не публикации
  const urlDate = item.url.match(/\/(20\d{2})[/-]?(\d{2})[/-]?(\d{2})\//);
  const ok = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d || "") && daysAgo(d) >= 0;
  const published = [n.published, item.date, urlDate && `${urlDate[1]}-${urlDate[2]}-${urlDate[3]}`].find(ok) || "";
  const md = `---
title: ${yaml(n.title)}
description: ${yaml(n.description)}
date: ${date}
universities: ${item.uni}
topic: ${TOPICS.includes(n.topic) ? n.topic : item.topic}
sourceUrl: ${yaml(item.url)}
sourceTitle: ${yaml(item.pageTitle || item.title)}
sourcePublished: ${published}
---

${n.body.trim()}
`;
  fs.mkdirSync(NEWS_DIR, { recursive: true });
  fs.writeFileSync(path.join(NEWS_DIR, `${slug}.md`), md);
  return slug;
}

function valid(n) {
  if (!n || n.skip) return "пропуск по решению ИИ";
  if (!n.title || n.title.length < 20 || n.title.length > 120) return "заголовок";
  if (!n.description || n.description.length < 60) return "описание";
  const words = (n.body || "").split(/\s+/).filter(Boolean).length;
  if (words < 80) return `мало слов (${words})`;
  if (/гарантиру|поступим|100\s?%/i.test(n.body)) return "запрещённые слова";
  const cjk = [...n.body].filter((c) => /[一-鿿]/.test(c)).length;
  if (cjk > 40) return "много иероглифов — не перевод";
  return "";
}

// --- main ---
const seen = new Set(fs.existsSync(SEEN_FILE) ? JSON.parse(fs.readFileSync(SEEN_FILE, "utf8")) : []);
const { all, report } = await collect();

if (PROBE) {
  log(report.join("\n"));
  process.exit(0);
}

const fresh = all.filter((c) => !seen.has(c.url) && (!c.date || daysAgo(c.date) <= MAX_AGE_DAYS));
// Без даты на странице-списке — берём, но не больше 15 с источника: на главных бывают ссылки на старые разделы
const perUni = {};
const cands = fresh.filter((c) => { perUni[c.uni] = (perUni[c.uni] ?? 0) + 1; return perUni[c.uni] <= 15; });
log(`Новости вузов ${todayIso}: ссылок ${all.length}, новых ${fresh.length}, к отбору ${cands.length}`);

let picked = [];
if (cands.length) {
  try { picked = await select(cands); } catch (e) { log(`Ошибка отбора: ${e.message}`); process.exit(1); }
}
const count = {};
picked = picked.filter((p) => (count[p.uni] = (count[p.uni] ?? 0) + 1) <= LIMIT_PER_UNI).slice(0, LIMIT_TOTAL);
log(`Отобрано: ${picked.length}`);

const done = [];
for (const item of picked) {
  const page = await fetchHtml(item.url);
  if (!page || page.status >= 400) { log(`  — ${item.uni}: статья не открылась ${item.url}`); continue; }
  const text = extractText(page.html);
  if (text.text.length < 150) { log(`  — ${item.uni}: в статье нет текста ${item.url}`); continue; }
  if (text.date && daysAgo(text.date) > MAX_AGE_DAYS) { log(`  — ${item.uni}: старая (${text.date})`); continue; }
  item.date ||= text.date;
  item.pageTitle = text.title;
  try {
    const n = await write(item, text);
    const why = valid(n);
    if (why) { log(`  — ${item.uni}: ${why}`); continue; }
    if (DRY) { log(`  ✓ ${item.uni}: ${n.title}`); continue; }
    done.push(save(item, n));
    log(`  ✓ ${item.uni}: ${n.title}`);
  } catch (e) {
    log(`  — ${item.uni}: ошибка ИИ ${e.message.slice(0, 200)}`);
  }
}

if (!DRY) {
  // Все просмотренные ссылки — в seen: завтра отбор идёт только по новым
  for (const c of cands) seen.add(c.url);
  fs.mkdirSync(path.dirname(SEEN_FILE), { recursive: true });
  fs.writeFileSync(SEEN_FILE, JSON.stringify([...seen].slice(-5000), null, 0) + "\n");
}
const broken = report.filter((r) => r.includes("не открылся"));
log(`Опубликовано: ${done.length}${broken.length ? `\nНе открылись источники:\n${broken.join("\n")}` : ""}`);
