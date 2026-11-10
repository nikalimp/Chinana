import type { Metadata } from "next";
import Link from "next/link";
import { cities, cityPath, cityUnis, deg, mln } from "@/content/cities";
import { WikiShell } from "@/components/wiki";
import { JsonLd } from "@/components/json-ld";
import { graph, itemList } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Города Китая для учёбы: климат, перелёты из России, вузы" },
  description: "13 городов Китая для студента из России: климат зимой и летом, население, метро, прямые рейсы из России и вузы каталога. Со ссылками на источники.",
  alternates: { canonical: "/wiki/cities/" },
};

export default function CitiesPage() {
  const sorted = [...cities].sort((a, b) => cityUnis(b).length - cityUnis(a).length);
  return (
    <WikiShell current="/wiki/cities/">
      <JsonLd data={graph(itemList(cities.map((c) => ({ name: c.nameRu, path: cityPath(c) }))))} />
      <p className="font-mono text-xs uppercase tracking-wide text-primary">Wiki · Города</p>
      <h1 className="mt-4 text-[clamp(32px,4.6vw,60px)]">Города Китая <em>для учёбы</em></h1>
      <p className="mt-6 max-w-[46em] text-[clamp(17px,1.5vw,19px)]">
        Город решает почти столько же, сколько вуз: от него зависят климат, расходы и дорога домой. Харбин — самый холодный: средняя температура января −17,3 °C, зато до него летают из девяти городов России. На юге, в Гуанчжоу и Сямэне, январь теплее +13 °C. Прямые рейсы из Москвы есть в Пекин, Шанхай, Ханчжоу, Ухань, Чэнду и Гуанчжоу. Ниже — 13 городов, где находятся вузы нашего каталога.
      </p>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[15px]">
          <thead><tr>{["Город", "Январь", "Июль", "Население", "Метро", "Рейсы из России", "Вузов"].map((h) => <th key={h} scope="col" className="border border-border bg-secondary px-3 py-2.5 text-left font-mono text-xs font-medium uppercase">{h}</th>)}</tr></thead>
          <tbody>
            {sorted.map((c) => (
              <tr key={c.slug} className="bg-card">
                <th scope="row" className="border border-border px-3 py-2.5 text-left font-medium"><Link href={cityPath(c)} className="hover:text-primary">{c.nameRu}</Link> <span lang="zh-Hans" className="font-zh text-xs font-black text-primary">{c.nameZh}</span></th>
                <td className="border border-border px-3 py-2.5 tabular-nums">{deg(c.climate.janC)}</td>
                <td className="border border-border px-3 py-2.5 tabular-nums">{deg(c.climate.julC)}</td>
                <td className="border border-border px-3 py-2.5 tabular-nums">{mln(c.population.value)}</td>
                <td className="border border-border px-3 py-2.5 tabular-nums">{c.metro.lines ?? "—"}</td>
                <td className="border border-border px-3 py-2.5">{c.flightsFromRussia.cities.length ? `${c.flightsFromRussia.cities.length} ${c.flightsFromRussia.cities.length === 1 ? "город" : c.flightsFromRussia.cities.length < 5 ? "города" : "городов"}` : "нет прямых"}</td>
                <td className="border border-border px-3 py-2.5 tabular-nums">{cityUnis(c).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Климат и население — по статьям Wikipedia о городах (нормы 1991⁠–⁠2020), рейсы — по справочникам аэропортов. Источники — на странице каждого города.</p>
    </WikiShell>
  );
}
