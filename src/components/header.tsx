import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
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
            <li key={n.href} className="border-b border-grid-line"><a href={n.href} className="block py-3.5 text-lg font-medium">{n.label}</a></li>
          ))}
        </ul>
        <Button asChild className="mt-5 w-full"><a href={site.cta.href}>{site.cta.label}</a></Button>
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
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-primary">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex"><a href={site.cta.href}>{site.cta.label}</a></Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
