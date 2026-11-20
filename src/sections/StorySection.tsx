import { wedding } from "@/config/wedding";
import { StoryBook } from "@/components/invitation/StoryBook";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Section 3 — The Ancient Chronicles. Hidden entirely until real chapters are
 * added to `wedding.story` — the couple's story is never invented.
 */
export function StorySection() {
  if (wedding.story.length === 0) return null;
  return (
    <section id="story" aria-labelledby="story-title" className="stone relative overflow-hidden px-4 py-24 sm:py-32">
      <div aria-hidden className="khatam-bg pointer-events-none absolute inset-0 opacity-25" />
      <SectionHeading id="story-title" eyebrow={wedding.copy.story.eyebrow} title={wedding.copy.story.title} />
      <StoryBook chapters={wedding.story} />
    </section>
  );
}
