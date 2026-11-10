import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { getPosts } from "@/lib/posts";
import { Container, Section, SectionHead } from "@/components/container";
import { PostCard } from "@/components/post-card";
import { JsonLd } from "@/components/json-ld";
import { graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Блог о поступлении в Китай: гранты, экзамены, вузы",
  description: "Статьи о поступлении в вузы Китая: гранты CSC, экзамены CSCA и HSK, документы, города и стоимость учёбы для взрослых из России.",
  alternates: { canonical: "/blog/" },
  ...(!site.features.blog && { robots: { index: false, follow: true } }),
};

export default function Blog() {
  const posts = getPosts();
  return (
    <>
      <JsonLd data={graph({ "@type": "Blog", name: `Блог ${site.name}`, url: `${site.url}/blog/` })} />
      <Section>
        <Container>
          <SectionHead as="h1" eyebrow="Блог" title="Китай" accent="изнутри" text="Раз в неделю — факты, обычаи и праздники Китая, которые стоит знать до учёбы и переезда. У каждого факта — ссылка на источник." />
          <div className="mx-auto mb-10 max-w-[46em] space-y-4 text-[17px]">
            <p>
              «Китай изнутри» — блог Chinana о том, как устроена жизнь в Китае. Мы пишем о праздниках и календаре, обычаях и этикете, языке и иероглифах, еде и городах. Каждая статья отвечает на один вопрос, который задают перед поездкой: когда китайский Новый год, почему едят палочками, сколько иероглифов нужно знать, чем живёт Харбин зимой.
            </p>
            <p>
              Все факты — со ссылками на источники: правительственные порталы Китая, сайты университетов, энциклопедии и официальную статистику. Новая статья выходит раз в неделю. Если тема касается учёбы — даты семестров, языка, денег или визы, — в конце статьи есть ссылка на подробный разбор в нашей <Link href="/wiki/" className="text-brand hover:underline">Wiki об учёбе в Китае</Link>.
            </p>
            <p>
              Блог пригодится тем, кто только присматривается к Китаю, и тем, кто уже выбрал вуз. Первым он покажет страну без экзотики: что празднуют, как едят, как говорят. Вторым поможет заранее понять быт и не тратить первые недели на удивление. Мы не пишем о политике и не пересказываем новости — только то, что пригодится в обычной жизни студента: в общежитии, в столовой, на рынке, в поезде и на занятиях.
            </p>
            <p>
              Хотите сразу к делу? Сравните <Link href="/programs/" className="text-brand hover:underline">программы</Link>, посмотрите <Link href="/universities/" className="text-brand hover:underline">вузы Китая</Link> с ценами в юанях или напишите менеджеру в Telegram — подскажем, с чего начать.
            </p>
            <p>
              Нашли ошибку или устаревшую цифру? Напишите нам — проверим по источнику и исправим статью, а дату обновления поставим в начале текста.
            </p>
            <p className="font-mono text-xs uppercase text-muted-foreground">Рубрики: праздники · обычаи и этикет · язык · еда · города</p>
          </div>
          {posts.length === 0 && <p className="text-center text-muted-foreground">Статьи скоро появятся.</p>}
          <div className="cards grid-cols-1 md:grid-cols-2">
            {posts.map((p) => <PostCard key={p.slug} p={p} />)}
          </div>
        </Container>
      </Section>
    </>
  );
}
