"use client";

import dynamic from "next/dynamic";
import { wedding } from "@/config/wedding";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { rsvpAvailable } from "@/services/rsvp";

const RsvpForm = dynamic(() => import("@/components/rsvp/RsvpForm"), { ssr: false });

/**
 * Section 9 — RSVP. Disabled for this invitation: renders nothing, loads no
 * form code and collects no data. Becomes active only when `wedding.rsvp` is
 * enabled with a real party-size cap AND NEXT_PUBLIC_RSVP_ENDPOINT is set.
 */
export function RsvpSection() {
  if (!rsvpAvailable || wedding.rsvp.maxPartySize === null) return null;
  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="stone relative px-4 py-24 sm:py-32">
      <SectionHeading id="rsvp-title" eyebrow={wedding.copy.rsvp.eyebrow} title={wedding.copy.rsvp.title} />
      <div className="mt-12">
        <RsvpForm maxPartySize={wedding.rsvp.maxPartySize} />
      </div>
    </section>
  );
}
