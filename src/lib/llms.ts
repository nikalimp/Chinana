// llms.txt и llms-full.txt (https://llmstxt.org) — генерируются из того же контента, что и страницы.
import { site } from "@/content/site";
import { programs, formatRub } from "@/content/programs";
import { home } from "@/content/home";
import { getPosts } from "./posts";

// Простой текст для нейросетей: неразрывные пробелы типографа заменяем обычными
const plain = (s: string) => s.replace(/\u00A0/g, " ").replace(/\u2060/g, "");
const c = site.contacts;

function contacts() {
  return [
    c.phone && `- Телефон: ${c.phoneDisplay || c.phone}`,
    c.email && `- Почта: ${c.email}`,
    c.telegram && `- Telegram: ${c.telegram}`,
    c.whatsapp && `- WhatsApp: ${c.whatsapp}`,
    c.address.street && `- Адрес: ${[c.address.city, c.address.street].filter(Boolean).join(", ")}`,
    c.hours && `- Часы работы: ${c.hours}`,
    `- Сайт: ${site.url}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function llmsTxt() {
  const posts = getPosts();
  return plain(`# ${site.name}

> ${home.answer}

## Программы
${programs.map((p) => `- [${p.title}](${site.url}/programs/${p.slug}/): ${p.short} Сопровождение — от ${formatRub(p.price)}, оплата 50/50.`).join("\n")}
${posts.length ? `\n## Статьи\n${posts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}/): ${p.description}`).join("\n")}\n` : ""}
## О сервисе
- ${site.tagline}
- [Контакты](${site.url}/contacts/)
- Подробная версия для LLM: ${site.url}/llms-full.txt

## Контакты
${contacts()}
`);
}

export function llmsFullTxt() {
  const blocks = programs.map(
    (p) =>
      `## ${p.h1} ${p.h1Accent}\nURL: ${site.url}/programs/${p.slug}/\n\n${p.answer}\n\n${p.facts.map((f) => `- ${f.label}: ${f.value} (${f.note})`).join("\n")}\n\nКому подходит:\n${p.forWhom.map((f) => `- ${f.title}: ${f.text}`).join("\n")}\n\nТребования:\n${p.requirements.map((r) => `- ${r.label}: ${r.value}${r.note ? ` (${r.note})` : ""}`).join("\n")}\n\nСопровождение: от ${formatRub(p.price)}, оплата 50/50.\n\nВопросы:\n${p.faq.map((f) => `- ${f.q} ${f.a}`).join("\n")}\n`,
  );
  const posts = getPosts().map((p) => `## ${p.title}\nURL: ${site.url}/blog/${p.slug}/\nДата: ${p.updated ?? p.date}\n\n${p.body}`);
  return plain(
    `${llmsTxt()}\n---\n\n# Частые вопросы\n\n${home.faq.map((f) => `- ${f.q} ${f.a}`).join("\n")}\n\n---\n\n# Программы\n\n${blocks.join("\n\n")}\n${posts.length ? `\n---\n\n# Статьи\n\n${posts.join("\n\n")}\n` : ""}`,
  );
}
