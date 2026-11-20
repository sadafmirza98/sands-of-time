import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/formatting";

type Variant = "gold" | "ghost" | "parchment";

const base =
  "group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden px-6 py-3 font-display text-[0.74rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.8rem] sm:tracking-[0.22em] transition duration-300 select-none disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  gold:
    "text-ink bg-[linear-gradient(100deg,#a77b2c,#e2bc73_30%,#fff1c9_50%,#e2bc73_70%,#a77b2c)] bg-[length:200%_100%] bg-[position:100%_0] hover:bg-[position:0%_0] shadow-[0_0_0_1px_rgb(255_241_201/0.5)_inset,0_8px_30px_-8px_rgb(226_188_115/0.55)] [clip-path:polygon(12px_0,calc(100%-12px)_0,100%_50%,calc(100%-12px)_100%,12px_100%,0_50%)] px-8",
  ghost:
    "text-gold-bright border border-gold/55 bg-midnight/35 backdrop-blur-sm hover:border-gold-bright hover:bg-gold/10 hover:text-gold-pale",
  parchment:
    "text-navy border border-bronze/60 bg-ivory/60 hover:bg-ivory hover:border-navy",
};

function Inner({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <>
      {icon && <span aria-hidden className="inline-flex shrink-0 [&>svg]:size-4">{icon}</span>}
      <span className="relative">{children}</span>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />
    </>
  );
}

type ButtonProps = ComponentPropsWithRef<"button"> & { variant?: Variant; icon?: ReactNode };
type LinkProps = ComponentPropsWithoutRef<"a"> & { variant?: Variant; icon?: ReactNode; external?: boolean };

export function RoyalButton({ variant = "ghost", icon, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={cx(base, variants[variant], className)} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}

export function RoyalLink({ variant = "ghost", icon, className, children, external, ...rest }: LinkProps) {
  return (
    <a
      className={cx(base, variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      <Inner icon={icon}>{children}</Inner>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
