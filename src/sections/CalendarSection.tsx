"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { starPoints } from "@/components/artwork/geometry";
import { CornerOrnament } from "@/components/artwork/Ornaments";
import { RoyalSeal } from "@/components/artwork/RoyalSeal";
import { CalendarActions } from "@/components/events/CalendarActions";
import { playSound } from "@/components/sound/soundStore";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { eventDate, eventFullDate, eventMonthName, monthGrid, parseIsoDate, WEEKDAYS } from "@/lib/dates";
import { cx } from "@/lib/formatting";

const { calendar } = wedding.copy;
const weeks = monthGrid(eventDate.year, eventDate.month);
/** Configured extra dates in the event's month (outlined star). */
const marks = new Map(
  wedding.calendarMarks
    .map((m) => ({ ...parseIsoDate(m.date), label: m.label }))
    .filter((m) => m.year === eventDate.year && m.month === eventDate.month)
    .map((m) => [m.day, m.label] as const),
);

/** Section 7 — The Royal Calendar: December 2026 with the 19th sealed in gold. */
export function CalendarSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const [stamps, setStamps] = useState(0);
  const selected = inView || stamps > 0;

  return (
    <section id="calendar" aria-labelledby="calendar-title" className="stone relative overflow-hidden px-4 py-24 sm:py-32">
      <div aria-hidden className="khatam-bg pointer-events-none absolute inset-0 opacity-25" />
      <SectionHeading id="calendar-title" eyebrow={calendar.eyebrow} title={calendar.title} />

      <Reveal className="relative mx-auto mt-12 max-w-xl sm:mt-16">
        <div ref={ref} className="relative rounded-[22px] p-[2px] [background:linear-gradient(140deg,#8a6526,#f6db9a_35%,#c49a4a_60%,#7a5520)] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.9)]">
          <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(170deg,#0d2145,#07152f)] px-3 pb-8 pt-10 sm:px-8">
            <div aria-hidden className="khatam-bg pointer-events-none absolute inset-0 opacity-40" />
            <CornerOrnament corner="tl" color="#C49A4A" className="absolute left-2 top-2 size-14" />
            <CornerOrnament corner="tr" color="#C49A4A" className="absolute right-2 top-2 size-14" />
            <CornerOrnament corner="bl" color="#C49A4A" className="absolute bottom-2 left-2 size-14" />
            <CornerOrnament corner="br" color="#C49A4A" className="absolute bottom-2 right-2 size-14" />

            <table className="relative w-full table-fixed border-separate border-spacing-y-1.5 text-center">
              <caption className="mb-6">
                <span className="block font-display text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-sand">{eventDate.year}</span>
                <span className="gold-foil shimmer mt-1 block font-display text-[clamp(1.9rem,7vw,2.6rem)] font-semibold uppercase tracking-[0.2em]">{eventMonthName}</span>
              </caption>
              <thead>
                <tr>
                  {WEEKDAYS.map((d) => (
                    <th key={d} scope="col" abbr={d} className="pb-3 font-display text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold sm:text-xs">
                      {d.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((day, di) => {
                      if (day === null) return <td key={di} />;
                      const isEvent = day === eventDate.day;
                      const isWeekend = di === 0 || di === 6;
                      if (!isEvent && marks.has(day)) {
                        const label = marks.get(day);
                        return (
                          <td key={di} className="py-0.5">
                            <span className="relative mx-auto grid aspect-square w-[min(100%,3.2rem)] place-items-center font-display text-[0.95rem] font-semibold text-gold-pale sm:text-lg">
                              <svg aria-hidden viewBox="0 0 60 60" className="absolute inset-0 size-full overflow-visible">
                                <polygon points={starPoints(30, 30, 29, 13.5, 8)} fill="none" stroke="#E2BC73" strokeWidth="1.6" strokeLinejoin="round" />
                              </svg>
                              <span className="relative">{day}</span>
                              {label && <span className="sr-only">, {label}</span>}
                            </span>
                          </td>
                        );
                      }
                      if (!isEvent) {
                        return (
                          <td key={di} className={cx("py-2 font-display text-[0.95rem] sm:text-lg", isWeekend ? "text-sand/90" : "text-parchment/85")}>
                            {day}
                          </td>
                        );
                      }
                      return (
                        <td key={di} className="relative py-0.5">
                          <button
                            type="button"
                            aria-pressed={selected}
                            aria-label={`${eventFullDate} — ${wedding.event.occasion}, ${wedding.event.timeDisplay} ${wedding.event.timeZoneLabel}. ${calendar.selectHint}`}
                            onClick={() => {
                              setStamps((n) => n + 1);
                              playSound("seal");
                            }}
                            className="relative mx-auto grid aspect-square w-[min(100%,3.4rem)] place-items-center rounded-full font-display text-lg font-bold text-ink"
                          >
                            <span aria-hidden className={cx("absolute -inset-1 rounded-full transition duration-700", selected ? "bg-[radial-gradient(circle,#fff1c9,#e2bc73_45%,#a77b2c)] shadow-[0_0_24px_6px_rgb(226_188_115/0.55)]" : "bg-gold/30")} />
                            <svg aria-hidden viewBox="0 0 60 60" className={cx("absolute -inset-3 size-[calc(100%+1.5rem)] transition duration-1000", selected ? "spin-slow opacity-100" : "opacity-0")}>
                              <polygon points={starPoints(30, 30, 29, 23, 8)} fill="none" stroke="#E2BC73" strokeWidth="1" />
                            </svg>
                            <span className="relative">{day}</span>
                            <AnimatePresence>
                              {selected && (
                                <motion.span
                                  key={stamps}
                                  aria-hidden
                                  className="pointer-events-none absolute -right-3 -top-6 size-9 sm:-right-6 sm:-top-7 sm:size-11"
                                  initial={{ scale: 2.4, rotate: -35, opacity: 0 }}
                                  animate={{ scale: 1, rotate: -12, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 380, damping: 18, delay: stamps === 0 ? 0.5 : 0 }}
                                >
                                  <RoyalSeal monogram={wedding.couple.monogram} className="size-full drop-shadow-[0_3px_4px_rgb(0_0_0/0.5)]" />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="relative mt-6 border-t border-gold/25 pt-6 text-center">
              <p className="font-display text-[0.95rem] font-semibold uppercase tracking-[0.16em] text-gold-pale sm:text-lg">{eventFullDate}</p>
              <p className="mt-1 text-xl italic text-parchment">
                {wedding.event.timeDisplay}, {wedding.event.timeZoneLabel}
              </p>
              <CalendarActions tone="dark" className="mt-6" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
