import { Flourish } from "@/components/artwork/Ornaments";
import { Reveal } from "@/components/ui/Reveal";
import { cx } from "@/lib/formatting";

export function SectionHeading({
  id,
  eyebrow,
  title,
  tone = "dark",
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Reveal className={cx("flex flex-col items-center text-center", className)}>
      <p className={cx("font-display text-xs font-semibold uppercase tracking-[0.42em]", tone === "dark" ? "text-sand" : "text-bronze")}>{eyebrow}</p>
      <h2 id={id} className={cx("mt-4 font-display text-[clamp(2rem,6.4vw,3.6rem)] font-medium leading-[1.08] tracking-[0.06em]", tone === "dark" ? "gold-foil shimmer" : "text-navy")}>
        {title}
      </h2>
      <Flourish className={cx("mt-5 h-6 w-64 max-w-full", tone === "dark" ? "text-gold" : "text-bronze")} />
    </Reveal>
  );
}
