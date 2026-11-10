import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { cities, citiesChecked, cityAnswer, cityPath, cityUnis, deg, mln } from "@/content/cities";
import { uniPath } from "@/content/universities";
import { WikiShell } from "@/components/wiki";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { graph } from "@/lib/schema";

export const dynamicParams = false;
export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = cities.find((x) => x.slug === slug);
  if (!c) return {};
  const title = [`Учёба в городе ${c.nameRu}: климат, перелёты, вузы`, `${c.nameRu}: учёба, климат, перелёты из России`, `${c.nameRu} для студента: климат и вузы`].find((t) => t.length <= 65)!;
  const base = `${c.nameRu} для студента из России: климат по месяцам, население, метро, прямые рейсы из России и вузы города`;
  return { title: { absolute: title }, description: base.length > 150 ? base.slice(0, base.lastIndexOf(",")) + "." : base + " — со ссылками на источники.", alternates: { canonical: cityPath(c) } };
}

const Src = ({ url }: { url?: string }) => (url ? <a href={url} rel="noopener" target="_blank" className="ml-1 font-mono text-[11px] text-primary hover:underline">[источник]</a> : null);

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = cities.find((x) => x.slug === slug);
  if (!c) notFound();
  const unis = cityUnis(c);
  const others = cities.filter((x) => x.slug !== c.slug).slice(0, 12);
  const schema = { "@type": "City", name: c.nameRu, alternateName: c.nameZh, url: `${site.url}${cityPath(c)}`, containedInPlace: { "@type": "Country", name: "Китай" } };
  return (
    <WikiShell current={cityPath(c)}>
      <JsonLd data={graph(schema)} />
      <article className="max-w-[46em]">
        <p className="font-mono text-xs uppercase tracking-wide text-primary">Wiki · Города · <span lang="zh-Hans" className="font-zh font-black">{c.nameZh}</span></p>
        <h1 className="mt-4 text-[clamp(32px,4.6vw,60px)]">{c.nameRu}: <em>учёба и жизнь</em></h1>
        <p className="mt-6 text-[clamp(17px,1.5vw,19px)]">{cityAnswer(c)}</p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">Данные проверены {new Date(citiesChecked).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="cards mt-8 grid-cols-2 sm:grid-cols-4">
          {[["Население", mln(c.population.value)], ["Январь", deg(c.climate.janC)], ["Июль", deg(c.climate.julC)], ["Метро", c.metro.lines ? `${c.metro.lines} линий` : "—"]].map(([l, v]) => (
            <div key={l} className="bg-card p-[18px]"><span className="font-mono text-xs uppercase text-muted-foreground">{l}</span><b className="mt-1.5 block text-xl">{v}</b></div>
          ))}
        </div>

        <section id="climate" className="mt-12 scroll-mt-24">
          <h2 className="text-[clamp(24px,2.8vw,34px)]">Климат <em>и что брать с собой</em></h2>
          <p className="mt-4 text-[17px]">
            Средняя температура января — {deg(c.climate.janC)}, июля — {deg(c.climate.julC)}. {c.climate.note}
            <Src url={c.climate.url} />
          </p>
          <p className="mt-3 text-[17px]">Население — {mln(c.population.value)} человек.<Src url={c.population.url} /></p>
        </section>

        <section id="travel" className="mt-12 scroll-mt-24">
          <h2 className="text-[clamp(24px,2.8vw,34px)]">Как добраться <em>из России</em></h2>
          {c.flightsFromRussia.cities.length ? (
            <>
              <p className="mt-4 text-[17px]">Прямые рейсы — из городов: {c.flightsFromRussia.cities.join(", ")}.</p>
              <p className="mt-3 text-[15px] text-muted-foreground">Список — по справочнику аэропорта.<Src url={c.flightsFromRussia.url} /> Расписание меняется по сезонам: перед покупкой билета проверьте рейс на сайте авиакомпании.</p>
            </>
          ) : (
            <p className="mt-4 text-[17px]">Прямых пассажирских рейсов из России мы не нашли. Обычно летят с пересадкой в Пекине, Шанхае или Гуанчжоу, дальше — поездом или внутренним рейсом. <Src url={c.flightsFromRussia.url} /></p>
          )}
          {c.ground.note && <p className="mt-3 text-[17px]">По земле: {c.ground.note}<Src url={c.ground.url} /></p>}
          <p className="mt-3 text-[17px]">По городу удобнее всего ездить на метро{c.metro.lines ? `: в городе ${c.metro.lines} линий` : ""}.<Src url={c.metro.url} /></p>
        </section>

        {c.facts.length > 0 && (
          <section id="facts" className="mt-12 scroll-mt-24">
            <h2 className="text-[clamp(24px,2.8vw,34px)]">Что важно <em>знать студенту</em></h2>
            <ul className="mt-4 text-[17px]">
              {c.facts.map((f) => <li key={f.text} className="flex gap-3 border-b border-grid-line py-2"><span aria-hidden="true" className="font-mono text-primary">—</span><span>{f.text}<Src url={f.url} /></span></li>)}
            </ul>
          </section>
        )}

        <section id="unis" className="mt-12 scroll-mt-24">
          <h2 className="text-[clamp(24px,2.8vw,34px)]">Вузы <em>города</em></h2>
          {unis.length ? (
            <ul className="mt-4">
              {unis.map((u) => (
                <li key={u.slug} className="border-b border-grid-line">
                  <Link href={uniPath(u)} className="flex items-baseline gap-3 py-2.5 hover:text-primary">
                    <span lang="zh-Hans" className="w-[3.2em] shrink-0 font-zh text-sm font-black text-primary">{u.zhShort}</span>
                    <span className="flex-1 font-medium">{u.nameRu}</span><span className="font-mono text-xs text-muted-foreground">цены и гранты →</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="mt-4 text-[17px]">Вузов этого города в каталоге пока нет.</p>}
        </section>

        <aside className="mt-14 grid gap-4 border border-border bg-secondary p-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <p><b className="block text-lg">Выбираете город?</b><span className="text-muted-foreground">Подберём вуз под ваш бюджет, климат и цель.</span></p>
          <Button asChild><a href={site.cta.href}>Написать @chinana</a></Button>
        </aside>

        <section className="mt-14">
          <h2 className="text-[clamp(22px,2.4vw,28px)]">Другие города</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {others.map((o) => <Link key={o.slug} href={cityPath(o)} className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm hover:border-foreground">{o.nameRu}</Link>)}
          </div>
        </section>
      </article>
    </WikiShell>
  );
}
