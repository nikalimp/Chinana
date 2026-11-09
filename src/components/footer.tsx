import Link from "next/link";
import { nav, site } from "@/content/site";
import { programs } from "@/content/programs";
import { Container } from "./container";
import { Logo } from "./header";

export function Footer() {
  return (
    <footer className="bg-inverse pb-10 pt-14 text-sm text-inverse-muted">
      <Container className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo className="text-inverse-foreground" />
          <p className="mt-3.5 max-w-[22.6em]">{site.tagline}</p>
        </div>
        <ul className="grid gap-2 md:col-span-3 md:col-start-6">
          {programs.map((p) => (
            <li key={p.slug}><Link href={`/programs/${p.slug}/`} className="hover:text-inverse-foreground">{p.title}</Link></li>
          ))}
        </ul>
        <ul className="grid gap-2 md:col-span-4 md:col-start-9">
          {nav.filter((n) => n.href !== "/programs/").map((n) => (
            <li key={n.href}><Link href={n.href} className="hover:text-inverse-foreground">{n.label}</Link></li>
          ))}
          <li><a href={site.cta.href} className="hover:text-inverse-foreground">Менеджер в Telegram</a></li>
          <li><Link href="/contacts/" className="hover:text-inverse-foreground">Контакты</Link></li>
        </ul>
      </Container>
      <Container className="mt-11">
        <div className="flex flex-wrap justify-between gap-3 border-t border-inverse-foreground/10 pt-5">
          <span>{site.legalName} · ИНН {site.legal.inn}</span>
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
