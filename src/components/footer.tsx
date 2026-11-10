import Link from "next/link";
import { nav, site } from "@/content/site";
import { programs } from "@/content/programs";
import { Container } from "./container";
import { Logo } from "./header";

// Подвал в одну колонку по центру (решение Ника 2026-11-10). «СЗ» — сокращение «самозанятый»; полное — в политике и разметке.
const shortLegal = site.legalName.replace(/^Самозанятый/, "СЗ");

export function Footer() {
  const links = [
    ...programs.map((p) => ({ href: `/programs/${p.slug}/`, label: p.title })),
    ...nav.filter((n) => n.href !== "/programs/"),
    { href: "/contacts/", label: "Контакты" },
  ];
  return (
    <footer className="bg-inverse pb-10 pt-14 text-center text-sm text-inverse-muted">
      <Container className="flex flex-col items-center">
        <Logo className="text-inverse-foreground" />
        <p className="mt-3.5 max-w-[30em]">{site.tagline}</p>
        <nav aria-label="Разделы сайта" className="mt-8">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-inverse-foreground">{l.label}</Link></li>)}
          </ul>
        </nav>
        <a href={site.cta.href} className="mt-6 inline-flex rounded-full border border-inverse-foreground/30 px-5 py-2 text-inverse-foreground hover:border-inverse-foreground">Менеджер в Telegram @chinana</a>
        <div className="mt-10 flex w-full flex-col items-center gap-2 border-t border-inverse-foreground/10 pt-5">
          <span>{shortLegal} · ИНН {site.legal.inn}</span>
          <span>
            <Link href="/privacy-policy/" className="underline hover:text-inverse-foreground">Политика конфиденциальности</Link>
            {" · "}
            <Link href="/consent/" className="underline hover:text-inverse-foreground">Согласие на обработку данных</Link>
          </span>
        </div>
      </Container>
    </footer>
  );
}
