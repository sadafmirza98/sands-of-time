/**
 * Zero-dependency IANA timezone helpers.
 *
 * The wedding is authored as wall-clock time in the venue's zone
 * (Asia/Kolkata). These helpers turn that into an absolute instant so the
 * countdown and calendar entries are correct for a guest in any zone.
 */

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatters.set(timeZone, f);
  }
  return f;
}

export interface ZonedParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
}

/** Wall-clock parts of an instant as seen in `timeZone`. */
export function zonedParts(instant: number, timeZone: string): ZonedParts {
  const parts = formatterFor(timeZone).formatToParts(new Date(instant));
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour") % 24,
    minute: get("minute"),
    second: get("second"),
  };
}

/** Offset in ms between `timeZone` wall-clock and UTC at `instant`. */
export function timeZoneOffset(instant: number, timeZone: string): number {
  const p = zonedParts(instant, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(instant / 1000) * 1000;
}

/**
 * Convert a wall-clock time in `timeZone` to a UTC epoch (ms).
 * Two passes make it correct across DST transitions for zones that have them.
 */
export function zonedTimeToUtc(
  wall: { year: number; month: number; day: number; hour?: number; minute?: number },
  timeZone: string,
): number {
  const naive = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour ?? 0, wall.minute ?? 0);
  const first = naive - timeZoneOffset(naive, timeZone);
  return naive - timeZoneOffset(first, timeZone);
}
