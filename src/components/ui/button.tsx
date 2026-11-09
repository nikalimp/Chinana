import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-[1.5px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground hover:border-brand hover:bg-brand",
        outline: "border-foreground bg-transparent hover:bg-foreground hover:text-background",
        yellow: "border-accent bg-accent text-accent-foreground hover:border-card-hover hover:bg-card-hover",
        inverse: "border-inverse-foreground bg-transparent text-inverse-foreground hover:bg-inverse-foreground hover:text-inverse",
        onPrimary: "border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-brand",
        link: "border-transparent text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-12 px-6 text-base",
        sm: "min-h-10 px-5 text-[15px]",
        lg: "min-h-12 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" data-variant={variant ?? "default"} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
