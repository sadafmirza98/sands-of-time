/**
 * Strongly-typed shape of the single source of truth in `src/config/wedding.ts`.
 * Nullable fields are intentional: `null` means "not supplied" and the UI hides
 * or degrades gracefully rather than inventing a value.
 */

/** "YYYY-MM-DD" */
export type IsoDate = `${number}-${number}-${number}`;
/** "HH:mm" in 24h, venue-local wall-clock time */
export type WallTime = `${number}:${number}`;

export interface Parents {
  /** e.g. "Son of" / "Daughter of" */
  relation: string;
  mother: string;
  father: string;
}

export interface Person {
  fullName: string;
  firstName: string;
  parents: Parents;
}

export interface Couple {
  /** Always rendered first. */
  groom: Person;
  /** Always rendered second. */
  bride: Person;
  monogram: string;
}

export interface EventInfo {
  occasion: string;
  date: IsoDate;
  /** Display weekday, cross-checked against `date` at build time. */
  day: string;
  startTime: WallTime;
  /** `null` = not supplied. Never invent a duration. */
  endTime: WallTime | null;
  /** Human copy for the time, e.g. "7 PM onwards". */
  timeDisplay: string;
  /** IANA zone every calculation uses, irrespective of the visitor's zone. */
  timeZone: string;
  timeZoneLabel: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
  /** How the coordinates were verified (required to set coordinates). */
  source: string;
}

export interface Landmark {
  name: string;
  coordinates: Coordinates;
}

export interface Venue {
  name: string;
  area: string;
  /** Postal address, one entry per printed line. */
  addressLines: string[];
  city: string;
  /** The family's own Google Maps link for the venue, used for "View on Google Maps". */
  mapsUrl: string | null;
  /** `null` until independently verified. */
  coordinates: Coordinates | null;
  landmark: Landmark | null;
}

export interface Contact {
  label: string;
  /** E.164-ish display number, e.g. "+91 8433783337". */
  phone: string;
  whatsapp: boolean;
}

export interface OpeningLine {
  arabic: string;
  translation: string;
}

export interface Verse {
  /** Arabic text, exactly as in the Mushaf. */
  text: string;
  translation: string | null;
  /** e.g. "Sahih International"; `null` hides it. */
  translationSource: string | null;
  /** e.g. "Surah Ar-Rum 30:21" */
  reference: string;
}

/** Extra dates marked with an outlined star on the royal calendar. */
export interface CalendarMark {
  date: IsoDate;
  /** What the date is, for screen readers; `null` = purely decorative. */
  label: string | null;
}

export interface StoryChapter {
  /** e.g. "I", "II" */
  numeral: string;
  title: string;
  /** Free-form display date, e.g. "Spring 2023". `null` hides it. */
  date: string | null;
  /** Path under /public or an absolute URL; `null` shows an ornament instead. */
  image: { src: string; alt: string } | null;
  /** Paragraphs. */
  body: string[];
  link: { label: string; href: string } | null;
}

export interface RsvpConfig {
  enabled: boolean;
  /** Per-invitation party size cap; `null` = not supplied (form cannot be enabled without it). */
  maxPartySize: number | null;
  dietaryOptions: string[];
  /** "YYYY-MM-DD" or `null`. */
  deadline: IsoDate | null;
}

export interface Closing {
  eyebrow: string;
  message: string;
  blessing: string | null;
  signOff: string;
  signature: string;
}

export type MusicConfig =
  | { kind: "audio"; src: string; title: string; volume: number }
  | { kind: "youtube"; videoId: string; title: string; volume: number };

export interface SiteConfig {
  /** Absolute URL; `null` = derive from NEXT_PUBLIC_SITE_URL / platform env. */
  url: string | null;
  /** Search indexing. `false` = noindex, nofollow. */
  indexing: boolean;
  title: string;
  description: string;
}

export interface ThemeConfig {
  name: string;
  inspiration: string;
  mood: string[];
  disclaimer: string;
}

/** All visible copy lives here so components never hardcode wording. */
export interface CopyConfig {
  opening: {
    blessingLead: string;
    request: string;
    connector: string;
    and: string;
    enter: string;
    skip: string;
    openHint: string;
    openLabel: string;
    sealHint: string;
    sealSecret: string;
  };
  hero: {
    eyebrow: string;
    subtitle: string;
    location: string;
    cta: string;
    scrollCue: string;
  };
  story: { eyebrow: string; title: string };
  journey: {
    eyebrow: string;
    title: string;
    captions: string[];
    ticketHeading: string;
  };
  details: {
    eyebrow: string;
    title: string;
    blessing: string;
    and: string;
    labels: { date: string; time: string; venue: string; contact: string };
    actions: {
      maps: string;
      googleCalendar: string;
      call: string;
      whatsapp: string;
    };
  };
  countdown: {
    eyebrow: string;
    title: string;
    units: { days: string; hours: string; minutes: string; seconds: string };
    complete: string;
    completeSub: string;
    hourglassHint: string;
  };
  calendar: { eyebrow: string; title: string; selectHint: string };
  map: {
    eyebrow: string;
    title: string;
    reveal: string;
    gateHint: string;
    google: string;
    directions: string;
    tapToExplore: string;
    unverified: string;
  };
  rsvp: { eyebrow: string; title: string };
  closing: { back: string; replay: string };
  secrets: {
    hourglassLabel: string;
    hourglassMessage: string;
    passageLabel: string;
    passageTitle: string;
    passageText: string;
    reverseMessage: string;
  };
  nav: { home: string; story: string; journey: string; details: string; countdown: string; calendar: string; location: string; rsvp: string };
  footer: { creditPrefix: string };
}

export interface WeddingConfig {
  theme: ThemeConfig;
  couple: Couple;
  event: EventInfo;
  venue: Venue;
  contact: Contact;
  hashtag: string | null;
  opening: OpeningLine;
  verse: Verse | null;
  calendarMarks: CalendarMark[];
  story: StoryChapter[];
  rsvp: RsvpConfig;
  closing: Closing;
  music: MusicConfig | null;
  developerCredit: string;
  site: SiteConfig;
  copy: CopyConfig;
}
