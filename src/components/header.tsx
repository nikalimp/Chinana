import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
import { programs } from "@/content/programs";
import { ChevronDown } from "lucide-react";
import { Container } from "./container";
import { Button } from "./ui/button";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 text-[21px] font-bold tracking-tight ${className ?? ""}`}>
      <span aria-hidden="true" className="grid size-[34px] place-items-center rounded-[4px] bg-primary font-zh text-xl font-black text-primary-foreground">去</span>
      {site.name}
      <span className="sr-only"> — на главную</span>
    </Link>
  );
}

// Дропдаун «Программы»: открывается по наведению и по фокусу с клавиатуры, без JavaScript
function ProgramsMenu({ label }: { label: string }) {
  return (
    <div className="group/p relative">
      <Link href="/programs/" className="inline-flex items-center gap-1 py-5 hover:text-primary" aria-haspopup="true">
        {label}<ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-hover/p:rotate-180 group-focus-within/p:rotate-180" />
      </Link>
      <div className="invisible absolute left-1/2 top-full z-50 w-[300px] -translate-x-1/2 opacity-0 transition-opacity group-hover/p:visible group-hover/p:opacity-100 group-focus-within/p:visible group-focus-within/p:opacity-100">
        <ul className="border border-border bg-card shadow-[0_8px_24px_-12px_rgb(0_0_0/0.25)]">
          {programs.map((p) => (
            <li key={p.slug} className="border-b border-grid-line last:border-b-0">
              <Link href={`/programs/${p.slug}/`} className="flex items-baseline justify-between gap-3 px-4 py-3 hover:bg-secondary">
                <span><b className="block text-[15px] font-semibold">{p.title}</b><span className="text-[13px] text-muted-foreground">{p.facts[0]?.label}: {p.facts[0]?.value}</span></span>
                <span aria-hidden="true" lang="zh-Hans" className="font-zh text-lg font-black text-primary">{p.zh}</span>
              </Link>
            </li>
          ))}
          <li><Link href="/programs/" className="block bg-secondary px-4 py-2.5 font-mono text-xs uppercase hover:text-primary">Сравнить программы →</Link></li>
        </ul>
      </div>
    </div>
  );
}

// Мобильное меню на <details>: открывается без JavaScript
function MobileMenu() {
  return (
    <details className="group/m lg:hidden">
      <summary aria-label="Открыть меню" className="inline-flex size-11 cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden">
        <Menu className="size-6 group-open/m:hidden" />
        <X className="hidden size-6 group-open/m:block" />
      </summary>
      <div className="absolute inset-x-0 top-[68px] border-b border-border bg-background px-[clamp(16px,4vw,40px)] pb-6">
        <ul>
          {nav.map((n) => (
            <li key={n.href} className="border-b border-grid-line">
              <a href={n.href} className="block py-3.5 text-lg font-medium">{n.label}</a>
              {n.href === "/programs/" && (
                <ul className="-mt-1 pb-3 pl-4">
                  {programs.map((p) => <li key={p.slug}><a href={`/programs/${p.slug}/`} className="block py-1.5 text-muted-foreground">{p.title}</a></li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <Button asChild className="mt-5 w-full"><a href={site.cta.href} data-lead>{site.cta.label}</a></Button>
      </div>
    </details>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-grid-line bg-background/90 backdrop-blur">
      <Container className="flex h-[68px] items-center justify-between gap-5">
        <Logo />
        <nav aria-label="Основное меню" className="hidden items-center gap-7 text-[15px] lg:flex">
          {nav.map((n) =>
            n.href === "/programs/" ? <ProgramsMenu key={n.href} label={n.label} /> : <Link key={n.href} href={n.href} className="hover:text-primary">{n.label}</Link>,
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex"><a href={site.cta.href} data-lead>{site.cta.label}</a></Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
