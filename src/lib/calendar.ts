import { wedding } from "@/config/wedding";
import { eventEndUtc, eventStartUtc } from "@/lib/dates";
import { coupleFullNames, venueOneLine } from "@/lib/formatting";
import { googleMapsSearchUrl } from "@/lib/maps";

/**
 * "Add to Google Calendar".
 *
 * Start: 19 Dec 2026 19:00 Asia/Kolkata (13:30 UTC), emitted as UTC so no
 * client timezone is ever consulted. End: not supplied, and never invented —
 * Google requires an end in the URL, so start === end (0 min).
 */

const { event } = wedding;

const title = `${event.occasion} — ${coupleFullNames}`;
const description = [
  `${event.occasion} of ${coupleFullNames}.`,
  `${event.timeDisplay} (${event.timeZoneLabel}).`,
  `${wedding.contact.label}: ${wedding.contact.phone}`,
  `Map: ${googleMapsSearchUrl}`,
].join("\n");

/** 20261219T133000Z */
const utcStamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl(): string {
  const start = utcStamp(eventStartUtc);
  const end = utcStamp(eventEndUtc ?? eventStartUtc);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: description,
    location: venueOneLine,
    ctz: event.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
