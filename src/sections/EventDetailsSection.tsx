import { MapPin } from "lucide-react";
import { wedding } from "@/config/wedding";
import { archPath } from "@/components/artwork/geometry";
import { CornerOrnament, Flourish, Rule } from "@/components/artwork/Ornaments";
import { RoyalSeal } from "@/components/artwork/RoyalSeal";
import { Lantern } from "@/components/artwork/Lantern";
import { CalendarActions } from "@/components/events/CalendarActions";
import { ContactActions } from "@/components/events/ContactActions";
import { PersonBlock } from "@/components/events/Families";
import { Reveal } from "@/components/ui/Reveal";
import { RoyalLink } from "@/components/ui/RoyalButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { eventFullDate } from "@/lib/dates";
import { telHref } from "@/lib/contacts";

const { details } = wedding.copy;

function Label({ children }: { children: string }) {
  return (
    <dt className="flex items-center justify-center gap-3 font-display text-[0.7rem] font-bold uppercase tracking-[0.42em] text-turquoise-deep">
      <span aria-hidden className="h-px w-8 bg-current opacity-50" />
      {children}
      <span aria-hidden className="h-px w-8 bg-current opacity-50" />
    </dt>
  );
}

/** Section 5 — The Royal Decree: the exact event information on illuminated parchment. */
export function EventDetailsSection() {
  const { groom, bride, monogram } = wedding.couple;
  return (
    <section id="details" aria-labelledby="details-title" className="stone relative overflow-hidden px-4 pb-24 pt-24 sm:pb-32 sm:pt-32">
      <div aria-hidden className="khatam-bg pointer-events-none absolute inset-0 opacity-30" />
      {/* palace niche framing the decree */}
      <svg aria-hidden viewBox="0 0 1000 1400" preserveAspectRatio="xMidYMin meet" className="pointer-events-none absolute left-1/2 top-40 hidden h-[calc(100%-8rem)] -translate-x-1/2 md:block">
        <path d={archPath(500, 1400, 940, 360, 0, false)} fill="none" stroke="#C49A4A" strokeOpacity="0.35" strokeWidth="2" />
        <path d={archPath(500, 1400, 900, 372, 30, false)} fill="none" stroke="#C49A4A" strokeOpacity="0.18" strokeWidth="1" />
      </svg>
      <Lantern className="absolute left-[6%] top-0 hidden h-60 lg:block" chain={110} />
      <Lantern className="absolute right-[6%] top-0 hidden h-52 lg:block" chain={80} delay={1.6} />

      <SectionHeading id="details-title" eyebrow={details.eyebrow} title={details.title} />

      <Reveal className="relative mx-auto mt-12 max-w-3xl sm:mt-16">
        <article className="parchment on-parchment relative rounded-[3px] px-5 py-14 text-center shadow-[0_50px_100px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(110_79_23/0.25)] sm:px-14 sm:py-20" aria-label={`${wedding.event.occasion} — the royal decree`}>
          {/* ornamental border */}
          <div aria-hidden className="pointer-events-none absolute inset-3 border-2 border-bronze/50 sm:inset-5" />
          <div aria-hidden className="pointer-events-none absolute inset-[18px] border border-bronze/25 sm:inset-[30px]" />
          <div aria-hidden className="pointer-events-none absolute inset-x-[64px] top-[18px] h-2.5 bg-[repeating-linear-gradient(90deg,#17605f_0_6px,transparent_6px_12px)] opacity-40 sm:inset-x-[100px] sm:top-[30px]" />
          <div aria-hidden className="pointer-events-none absolute inset-x-[64px] bottom-[18px] h-2.5 bg-[repeating-linear-gradient(90deg,#17605f_0_6px,transparent_6px_12px)] opacity-40 sm:inset-x-[100px] sm:bottom-[30px]" />
          {(["tl", "tr", "bl", "br"] as const).map((c) => (
            <CornerOrnament
              key={c}
              corner={c}
              className={`absolute size-16 sm:size-24 ${c === "tl" ? "left-1 top-1 sm:left-3 sm:top-3" : c === "tr" ? "right-1 top-1 sm:right-3 sm:top-3" : c === "bl" ? "bottom-1 left-1 sm:bottom-3 sm:left-3" : "bottom-1 right-1 sm:bottom-3 sm:right-3"}`}
            />
          ))}
          {/* royal seal hanging from the top edge */}
          <div aria-hidden className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <RoyalSeal monogram={monogram} className="size-20 drop-shadow-[0_8px_10px_rgb(30_20_5/0.55)] sm:size-24" />
          </div>

          <div className="relative">
            <h3 className="font-display text-[clamp(1.5rem,6vw,2.4rem)] font-semibold uppercase tracking-[0.22em] text-turquoise-deep">{wedding.event.occasion}</h3>
            <Flourish className="mx-auto mt-3 h-6 w-56 text-bronze" />
            <p className="mx-auto mt-4 max-w-md text-[1.15rem] italic leading-relaxed text-ink">{details.blessing}</p>

            <div className="mt-10 grid gap-8">
              <PersonBlock person={groom} />
              <p className="font-script text-6xl leading-none text-bronze">
                <span aria-hidden>&</span>
                <span className="sr-only">{details.and}</span>
              </p>
              <PersonBlock person={bride} />
            </div>

            <Rule className="my-12" />

            <dl className="grid gap-9 sm:grid-cols-2 sm:gap-x-10">
              <div>
                <Label>{details.labels.date}</Label>
                <dd className="mt-3 font-display text-lg font-semibold tracking-[0.06em] text-navy sm:text-xl">{eventFullDate}</dd>
              </div>
              <div>
                <Label>{details.labels.time}</Label>
                <dd className="mt-3 font-display text-lg font-semibold tracking-[0.06em] text-navy sm:text-xl">{wedding.event.timeDisplay}</dd>
              </div>
              <div className="sm:col-span-2">
                <Label>{details.labels.venue}</Label>
                <dd className="mt-3">
                  <p className="font-display text-xl font-bold uppercase tracking-[0.12em] text-navy sm:text-2xl">{wedding.venue.name}</p>
                  <address className="mt-2 text-lg not-italic leading-relaxed text-ink">
                    {wedding.venue.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <Label>{details.labels.contact}</Label>
                <dd className="mt-3 text-lg text-ink">
                  <span className="italic text-bronze">{wedding.contact.label}:</span>{" "}
                  <a href={telHref} className="font-display font-semibold tracking-[0.08em] text-navy underline decoration-bronze/40 underline-offset-4 hover:decoration-navy">
                    {wedding.contact.phone}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-12 flex flex-col items-center gap-3">
              <RoyalLink href="#location" variant="parchment" icon={<MapPin />}>
                {details.actions.maps}
              </RoyalLink>
              <CalendarActions />
              <ContactActions />
            </div>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
