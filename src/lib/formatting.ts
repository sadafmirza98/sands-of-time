import { wedding } from "@/config/wedding";

const { groom, bride } = wedding.couple;

/** "Tahir & Nazneen" — groom first, always. */
export const coupleFirstNames = `${groom.firstName} & ${bride.firstName}`;
/** "Tahir Zaheer Mirza & Nazneen Rais Shaikh" */
export const coupleFullNames = `${groom.fullName} & ${bride.fullName}`;

export const pad2 = (n: number) => String(Math.max(0, Math.floor(n))).padStart(2, "0");

/** Join class names, skipping falsy values. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Single-line venue address for calendar LOCATION fields and map searches. */
export const venueOneLine = [wedding.venue.name, ...wedding.venue.addressLines]
  .join(" ")
  .replace(/\s+/g, " ")
  .replace(/\.$/, "")
  .concat(", India");

export function pluralise(n: number, unit: string): string {
  return `${n} ${unit.toLowerCase().replace(/s$/, "")}${n === 1 ? "" : "s"}`;
}
