import { wedding } from "@/config/wedding";
import { CornerOrnament } from "@/components/artwork/Ornaments";
import { starPoints } from "@/components/artwork/geometry";
import { eventLongDate } from "@/lib/dates";
import { cx } from "@/lib/formatting";

const city = wedding.venue.city.split(",")[0];

/** The ornate golden royal ticket that ends the journey. */
export function RoyalTicket({ className }: { className?: string }) {
  const { groom, bride } = wedding.couple;
  return (
    <div className={cx("relative w-[min(92vw,560px)]", className)}>
      {/* gold outer plate with notched (perforated) ends */}
      <div className="relative rounded-[18px] p-[3px] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.85),0_0_60px_-10px_rgb(226_188_115/0.45)] [background:linear-gradient(120deg,#7a5520,#e2bc73_25%,#fff1c9_40%,#c49a4a_55%,#f6db9a_75%,#8a6526)]">
        <div className="relative overflow-hidden rounded-[15px] bg-[linear-gradient(160deg,#0d2145,#07152f_60%,#0d2145)] px-6 py-7 text-center sm:px-12 sm:py-9">
          <div aria-hidden className="khatam-bg pointer-events-none absolute inset-0 opacity-50" />
          <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[10px] border border-gold/50" />
          <div aria-hidden className="pointer-events-none absolute inset-[18px] rounded-[8px] border border-gold/20" />
          <CornerOrnament corner="tl" color="#C49A4A" className="absolute left-2 top-2 size-12" />
          <CornerOrnament corner="tr" color="#C49A4A" className="absolute right-2 top-2 size-12" />
          <CornerOrnament corner="bl" color="#C49A4A" className="absolute bottom-2 left-2 size-12" />
          <CornerOrnament corner="br" color="#C49A4A" className="absolute bottom-2 right-2 size-12" />
          {/* perforation notches */}
          <span aria-hidden className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-midnight shadow-[inset_-2px_0_0_#c49a4a]" />
          <span aria-hidden className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-midnight shadow-[inset_2px_0_0_#c49a4a]" />

          <div className="relative">
            <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-sand">{wedding.copy.journey.ticketHeading}</p>
            <svg aria-hidden viewBox="0 0 200 20" className="mx-auto mt-3 h-4 w-40 text-gold">
              <path d="M0 10 H80 M120 10 H200" stroke="currentColor" strokeOpacity="0.6" />
              <polygon points={starPoints(100, 10, 9, 4)} fill="currentColor" />
            </svg>
            <p className="gold-foil shimmer mt-3 font-display text-[clamp(1.7rem,6.5vw,2.6rem)] font-semibold uppercase leading-tight tracking-[0.12em]">
              {groom.firstName} <span className="font-script normal-case tracking-normal">&</span> {bride.firstName}
            </p>
            <div className="mx-auto my-5 h-px w-3/4 bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
            <dl className="grid gap-1.5 font-display text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-gold-pale sm:text-sm">
              <div>
                <dt className="sr-only">Date</dt>
                <dd>{eventLongDate}</dd>
              </div>
              <div>
                <dt className="sr-only">Time</dt>
                <dd>{wedding.event.timeDisplay}</dd>
              </div>
              <div className="mt-3">
                <dt className="sr-only">Venue</dt>
                <dd className="text-parchment">{wedding.venue.name}</dd>
                <dd className="mt-1 text-[0.7rem] tracking-[0.3em] text-sand sm:text-xs">
                  {wedding.venue.area}, {city}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
