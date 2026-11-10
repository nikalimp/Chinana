import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";

// Карточка статьи: обложка, дата, рубрика, заголовок, «Читать →». Обложку рисует media.mjs при выкладке.
export function PostCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}/`} className="group flex flex-col bg-card transition-colors hover:bg-card-hover">
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
        {p.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover} alt={p.coverAlt ?? ""} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        )}
      </div>
      <div className="flex flex-1 flex-col px-[22px] pb-6 pt-5">
        <p className="font-mono text-xs uppercase text-muted-foreground">
          <time dateTime={p.date}>{formatDate(p.date)}</time>{p.rubric && <> · {p.rubric}</>}
        </p>
        <h3 className="mt-2 text-[20px] font-semibold leading-snug">{p.title}</h3>
        <span className="mt-auto pt-4 font-semibold text-brand group-hover:underline">Читать →</span>
      </div>
    </Link>
  );
}
