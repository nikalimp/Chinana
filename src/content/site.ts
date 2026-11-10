// Единый источник правды о компании. Заполняется по specs/00-brief.md и specs/02-spec.md.
// Всё, что помечено TODO(клиент), должно быть заменено фактами до запуска: `npm run check` не пропустит TODO.

export type OrgType =
  | "Organization"
  | "LocalBusiness"
  | "ProfessionalService"
  | "Dentist"
  | "MedicalClinic"
  | "LegalService"
  | "EducationalOrganization"
  | "HomeAndConstructionBusiness"
  | "Store";

export const site = {
  url: "https://chinana.ru",
  name: "Chinana",
  legalName: "Самозанятый Никита Алимпиев",
  // Тип организации в Schema.org — самый точный из подходящих: https://schema.org/LocalBusiness#subtypes
  orgType: "ProfessionalService" as OrgType,
  title: "Поступление в Китай для взрослых: программы и гранты", // title главной, до 60 символов
  description: "Поступление в вузы Китая для взрослых из России: языковой год, foundation, бакалавриат и магистратура, гранты CSC. Оплата 50/50.",
  // Одна фраза о компании для llms.txt и футера
  tagline: "Поступление в вузы Китая для взрослых: языковой год, foundation, бакалавриат, магистратура, гранты.",
  lang: "ru",
  locale: "ru_RU",
  foundingYear: 2026,
  areaServed: ["RU"],

  contacts: {
    phone: "", // формат +7XXXXXXXXXX; пусто — блок не показывается
    phoneDisplay: "",
    email: "",
    telegram: "https://t.me/chinana",
    whatsapp: "",
    address: {
      street: "",
      city: "",
      region: "",
      postalCode: "",
      country: "RU",
    },
    geo: null as null | { lat: number; lng: number },
    hours: "",
    openingHours: [] as { days: string[]; opens: string; closes: string }[],
  },

  // Главное целевое действие — чат менеджера (spec v0.4: бота и формы пока нет)
  cta: {
    label: "Хочу в Китай",
    href: "https://t.me/chinana",
  },

  // Реквизиты для футера и политики ПДн (152-ФЗ). Самозанятый (НПД) — без ОГРН
  legal: {
    status: "самозанятый (налог на профессиональный доход)",
    inn: "667109362983",
    ogrn: "",
    privacyEmail: "nikitaaalimpiev@gmail.com",
  },

  // Профили бренда на внешних площадках
  sameAs: ["https://t.me/chinana"] as string[],
  socials: [{ label: "Telegram", href: "https://t.me/chinana" }] as { label: string; href: string }[],
  metaNote: "",

  person: null as null | { name: string; jobTitle: string; description: string; sameAs: string[] },

  metrikaId: 114137119,
  darkTheme: false, // только светлая тема (spec §9)

  // Функции включаются и выключаются флагами, а не удалением кода (стандарт §1.9)
  features: {
    blog: false, // P1: контент-завод после запуска
    news: false, // P1: новости вузов (design-news-factory.md)
    calculator: false, // P1
    leadForm: false, // отложено вместе с ботом (spec v0.4)
    stats: false, // цифры доверия — ждём факты партнёра
    reviews: false, // отзывы и кейсы — ждём партнёра
  },
};

export const nav = [
  { href: "/programs/", label: "Программы" },
  { href: "/universities/", label: "Вузы" },
  { href: "/wiki/", label: "Wiki" },
  ...(site.features.blog ? [{ href: "/blog/", label: "Блог" }] : []),
];
