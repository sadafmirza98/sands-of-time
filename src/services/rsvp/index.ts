import { wedding } from "@/config/wedding";
import type { RsvpPayload } from "@/services/rsvp/schema";

/**
 * RSVP transport. Inactive for this invitation: `wedding.rsvp.enabled` is
 * false, so nothing is collected and the endpoint is never called.
 *
 * To enable later: set `rsvp.enabled = true`, a real `maxPartySize`, and
 * NEXT_PUBLIC_RSVP_ENDPOINT to an endpoint that accepts JSON POSTs
 * (e.g. Formspree, a Google Apps Script web app, or your own function).
 * Never put secrets in NEXT_PUBLIC_* variables — they ship to the browser.
 */
export const rsvpEndpoint = process.env.NEXT_PUBLIC_RSVP_ENDPOINT?.trim() || null;

export const rsvpAvailable = wedding.rsvp.enabled && wedding.rsvp.maxPartySize !== null && rsvpEndpoint !== null;

export async function submitRsvp(payload: RsvpPayload): Promise<void> {
  if (!rsvpAvailable || !rsvpEndpoint) throw new Error("RSVP is not enabled for this invitation.");
  const res = await fetch(rsvpEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...payload, occasion: wedding.event.occasion, date: wedding.event.date }),
  });
  if (!res.ok) throw new Error(`RSVP submission failed (${res.status}).`);
}
