import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";

// Карточка статьи: обложка слева, дата, рубрика, заголовок, «Читать →». Обложку рисует media.mjs при выкладке.
export function PostCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}/`} className="group grid bg-card sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
        {p.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover} alt={p.coverAlt ?? ""} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
        )}
      </div>
      <div className="flex flex-col px-[22px] pb-6 pt-5">
        <p className="font-mono text-xs uppercase text-muted-foreground">
          <time dateTime={p.date}>{formatDate(p.date)}</time>{p.rubric && <>, {p.rubric}</>}
        </p>
        <h3 className="mt-2 text-[20px] font-semibold leading-snug group-hover:text-primary">{p.title}</h3>
        <span className="mt-auto pt-4 font-semibold text-brand group-hover:underline">Читать →</span>
      </div>
    </Link>
  );
}

// Список статей: одна колонка шириной 8 из 12 колонок сетки, по центру.
export function PostList({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-0">
      <div className="cards grid-cols-1 lg:col-span-8 lg:col-start-3">
        {posts.map((p) => <PostCard key={p.slug} p={p} />)}
      </div>
    </div>
  );
}
