import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
import { programs } from "@/content/programs";
import { universities, uniPath } from "@/content/universities";
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

type MenuItem = { href: string; title: string; sub?: string; zh: string };
const menus: Record<string, { items: MenuItem[]; all: string; wide?: boolean }> = {
  "/programs/": {
    items: programs.map((p) => ({ href: `/programs/${p.slug}/`, title: p.title, sub: `${p.facts[0]?.label}: ${p.facts[0]?.value}`, zh: p.zh })),
    all: "Сравнить программы →",
  },
  "/universities/": {
    items: universities.map((u) => ({ href: uniPath(u), title: u.nameRu, sub: u.city, zh: u.zhShort })),
    all: `Весь каталог: ${universities.length} вузов →`,
    wide: true,
  },
};

// Дропдауны «Программы» и «Вузы»: открываются по наведению и по фокусу с клавиатуры, без JavaScript
function NavMenu({ href, label }: { href: string; label: string }) {
  const m = menus[href];
  return (
    <div className="group/p relative">
      <Link href={href} className="inline-flex items-center gap-1 py-5 hover:text-primary" aria-haspopup="true">
        {label}<ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-hover/p:rotate-180 group-focus-within/p:rotate-180" />
      </Link>
      <div className={`invisible absolute left-1/2 top-full z-50 -translate-x-1/2 opacity-0 transition-opacity group-hover/p:visible group-hover/p:opacity-100 group-focus-within/p:visible group-focus-within/p:opacity-100 ${m.wide ? "w-[880px]" : "w-[300px]"}`}>
        <div className="border border-border bg-card shadow-[0_8px_24px_-12px_rgb(0_0_0/0.25)]">
          <ul className={m.wide ? "grid max-h-[calc(100vh-140px)] grid-cols-2 overflow-y-auto" : ""}>
            {m.items.map((i) => (
              <li key={i.href} className={`border-b border-grid-line ${m.wide ? "odd:border-r" : "last:border-b-0"}`}>
                <Link href={i.href} title={m.wide ? i.title : undefined} className={`flex items-baseline gap-3 px-4 hover:bg-secondary ${m.wide ? "py-2" : "justify-between py-3"}`}>
                  {m.wide && <span aria-hidden="true" lang="zh-Hans" className="w-[3.2em] shrink-0 whitespace-nowrap font-zh text-sm font-black text-primary">{i.zh}</span>}
                  {m.wide ? (
                    <><span className="min-w-0 flex-1 truncate text-sm font-semibold">{i.title}</span><span className="shrink-0 font-mono text-[11px] text-muted-foreground">{i.sub}</span></>
                  ) : (
                    <span className="min-w-0"><b className="block text-[15px] font-semibold">{i.title}</b><span className="text-[13px] text-muted-foreground">{i.sub}</span></span>
                  )}
                  {!m.wide && <span aria-hidden="true" lang="zh-Hans" className="font-zh text-lg font-black text-primary">{i.zh}</span>}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={href} className="block bg-secondary px-4 py-2.5 font-mono text-xs uppercase hover:text-primary">{m.all}</Link>
        </div>
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
                  {menus[n.href].items.map((i) => <li key={i.href}><a href={i.href} className="block py-1.5 text-muted-foreground">{i.title}</a></li>)}
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
            menus[n.href] ? <NavMenu key={n.href} href={n.href} label={n.label} /> : <Link key={n.href} href={n.href} className="hover:text-primary">{n.label}</Link>,
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
