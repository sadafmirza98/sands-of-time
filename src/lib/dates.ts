import { wedding } from "@/config/wedding";
import type { IsoDate, WallTime } from "@/types/wedding";
import { zonedTimeToUtc } from "@/lib/timezone";

/**
 * Date display is computed from the authored wall-clock parts (not `Intl` in
 * the visitor's locale), so server and client render identical strings and
 * every guest sees venue-local times.
 */

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export interface CalendarDate {
  year: number;
  month: number; // 1-12
  day: number;
}

export function parseIsoDate(value: IsoDate | string): CalendarDate {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) throw new Error(`Invalid date "${value}" — expected YYYY-MM-DD.`);
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

export function parseWallTime(value: WallTime | string): { hour: number; minute: number } {
  const m = /^(\d{2}):(\d{2})$/.exec(value);
  if (!m) throw new Error(`Invalid time "${value}" — expected HH:mm.`);
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

/** 0 = Sunday. Pure calendar arithmetic; timezone-independent. */
export function weekdayIndex(d: CalendarDate): number {
  return new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay();
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** "19 December 2026" */
export function formatLongDate(d: CalendarDate): string {
  return `${d.day} ${MONTHS[d.month - 1]} ${d.year}`;
}

/** "Saturday, 19 December 2026" */
export function formatFullDate(d: CalendarDate): string {
  return `${WEEKDAYS[weekdayIndex(d)]}, ${formatLongDate(d)}`;
}

/** "19 · 12 · 2026" */
export function formatDottedDate(d: CalendarDate): string {
  return `${String(d.day).padStart(2, "0")} · ${String(d.month).padStart(2, "0")} · ${d.year}`;
}

/** Month grid (Sunday-first) with leading/trailing nulls, chunked into weeks. */
export function monthGrid(year: number, month: number): (number | null)[][] {
  const first = weekdayIndex({ year, month, day: 1 });
  const total = daysInMonth(year, month);
  const cells: (number | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// ── The event, resolved once ────────────────────────────────────────────────

const { event } = wedding;

export const eventDate = parseIsoDate(event.date);
export const eventStartWall = parseWallTime(event.startTime);
export const eventEndWall = event.endTime ? parseWallTime(event.endTime) : null;

/** Absolute instant (UTC ms) the celebration starts: 19 Dec 2026 19:00 Asia/Kolkata. */
export const eventStartUtc = zonedTimeToUtc({ ...eventDate, ...eventStartWall }, event.timeZone);
/** `null` when no end time was supplied — never invent one. */
export const eventEndUtc = eventEndWall ? zonedTimeToUtc({ ...eventDate, ...eventEndWall }, event.timeZone) : null;

export const eventWeekday = WEEKDAYS[weekdayIndex(eventDate)];
export const eventFullDate = formatFullDate(eventDate);
export const eventLongDate = formatLongDate(eventDate);
export const eventMonthName = MONTHS[eventDate.month - 1];

if (eventWeekday !== event.day) {
  throw new Error(`wedding.event.day is "${event.day}" but ${event.date} is a ${eventWeekday}. Fix src/config/wedding.ts.`);
}
