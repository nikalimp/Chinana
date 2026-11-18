import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { getPosts } from "@/lib/posts";
import { Container, Section, SectionHead } from "@/components/container";
import { PostList } from "@/components/post-card";
import { JsonLd } from "@/components/json-ld";
import { graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Блог Chinana: работа, бизнес, учёба и жизнь в Китае" },
  description: "Блог о работе, карьере, бизнесе, учёбе и жизни в Китае для взрослых из России: визы, зарплаты, магистратура, стоимость жизни. Новая статья каждый будний день.",
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
          <SectionHead as="h1" eyebrow="Блог" title="Китай" accent="изнутри" text="Каждый день — о работе, карьере, бизнесе, учёбе и жизни в Китае для взрослых. У каждой цифры — ссылка на источник." />
          <div className="w-cols-8 mb-10 space-y-4 text-[17px]">
            <p>
              «Китай изнутри» — блог Chinana для взрослых, которые видят в Китае следующий шаг: учёбу, новую работу или свой бизнес. Каждая статья отвечает на один практический вопрос: какая виза нужна для работы, сколько платят специалисту с китайским, как поступить в магистратуру после 30, сколько стоит месяц жизни в Пекине, с чего начать закупки у китайских поставщиков.
            </p>
            <p>
              Цифры берём из первоисточников: сайтов вузов, правительственных порталов Китая, вакансий и официальной статистики — со ссылкой и датой. Если тема касается поступления, денег или визы, в статье есть ссылка на подробный разбор в нашей <Link href="/wiki/" className="text-brand hover:underline">Wiki об учёбе в Китае</Link>.
            </p>
            <p>
              Новости университетов — в отдельной ленте <Link href="/news/" className="text-brand hover:underline">«Новости вузов»</Link>, а сравнить программы и вузы можно в разделах <Link href="/programs/" className="text-brand hover:underline">«Программы»</Link> и <Link href="/universities/" className="text-brand hover:underline">«Вузы»</Link>. Нашли ошибку или устаревшую цифру? Напишите нам — проверим по источнику и исправим.
            </p>
            <p>
              Кому пригодится блог. Тем, кто думает о магистратуре или языковом годе после нескольких лет работы и боится потерять карьеру. Тем, кто работает с китайскими поставщиками и хочет понимать партнёров без переводчика. Тем, кто ищет работу в китайской компании в России или в самом Китае и хочет знать, какой уровень языка и какие документы для этого нужны. Мы пишем без обещаний «лёгкого переезда»: честно говорим о визах, деньгах, языке и сроках, а в конце статьи даём шаги, с которых можно начать уже сегодня.
            </p>
            <p className="font-mono text-xs uppercase text-muted-foreground">Рубрики: работа и карьера, бизнес с Китаем, учёба для взрослых, жизнь в Китае</p>
          </div>
          {posts.length === 0 && <p className="text-center text-muted-foreground">Статьи скоро появятся.</p>}
          <PostList posts={posts} />
        </Container>
      </Section>
    </>
  );
}
