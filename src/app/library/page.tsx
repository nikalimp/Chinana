import type { Metadata } from "next";
import Link from "next/link";
import { libraryCollections } from "@/content/library";
import { Container, GridLines, Section, SectionHead } from "@/components/container";
import { CtaFinal } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { graph, itemList } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Библиотека китайского языка: ключи иероглифов и справочники" },
  description: "Справочники для тех, кто учит китайский перед учёбой в Китае: 214 ключей иероглифов с переводом, пиньинем, числом черт и примерами. Бесплатно, без регистрации.",
  alternates: { canonical: "/library/" },
};

export default function Library() {
  return (
    <>
      <JsonLd data={graph(itemList(libraryCollections.map((c) => ({ name: c.title, path: c.href }))))} />
      <section className="relative overflow-hidden pb-[clamp(48px,6vw,80px)] pt-[clamp(40px,6vw,80px)]">
        <GridLines />
        <Container>
          <SectionHead
            as="h1"
            eyebrow="Библиотека"
            title="Китайский язык:"
            accent="справочники"
            text="Коллекции для тех, кто учит китайский перед учёбой в Китае. Начните с ключей: из них собираются все иероглифы, и по ключу знак ищут в словаре."
            className="mb-0"
          />
        </Container>
      </section>
      <Section className="pt-0">
        <Container>
          <div className="cards grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {libraryCollections.map((c) => (
              <Link key={c.slug} href={c.href} className="group flex min-h-[260px] flex-col bg-card px-[22px] pb-6 pt-[26px] transition-colors hover:bg-card-hover">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-[22px]">{c.title}</h2>
                  <span aria-hidden="true" lang="zh-Hans" className="font-zh text-[26px] font-black leading-none text-primary">{c.zh}</span>
                </div>
                <p className="mt-3 text-muted-foreground">{c.text}</p>
                <p className="mt-auto pt-6 font-mono text-xs uppercase text-muted-foreground">В коллекции: {c.count}</p>
                <span className="mt-2 font-semibold text-brand group-hover:underline">Открыть →</span>
              </Link>
            ))}
          </div>
          <div className="w-cols-8 mt-14 space-y-4 text-[17px]">
            <h2 className="text-center text-[clamp(24px,3vw,32px)]">Зачем <em>библиотека</em></h2>
            <p>
              Китайский кажется трудным, пока иероглифы выглядят как случайные картинки. На деле почти каждый знак собран из повторяющихся деталей. Если знать эти детали, новое слово запоминается быстрее: вы видите в нём знакомые части и понимаете, откуда смысл и звучание.
            </p>
            <p>
              В библиотеке мы собираем справочники, которые нужны взрослому студенту до поездки и в первые месяцы учёбы. Каждая коллекция — открытая страница без регистрации: её можно читать с телефона, искать по ней и возвращаться к ней перед экзаменом. Ключи иероглифов — первая коллекция: таблица из 214 ключей словаря Канси с переводом на русский, пиньинем, числом черт, вариантами написания внутри знака и примерами.
            </p>
            <p>
              Как заниматься по библиотеке. Выделяйте 10⁠–⁠15 минут в день: возьмите 5 ключей, найдите их в словах своего учебника и напишите каждый от руки несколько раз. Через месяц вы будете узнавать основу почти любого нового иероглифа, а словарь по ключам перестанет быть загадкой. Такой подход особенно помогает взрослым: опора на логику знака работает лучше, чем зубрёжка списков.
            </p>
            <p>
              Библиотека дополняет <Link href="/wiki/" className="text-brand underline underline-offset-4">Wiki об учёбе в Китае</Link>: там — гранты, экзамены, визы и деньги, здесь — сам язык. Если хотите учить китайский в Китае с преподавателями, посмотрите <Link href="/programs/language-year/" className="text-brand underline underline-offset-4">программу «Языковой год»</Link>: подберём вуз и курс под ваш уровень.
            </p>
          </div>
        </Container>
      </Section>
      <CtaFinal />
    </>
  );
}
