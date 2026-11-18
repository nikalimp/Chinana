import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { radicalGroups, radicals, topRadicals, type Radical } from "@/content/library/radicals";
import { Container, GridLines, Section, SectionHead } from "@/components/container";
import { FaqList } from "@/components/faq";
import { CtaFinal } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "214 ключей китайских иероглифов: таблица с переводом и пиньинем" },
  description: "Все 214 ключей иероглифов по словарю Канси: значение на русском, пиньинь, число черт, варианты внутри знака и примеры. Таблица по числу черт.",
  alternates: { canonical: "/library/radicals/" },
};

const faq = [
  { q: "Что такое ключ иероглифа?", a: "Ключ — смысловая часть иероглифа, по которой знак ищут в словаре. Обычно он подсказывает тему: 氵 — вода (河 — река), 木 — дерево (林 — лес), 讠 — речь (说 — говорить)." },
  { q: "Почему ключей именно 214?", a: "Это таблица словаря Канси 1716 года. Она стала классической: по ней устроены многие словари и порядок знаков в Юникоде. В современных словарях упрощённых иероглифов таблицу ключей пересмотрели, но её основа — те же 214 знаков." },
  { q: "Нужно ли учить все 214 ключей сразу?", a: "Нет. Начните с 20⁠–⁠30 самых частых: человек, вода, рука, трава, речь, рот, дерево, нить, сердце, огонь, металл. Остальные запомнятся сами, когда встретятся в новых словах." },
  { q: "Чем ключ отличается от варианта?", a: "Внутри иероглифа многие ключи пишутся короче. Вода 水 слева становится тремя точками 氵, рука 手 — 扌, человек 人 — 亻. Это один и тот же ключ, поэтому в таблице варианты указаны рядом." },
  { q: "Пригодятся ли ключи на экзамене HSK?", a: "Напрямую ключи не проверяют, но с ними быстрее запоминаются слова и легче угадать смысл незнакомого знака в тексте. Это ускоряет чтение, а на HSK 3 и выше чтения много." },
];

function RadicalCard({ r }: { r: Radical }) {
  return (
    <li id={`r${r.n}`} className="flex min-h-[200px] scroll-mt-24 flex-col bg-card px-4 pb-4 pt-3.5">
      <span className="flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>№ {r.n}</span>
        <span>{r.strokes} черт</span>
      </span>
      <span className="mt-2 flex items-baseline gap-2">
        <span lang="zh-Hans" className="font-zh-lib text-[52px] leading-none text-primary">{r.zh}</span>
        {(r.full || r.variants) && (
          <span lang="zh-Hans" className="font-zh-lib text-xl leading-none text-muted-foreground">
            {[r.full, ...(r.variants ?? [])].filter(Boolean).join(" ")}
          </span>
        )}
      </span>
      <span className="mt-2 font-mono text-[13px] text-brand">{r.py}</span>
      <b className="mt-0.5 text-[15px] font-semibold leading-snug">{r.ru}</b>
      {r.ex.length > 0 && (
        <span className="mt-auto pt-2 text-[13px] text-muted-foreground">
          Например: <span lang="zh-Hans" className="font-zh-lib text-[17px] text-foreground">{r.ex.join(" ")}</span>
        </span>
      )}
    </li>
  );
}

export default function Radicals() {
  const schema = {
    "@type": "DefinedTermSet",
    name: "214 ключей китайских иероглифов",
    url: `${site.url}/library/radicals/`,
    inLanguage: "ru",
    hasDefinedTerm: radicals.map((r) => ({ "@type": "DefinedTerm", termCode: String(r.n), name: r.zh, alternateName: r.py, description: r.ru })),
  };
  return (
    <>
      <JsonLd data={graph(schema, faqSchema(faq))} />
      <section className="relative overflow-hidden pb-[clamp(48px,6vw,80px)] pt-[clamp(40px,6vw,80px)]">
        <GridLines />
        <div aria-hidden="true" lang="zh-Hans" className="zh-bg left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 text-[clamp(200px,30vw,420px)] text-primary opacity-[0.06]">部首</div>
        <Container>
          <SectionHead
            as="h1"
            eyebrow="Библиотека / 部首 bùshǒu"
            title="Ключи иероглифов:"
            accent="все 214"
            className="mb-0"
          />
          <div className="w-cols-8 mt-6 space-y-4 text-center text-[clamp(17px,1.5vw,19px)] text-muted-foreground">
            <p>
              Ключ — часть иероглифа, которая подсказывает его смысл и по которой знак ищут в словаре. Классическая таблица — 214 ключей из словаря Канси 1716 года. Из них, как из деталей, собраны почти все иероглифы: 妈 «мама» = 女 «женщина» + 马 «лошадь» (подсказывает звук <i>mǎ</i>).
            </p>
            <p>
              Ниже — все 214 ключей по числу черт: значение на русском, пиньинь, полная форма и варианты, которыми ключ пишется внутри знака, и примеры.
            </p>
          </div>
          <nav aria-label="Ключи по числу черт" className="mt-10 flex flex-wrap justify-center gap-2">
            {radicalGroups.map((g) => (
              <a key={g.strokes} href={`#s${g.strokes}`} className="inline-flex min-w-11 justify-center rounded-full border border-border px-3 py-1.5 font-mono text-sm hover:bg-secondary">
                {g.strokes}
              </a>
            ))}
          </nav>
          <p className="mt-3 text-center font-mono text-xs uppercase text-muted-foreground">Число черт</p>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHead eyebrow="С чего начать" title="12 ключей," accent="которые встретятся чаще всего" text="С ними собраны тысячи частых иероглифов. Выучите их первыми: смысл многих новых слов станет понятен с первого взгляда." />
          <ul className="cards grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {topRadicals.map((r) => <RadicalCard key={r.n} r={r} />)}
          </ul>
        </Container>
      </Section>

      {radicalGroups.map((g) => (
        <Section key={g.strokes} id={`s${g.strokes}`} className="scroll-mt-16 py-[clamp(40px,6vw,72px)]">
          <Container>
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <h2 className="text-[clamp(24px,3vw,34px)]">{g.strokes} {g.strokes === 1 ? "черта" : g.strokes < 5 ? "черты" : "черт"}</h2>
              <span className="font-mono text-xs uppercase text-muted-foreground">Ключи № {g.items[0].n}–{g.items.at(-1)!.n}</span>
            </div>
            <ul className="cards grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {g.items.map((r) => <RadicalCard key={r.n} r={r} />)}
            </ul>
          </Container>
        </Section>
      ))}

      <Section>
        <Container>
          <SectionHead eyebrow="Как учить" title="Как пользоваться" accent="ключами" />
          <div className="w-cols-8 space-y-4 text-[17px]">
            <p>Смотрите на левую и верхнюю часть знака: ключ чаще всего стоит там. 你, 他, 们 начинаются с 亻 — все они про людей. 河, 海, 洗 — с 氵, они про воду.</p>
            <p>Вторая часть знака часто подсказывает чтение. 妈 <i>mā</i>, 吗 <i>ma</i>, 骂 <i>mà</i> звучат похоже, потому что в каждом есть 马 <i>mǎ</i>. Ключ даёт смысл, вторая часть — звук.</p>
            <p>Учите ключи вместе со словами из своего уровня HSK, а не списком. Про уровни и число знаков — в статье <Link href="/wiki/hsk/" className="text-brand underline underline-offset-4">об экзамене HSK</Link>, про языковые курсы в Китае — в <Link href="/programs/language-year/" className="text-brand underline underline-offset-4">программе «Языковой год»</Link>.</p>
            <p className="text-sm text-muted-foreground">
              Источник таблицы: словарь Канси (康熙字典, 1716), <a href="https://en.wikipedia.org/wiki/Kangxi_radical" rel="noopener" target="_blank" className="hover:text-primary">список ключей Канси</a>; формы — по упрощённому письму путунхуа.
            </p>
          </div>
        </Container>
      </Section>

      <Section id="faq">
        <Container>
          <SectionHead eyebrow="Частые вопросы" title="Ключи" accent="вопросы и ответы" />
          <FaqList items={faq} />
        </Container>
      </Section>

      <CtaFinal />
    </>
  );
}
