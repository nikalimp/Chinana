import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { home } from "@/content/home";
import { Container, Section, SectionHead } from "@/components/container";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/posts";

// Секции главной v0.6: цели, мифы, путь к HSK. Без фото — иероглифы и иконки.

export function WhyChinese() {
  return (
    <Section id="why">
      <Container>
        <SectionHead title={home.whyHead.title} accent={home.whyHead.accent} text={home.whyHead.text} />
        <div className="cards grid-cols-1 md:grid-cols-2">
          {home.why.map((w) => (
            <article key={w.value} className="relative flex min-h-[260px] flex-col overflow-hidden bg-card px-[26px] pb-6 pt-[26px]">
              <span aria-hidden="true" lang="zh-Hans" className="pointer-events-none absolute -bottom-6 -right-3 font-zh text-[150px] font-black leading-none text-primary opacity-[0.07]">{w.zh}</span>
              <b className="block text-[clamp(44px,5vw,64px)] font-bold leading-none text-primary">{w.value}</b>
              <p className="mt-3 max-w-[22em] text-lg font-semibold leading-snug">{w.label}</p>
              <p className="mt-3 max-w-[30em] text-[15px] text-muted-foreground">{w.text}</p>
              <a href={w.url} rel="noopener" target="_blank" className="relative mt-auto pt-5 font-mono text-[11px] uppercase text-muted-foreground hover:text-primary">Источник: {w.source} ↗</a>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function Goals() {
  return (
    <Section id="goals">
      <Container>
        <SectionHead eyebrow={home.goalsHead.eyebrow} title={home.goalsHead.title} accent={home.goalsHead.accent} text={home.goalsHead.text} />
        <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {home.goals.map((g) => (
            <Link key={g.title} href={g.href} className="group relative flex min-h-[220px] flex-col overflow-hidden bg-card px-[22px] pb-6 pt-[26px] transition-colors hover:bg-card-hover">
              <span aria-hidden="true" lang="zh-Hans" className="pointer-events-none absolute -bottom-4 -right-2 font-zh text-[120px] font-black leading-none text-primary opacity-[0.08] transition-opacity group-hover:opacity-[0.14]">{g.zh}</span>
              <span aria-hidden="true" lang="zh-Hans" className="font-zh text-[28px] font-black leading-none text-primary">{g.zh}</span>
              <h3 className="mt-5 text-[22px] font-bold uppercase leading-tight">{g.title}</h3>
              <p className="mt-2 text-[15px] text-muted-foreground">{g.text}</p>
              <span className="mt-auto pt-5 font-semibold text-brand group-hover:underline">Подробнее →</span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function Myths() {
  return (
    <Section id="myths">
      <Container>
        <SectionHead title={home.mythsHead.title} accent={home.mythsHead.accent} />
        <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {home.myths.map((m) => (
            <article key={m.myth} className="relative flex flex-col overflow-hidden bg-card px-[22px] pb-6 pt-[26px]">
              <span aria-hidden="true" lang="zh-Hans" className="pointer-events-none absolute -right-1 top-3 font-zh text-[64px] font-black leading-none text-primary opacity-[0.1]">{m.zh}</span>
              <p className="flex items-center gap-2 font-mono text-xs uppercase text-muted-foreground"><X aria-hidden="true" className="size-4 text-primary" />Миф</p>
              <p className="mt-2 text-[17px] font-semibold leading-snug">{m.myth}</p>
              <hr className="my-5 border-t border-dashed border-border" />
              <p className="flex items-center gap-2 font-mono text-xs uppercase text-muted-foreground"><Check aria-hidden="true" className="size-4 text-primary" />Реальность</p>
              <p className="mt-2 text-[15px]">{m.fact}</p>
              <Link href={m.href} className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand hover:underline">{m.link}<ArrowRight aria-hidden="true" className="size-3.5" /></Link>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function HskPath() {
  return (
    <Section id="hsk">
      <Container>
        <SectionHead title={home.hskHead.title} accent={home.hskHead.accent} text={home.hskHead.text} />
        <div className="cards grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {home.hsk.map((h) => (
            <div key={h.level + h.time} className="flex min-h-[220px] flex-col bg-card px-[22px] pb-6 pt-[26px]">
              <span className="font-mono text-xs uppercase text-muted-foreground">汉语水平考试</span>
              <b className="mt-8 block text-[clamp(34px,3.6vw,46px)] font-bold leading-none text-primary">{h.level}</b>
              <span className="mt-3 inline-flex self-start rounded-full bg-accent px-3 py-1 font-mono text-xs font-medium text-accent-foreground">{h.time}</span>
              <p className="mt-3 text-[15px] text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {home.hskNote} <Link href="/wiki/language-courses/" className="text-brand hover:underline">Открыть статью →</Link>
        </p>
      </Container>
    </Section>
  );
}

// Блог «Китай изнутри» — последние статьи контент-завода. Нет статей — блока нет.
export function HomeBlog() {
  const posts = getPosts().slice(0, 2);
  if (!posts.length) return null;
  return (
    <Section id="blog">
      <Container>
        <SectionHead title={home.blogHead.title} accent={home.blogHead.accent} text={home.blogHead.text} />
        <div className="cards grid-cols-1 md:grid-cols-2">
          {posts.map((p) => <PostCard key={p.slug} p={p} />)}
        </div>
        <div className="mt-6 flex justify-center"><Button asChild variant="outline"><Link href="/blog/">Все статьи →</Link></Button></div>
      </Container>
    </Section>
  );
}
