import { cn } from "@/lib/utils";

// Контейнер совпадает с направляющими: max 1240 px, поля 16–40 px (03-design §3)
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("relative mx-auto w-full max-w-[1240px] px-[clamp(16px,4vw,40px)]", className)} {...props} />;
}

export function GridLines({ tone }: { tone?: "inverse" | "on-primary" }) {
  return (
    <div aria-hidden="true" className={cn("grid-lines", tone && `grid-lines--${tone}`)}>
      {Array.from({ length: 12 }, (_, i) => <span key={i} />)}
    </div>
  );
}

const tones = {
  default: "",
  inverse: "bg-inverse text-inverse-foreground",
  primary: "bg-primary text-primary-foreground",
} as const;

export function Section({ className, tone = "default", lines = true, children, ...props }: React.ComponentProps<"section"> & { tone?: keyof typeof tones; lines?: boolean }) {
  return (
    <section className={cn("relative overflow-hidden border-t border-grid-line py-[clamp(64px,9vw,120px)]", tones[tone], className)} {...props}>
      {lines && <GridLines tone={tone === "inverse" ? "inverse" : tone === "primary" ? "on-primary" : undefined} />}
      {children}
    </section>
  );
}

export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("font-mono text-xs uppercase tracking-[0.08em] text-brand", className)} {...props} />;
}

// Заголовок секции по центру: eyebrow, H2 с курсивным акцентом (капсом, как весь заголовок), подзаголовок
export function SectionHead({ eyebrow, title, accent, text, className, inverse, as = "h2" }: { eyebrow?: string; title: string; accent?: string; text?: string; className?: string; inverse?: boolean; as?: "h1" | "h2" }) {
  const H = as;
  return (
    <div className={cn("mx-auto mb-12 max-w-[900px] text-center", className)}>
      {eyebrow && <Eyebrow className={cn("mb-3.5", inverse && "text-accent")}>{eyebrow}</Eyebrow>}
      <H className={cn(as === "h1" ? "text-[clamp(38px,6.4vw,84px)]" : "text-[clamp(28px,4.2vw,48px)]")}>
        {title}{accent && <> <em>{accent}</em></>}
      </H>
      {text && <p className={cn("mx-auto mt-4 max-w-[37.2em]", inverse ? "text-inverse-muted" : "text-muted-foreground")}>{text}</p>}
    </div>
  );
}
