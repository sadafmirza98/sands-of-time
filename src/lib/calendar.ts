import { wedding } from "@/config/wedding";
import { eventEndUtc, eventStartUtc } from "@/lib/dates";
import { coupleFullNames, venueOneLine } from "@/lib/formatting";
import { googleMapsSearchUrl } from "@/lib/maps";

/**
 * Google Calendar + ICS export.
 *
 * Start: 19 Dec 2026 19:00 Asia/Kolkata (13:30 UTC), emitted as UTC so no
 * VTIMEZONE block is needed and no client timezone is ever consulted.
 *
 * End: not supplied. We never invent a duration:
 *  - ICS omits DTEND/DURATION — per RFC 5545 §3.6.1 the event then takes up
 *    no time, i.e. it is a start-time marker ("7 PM onwards").
 *  - Google Calendar requires an end in its URL, so start === end (0 min).
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

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

/** Fold lines longer than 75 octets (RFC 5545 §3.1). */
function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 70) {
    out.push(rest.slice(0, 70));
    rest = ` ${rest.slice(70)}`;
  }
  out.push(rest);
  return out.join("\r\n");
}

export function buildIcs(now: number = Date.now()): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Royal Sands//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${utcStamp(eventStartUtc)}-${wedding.couple.monogram.toLowerCase()}@royal-sands`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${utcStamp(eventStartUtc)}`,
    ...(eventEndUtc ? [`DTEND:${utcStamp(eventEndUtc)}`] : []),
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(venueOneLine)}`,
    `URL:${googleMapsSearchUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function downloadIcs(): void {
  const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${wedding.couple.groom.firstName}-${wedding.couple.bride.firstName}-${event.occasion}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .concat(".ics");
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
