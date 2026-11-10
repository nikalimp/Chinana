import { site } from "@/content/site";
import { home } from "@/content/home";
import { Container, Section } from "./container";
import { Button } from "./ui/button";

export function CtaFinal({ text = home.final.text }: { text?: string }) {
  return (
    <Section tone="primary" id="final" className="border-t-0 text-center">
      <div aria-hidden="true" className="zh-bg -bottom-[18%] -right-[2%] text-[clamp(200px,28vw,380px)] text-primary-foreground opacity-[0.08]">{home.final.zh}</div>
      <Container>
        <h2 className="mx-auto max-w-[9.3em] text-[clamp(34px,6vw,76px)]">{home.final.title}</h2>
        <p className="mx-auto mt-5 max-w-[34.6em] text-primary-foreground/90">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="yellow"><a href={site.cta.href} data-lead>{home.final.cta}</a></Button>
        </div>
      </Container>
    </Section>
  );
}
export { CtaFinal as Cta };
