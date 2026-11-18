import Link from "next/link";
import { formatDate } from "@/lib/posts";
import { topicLabel, type News } from "@/lib/news";
import { universities } from "@/content/universities";

const uniName = (slug: string) => universities.find((u) => u.slug === slug)?.nameRu ?? slug;

// Карточка новости: дата, тема, вуз, заголовок, анонс. data-* — для фильтра на /news/
export function NewsCard({ n, showUni = true }: { n: News; showUni?: boolean }) {
  return (
    <li data-uni={n.universities.join(" ")} data-topic={n.topic} className="bg-card">
      <Link href={`/news/${n.slug}/`} className="group block px-[22px] pb-6 pt-5 transition-colors hover:bg-card-hover">
        <p className="font-mono text-xs uppercase text-muted-foreground">
          <time dateTime={n.date}>{formatDate(n.date)}</time>, {topicLabel[n.topic]}
          {showUni && <>, {n.universities.map(uniName).join(", ")}</>}
        </p>
        <h3 className="mt-2 text-[20px] font-semibold leading-snug group-hover:text-primary">{n.title}</h3>
        <p className="mt-2 text-[15px] text-muted-foreground">{n.description}</p>
      </Link>
    </li>
  );
}

export function NewsList({ items, showUni = true }: { items: News[]; showUni?: boolean }) {
  return <ul data-news-list className="cards grid-cols-1">{items.map((n) => <NewsCard key={n.slug} n={n} showUni={showUni} />)}</ul>;
}
