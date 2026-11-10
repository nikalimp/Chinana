import type { Metadata } from "next";
import Link from "next/link";
import { wikiArticles, wikiSections } from "@/content/wiki";
import { WikiShell } from "@/components/wiki";
import { JsonLd } from "@/components/json-ld";
import { graph, itemList } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Wiki об учёбе в Китае: гранты, экзамены, виза, жизнь" },
  description: "Всё об учёбе в Китае в одном месте: грант CSC, экзамены CSCA и HSK, стоимость, виза и документы, жизнь, учёба и города. Каждый факт со ссылкой на источник.",
  alternates: { canonical: "/wiki/" },
};

export default function WikiHub() {
  const total = wikiArticles.length + wikiSections.reduce((n, s) => n + (s.extra?.length ?? 0), 0);
  return (
    <WikiShell current="/wiki/">
      <JsonLd data={graph(itemList(wikiArticles.map((a) => ({ name: a.crumb, path: a.path }))))} />
      <p className="font-mono text-xs uppercase tracking-wide text-primary">Wiki</p>
      <h1 className="mt-4 text-[clamp(36px,5.4vw,72px)]">Учёба в Китае: <em>всё в одном месте</em></h1>
      <p className="mt-6 max-w-[46em] text-[clamp(17px,1.5vw,19px)]">
        Справочник для тех, кто едет учиться в Китай из России. Здесь собрано всё по шагам: как поступить и получить грант, какие экзамены сдать, сколько это стоит, как оформить визу и документы, как устроены учёба и жизнь и какой город выбрать. У каждого факта есть ссылка на источник и дата проверки. Статей в справочнике: {total}.
      </p>
      <div className="cards mt-10 grid-cols-1 sm:grid-cols-2">
        {wikiSections.map((s) => (
          <section key={s.id} id={s.id} className="bg-card p-[22px]">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[22px] font-bold uppercase">{s.title}</h2>
              <span aria-hidden="true" lang="zh-Hans" className="font-zh text-2xl font-black text-primary">{s.zh}</span>
            </div>
            <p className="mt-1 text-[15px] text-muted-foreground">{s.text}</p>
            <ul className="mt-4">
              {[...s.articles.map((a) => ({ href: a.path, title: a.crumb, text: a.metaDescription })), ...(s.extra ?? [])].map((l) => (
                <li key={l.href} className="border-t border-grid-line">
                  <Link href={l.href} className="group block py-2.5">
                    <b className="font-semibold group-hover:text-primary">{l.title} →</b>
                    <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">{l.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </WikiShell>
  );
}
