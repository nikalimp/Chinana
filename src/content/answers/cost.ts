import type { Answer } from "@/content/answer-types";
import { universities } from "@/content/universities";
import type { Uni } from "@/content/university-types";
import { programs, formatRub } from "@/content/programs";

// /cost/ — цифры считаются из каталога вузов (src/content/data/universities.json), не вписываются руками (T13).

const nums = (v: unknown) => String(v ?? "").match(/\d[\d\s]*/g)?.map((s) => Number(s.replace(/\s/g, ""))) ?? [];
const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/ /g, " ");

// Языковые курсы, юаней в год
export function langPerYear(u: Uni): number | null {
  const p = u.programs.find((x) => x.type === "language" && x.priceCny);
  if (!p) return null;
  const v = nums(p.priceCny)[0];
  const first = (p.priceNote ?? "").split(/[;,(]/)[0]; // «10 500 юаней за семестр» или «в год»
  return /семестр|полгода|полугод/.test(first) ? v * 2 : v;
}

// Общежитие, юаней в месяц: [мин, макс]
export function dormPerMonth(u: Uni): [number, number] | null {
  const d = u.dorm;
  if (!d?.priceCny) return null;
  const [a, b = a] = nums(d.priceCny);
  const per = d.period ?? "";
  const k = /^день/.test(per) ? 30 : /^год/.test(per) ? 1 / 12 : /^семестр/.test(per) ? 1 / 5 : /^месяц/.test(per) ? 1 : null;
  return k ? [a * k, b * k] : null;
}

const rows = universities.map((u) => ({ u, lang: langPerYear(u), dorm: dormPerMonth(u) }));
const langs = rows.map((r) => r.lang).filter((x): x is number => !!x);
const dorms = rows.flatMap((r) => r.dorm ?? []);
const langMin = Math.min(...langs), langMax = Math.max(...langs);
const dormMin = Math.min(...dorms);
const fees = universities.map((u) => nums(u.applicationFeeCny)).flat().filter((n) => n > 0);
const langYear = programs.find((p) => p.slug === "language-year")!;

const uniSources = [...new Set(universities.flatMap((u) => [u.programs.find((p) => p.type === "language")?.url, u.dorm?.url]).filter((s): s is string => !!s))];

export const cost: Answer = {
  path: "/wiki/cost/",
  crumb: "Стоимость учёбы",
  zh: "费用",
  eyebrow: "Расходы на учёбу в Китае",
  h1: "Сколько стоит",
  h1Accent: "год учёбы в Китае",
  metaTitle: "Сколько стоит учёба в Китае в 2027 году: цены вузов в юанях",
  metaDescription: `Языковой год в Китае — от ${fmt(langMin)} до ${fmt(langMax)} юаней за обучение, общежитие — от ${fmt(dormMin)} юаней в месяц. Цены ${universities.length} вузов со ссылками.`,
  answer: `Год языковых курсов в китайском вузе стоит от ${fmt(langMin)} до ${fmt(langMax)} юаней, общежитие — от ${fmt(dormMin)} юаней в месяц, одноместные комнаты дороже. Бакалавриат и магистратура обычно стоят от 20 000 до 50 000 юаней в год. К этому добавляются разовые расходы: сбор за заявку ${fmt(Math.min(...fees))}–${fmt(Math.max(...fees))} юаней, экзамены, виза, перелёт и медосмотр. Цифры посчитаны по данным ${universities.length} вузов нашего каталога. Грант правительства Китая может закрыть обучение и общежитие целиком.`,
  updated: "2026-11-09",
  facts: [
    { label: "Языковой год", value: `${fmt(langMin)}–${fmt(langMax)} ¥`, note: "обучение, без жилья" },
    { label: "Общежитие", value: `от ${fmt(dormMin)} ¥`, note: "в месяц, зависит от вуза и комнаты" },
    { label: "Сбор за заявку", value: `${fmt(Math.min(...fees))}–${fmt(Math.max(...fees))} ¥`, note: "разово, вуз не возвращает" },
    { label: "Сопровождение", value: `от ${formatRub(langYear.price)}`, note: "языковой год с Chinana, ориентир" },
  ],
  sections: [
    {
      id: "table",
      eyebrow: "По вузам",
      title: "Цены",
      accent: "в каталоге вузов",
      paragraphs: [
        "Ниже — языковые курсы за год и общежитие в месяц по данным сайтов вузов. Если вуз указывает цену за семестр, мы умножили её на два. Общежитие за день умножили на 30, за семестр — разделили на 5 месяцев, за год — на 12. Точную сумму вуз называет при зачислении, ссылки на источники — на странице каждого вуза.",
      ],
      table: {
        caption: "Языковые курсы и общежитие, юаней",
        head: ["Вуз", "Город", "Курсы за год", "Общежитие в месяц"],
        rows: rows.map((r) => [r.u.nameRu, r.u.city, r.lang ? fmt(r.lang) : "—", r.dorm ? (r.dorm[0] === r.dorm[1] ? fmt(r.dorm[0]) : `${fmt(r.dorm[0])}–${fmt(r.dorm[1])}`) : "—"]),
      },
    },
    {
      id: "once",
      eyebrow: "Разовые расходы",
      title: "Что оплачивается",
      accent: "один раз",
      list: [
        `Сбор за заявку в вуз: ${fmt(Math.min(...fees))}–${fmt(Math.max(...fees))} юаней по данным каталога.`,
        "Экзамен HSK в России: от 2000 рублей за HSK 1⁠–⁠2 до 4000 рублей за HSK 5⁠–⁠6 (Институт Конфуция ВГСПУ).",
        "Экзамен CSCA для бакалавриата: 450 юаней за один предмет, 700 — за два и больше.",
        "Студенческая виза X1, медосмотр по форме вуза, перевод и заверение документов, перелёт.",
      ],
      src: [1, 2],
    },
    {
      id: "grant",
      eyebrow: "Как сэкономить",
      title: "Грант",
      accent: "закрывает основные расходы",
      paragraphs: [
        "Полный грант правительства Китая (CSC) покрывает обучение, общежитие и медицинскую страховку и платит стипендию: 2500 юаней в месяц бакалавру, 3000 — магистранту и стажёру, 3500 — аспиранту. Перелёт и визу он не оплачивает. Ещё есть гранты провинций, городов и самих вузов: их список — на странице каждого вуза.",
      ],
      src: [3],
    },
    {
      id: "service",
      eyebrow: "Наши услуги",
      title: "Сколько стоит",
      accent: "сопровождение",
      paragraphs: [
        "Цены на сопровождение — ориентир, точную сумму назовёт менеджер после диагностики. Оплата 50/50: вторая часть — после приглашения вуза.",
      ],
      table: {
        head: ["Программа", "Сопровождение от"],
        rows: programs.map((p) => [p.title, formatRub(p.price)]),
      },
    },
  ],
  faq: [
    { q: "Сколько денег нужно на год в Китае?", a: `Обучение на языковых курсах — ${fmt(langMin)}–${fmt(langMax)} юаней в год, общежитие — от ${fmt(dormMin)} юаней в месяц. Добавьте питание, транспорт и личные расходы: они зависят от города, в Пекине и Шанхае выше.` },
    { q: "Где учиться в Китае дешевле?", a: "По нашему каталогу дешевле всего языковые курсы в вузах северо-востока, например в Хэйлунцзянском университете в Харбине. Дороже всего — в Пекинском университете." },
    { q: "Можно ли учиться в Китае бесплатно?", a: "Да, по полному гранту правительства Китая. Он покрывает обучение, общежитие и страховку и платит стипендию от 2500 юаней в месяц." },
    { q: "В какой валюте платить за учёбу?", a: "Вузы выставляют счёт в юанях. Способ оплаты из России уточняйте у вуза при зачислении." },
  ],
  sources: [
    { title: "Цены на экзамены HSK 2025/2026 — ВГСПУ", url: "https://www.vspu.ru/sites/default/files/media/docs/2025-11/7587.pdf" },
    { title: "CSCA FAQs — Study in Shanghai", url: "https://english.shanghai.gov.cn/en-FAQs-StudyinShanghai/20251218/134bb78943f640519e2185ff83051f5d.html" },
    { title: "Introduction to Chinese Government Scholarships — Study in China", url: "https://studychina.chinaservicesinfo.com/s/202508/06/WS6131d0f1498e6a12c1205424/introduction-to-chinese-government-scholarships.html" },
    ...uniSources.map((url) => ({ title: `Цены вуза — ${new URL(url).hostname}`, url })),
  ],
  related: [
    { href: "/universities/", label: "Каталог вузов" },
    { href: "/wiki/csc/", label: "Грант CSC" },
    { href: "/programs/language-year/", label: "Языковой год" },
  ],
};
