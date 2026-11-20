import { wedding } from "@/config/wedding";
import { archPath, starPoints } from "@/components/artwork/geometry";
import { Flourish } from "@/components/artwork/Ornaments";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Quranic verse, shown near the end of the journey. Hidden while
 * `wedding.verse` is null — no verse is ever invented.
 */
export function VerseSection() {
  const { verse } = wedding;
  if (!verse) return null;
  return (
    <section aria-labelledby="verse-ref" className="stone relative overflow-hidden px-4 py-20 sm:py-28">
      <div aria-hidden className="khatam-bg pointer-events-none absolute inset-0 opacity-25" />
      <Reveal className="relative mx-auto max-w-3xl">
        <figure className="relative px-5 pb-12 pt-20 text-center sm:px-14 sm:pb-16 sm:pt-28">
          {/* illuminated arch frame */}
          <svg aria-hidden viewBox="0 0 400 520" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">
            <path d={archPath(200, 520, 392, 150, 4)} fill="rgb(7 21 47 / 0.55)" stroke="#C49A4A" strokeOpacity="0.75" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            <path d={archPath(200, 520, 372, 158, 18, false)} fill="none" stroke="#C49A4A" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          <svg aria-hidden viewBox="0 0 40 40" className="absolute left-1/2 top-6 size-7 -translate-x-1/2 sm:top-8">
            <polygon points={starPoints(20, 20, 19, 8.5)} fill="#E2BC73" />
          </svg>

          <blockquote className="relative">
            <p lang="ar" dir="rtl" className="font-arabic text-[1.55rem] leading-[2.1] text-gold-pale sm:text-[2.2rem] sm:leading-[2.15]">
              {verse.text}
            </p>
            <Flourish className="mx-auto my-6 h-6 w-56 text-gold" />
            {verse.translation && <p className="mx-auto max-w-xl text-[1.2rem] italic leading-relaxed text-parchment sm:text-[1.35rem]">“{verse.translation}”</p>}
          </blockquote>
          <figcaption className="relative mt-6">
            <span id="verse-ref" className="block font-display text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              {verse.reference}
            </span>
            {verse.translationSource && <span className="mt-1 block text-sm italic text-sand/90">Translation: {verse.translationSource}</span>}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
