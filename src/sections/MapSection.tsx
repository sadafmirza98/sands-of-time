"use client";

import dynamic from "next/dynamic";
import { Compass, MapPin, Navigation, Phone } from "lucide-react";
import { useState } from "react";
import { wedding } from "@/config/wedding";
import { archPath, starPoints } from "@/components/artwork/geometry";
import { CornerOrnament } from "@/components/artwork/Ornaments";
import { PalaceGate } from "@/components/map/PalaceGate";
import { playSound } from "@/components/sound/soundStore";
import { announce } from "@/components/ui/Announcer";
import { Reveal } from "@/components/ui/Reveal";
import { RoyalLink } from "@/components/ui/RoyalButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { telHref } from "@/lib/contacts";
import { eventFullDate } from "@/lib/dates";
import { googleDirectionsUrl, googleMapsSearchUrl, hasVerifiedCoordinates, openStreetMapUrl } from "@/lib/maps";

const VenueMap = dynamic(() => import("@/components/map/VenueMap"), {
  ssr: false,
  loading: () => <div className="grid size-full place-items-center font-display text-xs uppercase tracking-[0.3em] text-sand">Unrolling the map…</div>,
});

const { map } = wedding.copy;
const { venue } = wedding;

/** Shown in place of a map while coordinates are unverified: no invented pin. */
function CartographersNote() {
  return (
    <div className="parchment on-parchment relative flex size-full flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
      <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 m-auto size-[90%] opacity-[0.14]">
        <circle cx="200" cy="200" r="180" fill="none" stroke="#6e4f17" strokeWidth="2" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="#6e4f17" strokeDasharray="3 7" />
        <polygon points={starPoints(200, 200, 170, 24, 4)} fill="#6e4f17" />
        <polygon points={starPoints(200, 200, 110, 18, 4, -Math.PI / 4)} fill="#17605f" />
      </svg>
      <CornerOrnament corner="tl" className="absolute left-2 top-2 size-14" />
      <CornerOrnament corner="br" className="absolute bottom-2 right-2 size-14" />
      <MapPin aria-hidden className="relative size-9 text-bronze" />
      <p className="relative mt-3 font-display text-lg font-bold uppercase tracking-[0.14em] text-navy">{venue.name}</p>
      <address className="relative mt-2 max-w-sm text-[1.05rem] not-italic leading-relaxed text-ink">
        {venue.addressLines.join(" ")}
      </address>
      <p className="relative mt-5 max-w-sm text-[0.98rem] italic leading-relaxed text-bronze">{map.unverified}</p>
    </div>
  );
}

/** Section 8 — The Palace: discovering the location of the celebration. */
export function MapSection() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <section id="location" aria-labelledby="location-title" className="relative overflow-hidden bg-midnight px-4 py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,#0d2145,#07152f_70%)]" />
      <div className="relative">
        <SectionHeading id="location-title" eyebrow={map.eyebrow} title={map.title} />
        <p className="mx-auto mt-6 max-w-lg text-center text-xl italic text-sand">{map.gateHint}</p>

        <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-stretch">
          <Reveal>
            <div className="relative mx-auto aspect-[3/4] w-full max-w-xl overflow-hidden rounded-t-[50%_24%] border border-gold/45 bg-navy shadow-[0_40px_90px_-30px_rgb(0_0_0/0.9)] sm:aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[560px]">
              <div id="venue-map-panel" className="absolute inset-0 isolate" inert={!open} aria-hidden={!open}>
                {open && (hasVerifiedCoordinates && venue.coordinates ? <VenueMap coordinates={venue.coordinates} /> : <CartographersNote />)}
              </div>
              <PalaceGate
                open={open}
                reduced={reduced}
                onOpen={() => {
                  setOpen(true);
                  playSound("door");
                  announce(`The palace doors open. ${venue.name}, ${venue.area}.`);
                }}
              />
              <svg aria-hidden viewBox="0 0 400 600" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-20 size-full">
                <path d={archPath(200, 600, 396, 190, 2, false)} fill="none" stroke="#E2BC73" strokeOpacity="0.6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <aside aria-label="Venue information" className="relative h-full rounded-[18px] p-[2px] [background:linear-gradient(150deg,#8a6526,#f6db9a_40%,#c49a4a_65%,#7a5520)]">
              <div className="stone relative flex h-full flex-col rounded-[16px] px-6 py-9 sm:px-9">
                <div aria-hidden className="khatam-bg pointer-events-none absolute inset-0 rounded-[16px] opacity-30" />
                <div className="relative">
                  <p className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-gold">{wedding.copy.details.labels.venue}</p>
                  <h3 className="gold-foil mt-3 font-display text-[clamp(1.6rem,5vw,2.2rem)] font-semibold uppercase leading-tight tracking-[0.08em]">{venue.name}</h3>
                  <p className="mt-1 font-display text-sm uppercase tracking-[0.3em] text-sand">{venue.area} · {venue.city}</p>
                  <address className="mt-5 text-lg not-italic leading-relaxed text-parchment">
                    {venue.addressLines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </address>
                  <div className="my-6 h-px bg-gradient-to-r from-gold/60 via-gold/20 to-transparent" />
                  <p className="text-lg text-parchment">
                    <span className="font-display text-xs uppercase tracking-[0.3em] text-gold">{wedding.copy.details.labels.date}</span>
                    <span className="mt-1 block">{eventFullDate}</span>
                  </p>
                  <p className="mt-4 text-lg text-parchment">
                    <span className="font-display text-xs uppercase tracking-[0.3em] text-gold">{wedding.copy.details.labels.time}</span>
                    <span className="mt-1 block">
                      {wedding.event.timeDisplay} ({wedding.event.timeZoneLabel})
                    </span>
                  </p>
                  <p className="mt-4 text-lg text-parchment">
                    <span className="font-display text-xs uppercase tracking-[0.3em] text-gold">{wedding.contact.label}</span>
                    <a href={telHref} className="mt-1 flex items-center gap-2 text-gold-pale underline decoration-gold/40 underline-offset-4 hover:decoration-gold-bright">
                      <Phone aria-hidden className="size-4" />
                      {wedding.contact.phone}
                    </a>
                  </p>
                </div>
                <div className="relative mt-8 grid gap-3 lg:mt-auto lg:pt-8">
                  <RoyalLink href={googleMapsSearchUrl} external icon={<MapPin />}>
                    {map.google}
                  </RoyalLink>
                  <RoyalLink href={googleDirectionsUrl} external icon={<Navigation />}>
                    {map.directions}
                  </RoyalLink>
                  <RoyalLink href={openStreetMapUrl} external icon={<Compass />}>
                    {map.explore}
                  </RoyalLink>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
