// JSON-LD по стандарту AI-Ready сайта, §5. Один @graph на страницу, сущности связаны через @id.
import { site } from "@/content/site";
import type { Faq, Program } from "@/content/programs";
import type { Answer } from "@/content/answer-types";
import type { Uni } from "@/content/university-types";

export const orgId = `${site.url}/#org`;
export const websiteId = `${site.url}/#website`;
export const personId = `${site.url}/#person`;

const c = site.contacts;

export const orgSchema: Record<string, unknown> = {
  "@type": site.orgType,
  "@id": orgId,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  description: site.description,
  foundingDate: String(site.foundingYear),
  areaServed: site.areaServed,
  ...(site.sameAs.length && { sameAs: site.sameAs }),
  ...(c.phone && { telephone: c.phone }),
  ...(c.email && { email: c.email }),
  ...(c.address.street && {
    address: { "@type": "PostalAddress", streetAddress: c.address.street, addressLocality: c.address.city, addressRegion: c.address.region, postalCode: c.address.postalCode, addressCountry: c.address.country },
  }),
  ...(c.geo && { geo: { "@type": "GeoCoordinates", latitude: c.geo.lat, longitude: c.geo.lng } }),
  ...(c.openingHours.length && {
    openingHoursSpecification: c.openingHours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
  }),
  ...(site.person && { founder: { "@id": personId } }),
};

export const personSchema: Record<string, unknown> | null = site.person && {
  "@type": "Person",
  "@id": personId,
  name: site.person.name,
  jobTitle: site.person.jobTitle,
  description: site.person.description,
  worksFor: { "@id": orgId },
  url: site.url,
  ...(site.person.sameAs.length && { sameAs: site.person.sameAs }),
};

export const websiteSchema = { "@type": "WebSite", "@id": websiteId, url: site.url, name: site.name, inLanguage: "ru-RU", publisher: { "@id": orgId } };

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}

export function faqSchema(faq: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function serviceSchema(p: Program) {
  // Цену в разметку не кладём: на сайте она — ориентир «от» (стандарт: не размечать то, чего нет на странице как факт)
  return {
    "@type": "Service",
    name: p.title,
    serviceType: `Сопровождение поступления: ${p.title.toLowerCase()} в Китае`,
    description: p.answer,
    url: `${site.url}/programs/${p.slug}/`,
    provider: { "@id": orgId },
    areaServed: site.areaServed,
  };
}

export function itemList(items: { name: string; path: string }[]) {
  return {
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: `${site.url}${it.path}` })),
  };
}

export function articleSchema(p: { slug: string; title: string; description: string; date: string; updated?: string; cover?: string }) {
  return {
    "@type": "BlogPosting",
    ...(p.cover && { image: `${site.url}${p.cover}` }),
    headline: p.title,
    description: p.description,
    url: `${site.url}/blog/${p.slug}/`,
    datePublished: p.date,
    dateModified: p.updated ?? p.date,
    inLanguage: "ru-RU",
    author: site.person ? { "@id": personId } : { "@id": orgId },
    publisher: { "@id": orgId },
    mainEntityOfPage: `${site.url}/blog/${p.slug}/`,
  };
}

// Страница-ответ: Article с датой проверки фактов и списком источников (citation).
export function answerSchema(a: Answer) {
  return {
    "@type": "Article",
    headline: `${a.h1} ${a.h1Accent}`,
    description: a.metaDescription,
    url: `${site.url}${a.path}`,
    dateModified: a.updated,
    inLanguage: "ru-RU",
    author: { "@id": orgId },
    publisher: { "@id": orgId },
    mainEntityOfPage: `${site.url}${a.path}`,
    citation: a.sources.map((s) => s.url),
  };
}

// Страница вуза: CollegeOrUniversity — только то, что есть на странице (имя, город, год, сайт-источник).
export function uniSchema(u: Uni) {
  return {
    "@type": "CollegeOrUniversity",
    name: u.nameRu,
    alternateName: [u.nameZh, u.nameEn],
    url: `${site.url}/universities/${u.slug}/`,
    address: { "@type": "PostalAddress", addressLocality: u.city, addressCountry: "CN" },
    ...(u.founded && { foundingDate: String(u.founded) }),
    ...(u.sources.some((s) => s.includes("wikipedia.org")) && { sameAs: u.sources.filter((s) => s.includes("wikipedia.org")) }),
  };
}

export function graph(...nodes: (Record<string, unknown> | null | false | undefined)[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}
