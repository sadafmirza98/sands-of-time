# The Royal Sands

A cinematic, single-page **Dawat e Walima** invitation for **Tahir Zaheer Mirza & Nazneen Rais Shaikh** — Saturday, 19 December 2026, 7 PM onwards (IST), The Grand FM Banquet, Jogeshwari West, Mumbai.

The guest opens a sealed royal envelope beneath a midnight palace, watches the parchment unfold and the invitation write itself in golden ink, then dissolves into a Persian kingdom: palace hero, a scroll-driven journey through the sands of time, the royal decree (event details), an hourglass countdown, a royal calendar, palace doors that reveal the location, and a farewell.

> An unofficial Prince of Persia inspired wedding experience. Not affiliated with or endorsed by Ubisoft. All artwork is original SVG/CSS — no game assets, screenshots, logos or characters are used.

---

## 1. Technology

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack, `cacheComponents`) |
| UI | React 19.3, TypeScript (strict) |
| Styling | Tailwind CSS 4 (`@tailwindcss/turbopack`), CSS custom properties |
| Motion | `motion/react` (Motion 14) + CSS keyframes |
| Map | Leaflet + OpenStreetMap tiles (lazy, client-only) |
| Forms (future RSVP) | React Hook Form + Zod |
| Icons | lucide-react |
| Fonts | `next/font/google` (self-hosted): Cinzel, Italianno, Cormorant Garamond, Noto Naskh Arabic |
| Sound | Web Audio API — synthesised, no audio files |

No backend, database, auth or analytics.

## 2. Getting started

Requires Node ≥ 20.9 (Node 22 recommended — Netlify is pinned to 22).

```bash
npm install
npm run dev          # http://localhost:3000
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (Next core-web-vitals + TS + React Compiler rules) |
| `npm run check` | typecheck → lint → build |
| `npm run artwork` | Regenerate procedural textures/cursor/emblem into `public/` |

**Development shortcuts**

- `/?open=1` — bypass the opening sequence.
- The opening plays once per browser-tab session (`sessionStorage` key `royal-sands:opened`). Clear it, open a new tab, or click the **TN monogram** in the nav to replay.

## 3. Architecture

```
app/
  layout.tsx            fonts, metadata, head script, providers, cursor, announcer
  page.tsx              section order; opening overlay outside the inert #app-shell
  globals.css           theme tokens, materials (parchment/stone/gold-foil), keyframes
  icon.svg              themed favicon
  opengraph-image.tsx   OG card generated in code (uses assets/fonts/*, OFL)
  robots.ts             noindex by default
  error.tsx, not-found.tsx
src/
  config/wedding.ts     ← THE single source of truth (all names, dates, venue, copy)
  types/wedding.ts      strict types for the config
  lib/
    timezone.ts         IANA wall-clock → UTC (no deps)
    dates.ts            event instant, formatters, month grid, weekday guard
    calendar.ts         Google Calendar URL + RFC 5545 ICS
    maps.ts             Google Maps search / directions, OSM links
    contacts.ts         tel: and WhatsApp links
    formatting.ts       names, venue line, helpers
    site.ts             canonical URL resolution
  hooks/
    useCountdown.ts     shared 1 s clock (useSyncExternalStore)
    useReducedMotion.ts media-query hooks (reduced motion, pointer type)
    useOpeningSequence.ts opening state store + pre-paint head script
    useActiveSection.ts nav highlighting (IntersectionObserver)
  services/rsvp/        transport + Zod schema (inactive while RSVP disabled)
  sections/             one file per section (Opening, Hero, Story, Verse, Journey,
                        EventDetails, Countdown, Calendar, Map, Rsvp, Closing)
  components/
    artwork/            original SVG: Palace, Column, Lantern, Hourglass, RoyalSeal,
                        DoorLeaf, Ornaments, Starfield, CrescentMoon, geometry helpers
    invitation/         Envelope, InvitationLetter, OpeningOverlay, particleDissolve, StoryBook
    magical/            SandField (canvas particles), sandTime (shared flow direction), SandCursor
    events/             RoyalTicket, CalendarActions, ContactActions, Families
    map/                PalaceGate, VenueMap (Leaflet)
    secrets/            WanderingHourglass, SandSwirl, SealSecret, HiddenPassage
    sound/              synth, soundStore, SoundToggle, MusicPlayer
    layout/             SiteNav, SiteFooter, navItems, Providers
    ui/                 RoyalButton, SectionHeading, Reveal, Announcer, InlineScript
public/
  textures/             parchment-noise, stone-noise, khatam-tile (generated)
  cursor/               sand-cursor.svg (static cursor for reduced motion)
  images/               hourglass-emblem.svg
scripts/generate-artwork.mjs
assets/fonts/           Cinzel + Italianno for the OG image (SIL OFL, licences included)
```

Story, Verse and RSVP sections render conditionally from config. Business logic (dates, calendar, maps, contacts) lives in `src/lib`; components only present.

## 4. Configuration reference (`src/config/wedding.ts`)

`null` always means **not supplied** — the UI hides the element or shows an honest fallback. Never replace a `null` with a guess.

| Field | Meaning |
| --- | --- |
| `theme.name / inspiration / mood / disclaimer` | Theme metadata (the disclaimer is kept in config but no longer displayed) |
| `couple.groom`, `couple.bride` | `fullName`, `firstName`, `parents { relation, mother, father }`. Groom always renders first |
| `couple.monogram` | `"TN"` — seal, insignia, nav button |
| `event.occasion` | `"Dawat e Walima"` |
| `event.date` | `"YYYY-MM-DD"` |
| `event.day` | Display weekday — the build **fails** if it doesn't match `date` |
| `event.startTime` | `"HH:mm"` venue-local (24 h) |
| `event.endTime` | `null` — no end is invented anywhere |
| `event.timeDisplay` | `"7 PM onwards"` |
| `event.timeZone / timeZoneLabel` | `"Asia/Kolkata"` / `"IST"` |
| `venue.name / area / addressLines / city` | Printed address, one entry per line |
| `venue.mapsUrl` | The family's Google Maps link — used for **View on Google Maps / Google Maps** |
| `venue.coordinates` | `{ lat, lng, source }` — drives the Leaflet pin and **Get Directions** (see §13) |
| `venue.landmark` | `null` (no landmark line drawn) |
| `contact.label / phone / whatsapp` | Used for Call and WhatsApp actions |
| `hashtag` | `null` — not shown |
| `opening.arabic / translation` | Bismillah + translation on the invitation |
| `verse` | Surah Ar-Rum 30:21 (Arabic + Sahih International), shown just before the farewell; `null` hides it |
| `calendarMarks` | Extra dates drawn with an outlined star on the calendar (17 Dec); add a `label` so screen readers can say what it is |
| `story` | `[]` — Story section and nav item hidden |
| `rsvp.enabled / maxPartySize / dietaryOptions / deadline` | RSVP disabled |
| `closing.eyebrow / message / blessing / signOff / signature` | Farewell copy (`blessing: null`) |
| `music` | `{ kind: "youtube", videoId, title, volume }` (or `{ kind: "audio", src, … }`, or `null` to remove) |
| `developerCredit` | `"Sadaf Mirza"` → footer reads *Developed by Sadaf Mirza* |
| `site.url / indexing / title / description` | SEO; `indexing: false` |
| `copy.*` | Every other visible string (section titles, buttons, captions, secrets) |

## 5. Updating names and details

Edit `src/config/wedding.ts` only. No component hardcodes wedding names, dates, venue, phone numbers or invitation copy. After editing, run `npm run check`.

## 6. Replacing artwork

- Architectural art is code: `src/components/artwork/Palace.tsx` (1600×1000 space, ground at y=860, gate centred at x=800 so it survives `xMidYMax slice` cropping on phones). Path helpers live in `geometry.ts`.
- Textures/cursor/emblem: edit `scripts/generate-artwork.mjs`, then `npm run artwork`.
- To use raster art instead, drop files into `public/images/` and render them with `next/image`.
- Palette and materials are CSS tokens in `app/globals.css` (`@theme`).

## 7. Adding story chapters

Add entries to `story` in the config:

```ts
story: [
  {
    numeral: "I",
    title: "…",
    date: "…",              // or null
    image: { src: "/images/story/1.jpg", alt: "…" }, // or null
    body: ["Paragraph one…", "Paragraph two…"],
    link: null,             // or { label, href }
  },
],
```

The section and nav item appear automatically, with page-turn animation, chapter tabs, arrows, swipe, ←/→ and Home/End keys.

## 8. Enabling RSVP later

**No RSVP data is collected by this site.** RSVP is disabled, the section renders nothing, the form code is never loaded and `NEXT_PUBLIC_RSVP_ENDPOINT` is never read at runtime.

To enable it:

1. Set `rsvp.enabled: true` and a real `rsvp.maxPartySize` (and optional `dietaryOptions`, `deadline`).
2. Set `NEXT_PUBLIC_RSVP_ENDPOINT` to an endpoint that accepts JSON `POST` (Formspree, an Apps Script web app, a serverless function…).
3. The section, nav item and lazily loaded form (`src/components/rsvp/RsvpForm.tsx`, React Hook Form + Zod, schema in `src/services/rsvp/schema.ts`) then appear.

## 9. Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical/OG base URL (no trailing slash). Fallbacks: Vercel `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL`, Netlify `URL` → `DEPLOY_PRIME_URL`, then `http://localhost:3000`. No custom domain is assumed |
| `NEXT_PUBLIC_RSVP_ENDPOINT` | Unused while RSVP is disabled |

Copy `.env.example` to `.env.local`. Never put secrets in `NEXT_PUBLIC_*` variables — they are shipped to the browser.

## 10. Deploying to Vercel

Import the repo → framework auto-detected → deploy. Optionally set `NEXT_PUBLIC_SITE_URL`. Build command `npm run build`, Node 22.

## 11. Deploying to Netlify

`netlify.toml` is included (`npm run build`, publish `.next`, `NODE_VERSION = "22"`); Netlify's Next.js runtime is applied automatically. Optionally set `NEXT_PUBLIC_SITE_URL`.

## 12. Timezone handling

The event is authored as wall-clock time in `Asia/Kolkata`. `src/lib/timezone.ts` converts it to an absolute UTC instant with `Intl.DateTimeFormat` (two-pass, DST-safe, no dependencies): **19 Dec 2026 19:00 IST = 13:30 UTC**.

- Countdown: `targetUtc − Date.now()`; the visitor's zone is irrelevant (verified with the browser forced to `America/Los_Angeles`).
- Display strings are built from the authored parts, never from the visitor's locale, so server and client render identically.
- Google Calendar: `dates=20261219T133000Z/20261219T133000Z&ctz=Asia/Kolkata`. Google requires an end, so start = end (zero duration) rather than an invented one.
- ICS: `DTSTART:20261219T133000Z` with **no** `DTEND`/`DURATION` — per RFC 5545 that's a zero-duration start marker ("7 PM onwards").
- Nothing time-dependent is prerendered (the clock's server snapshot is `null`), which also satisfies Cache Components.

## 13. Map coordinates

`venue.coordinates` = **19.1356062, 72.8476525**.

How they were checked (2026-11-20):

1. The family's Google Maps link (`venue.mapsUrl`) resolves to the Google place **"Dilshad Banquet Hall"** (Knowledge Graph id `/g/11f_c06981`) — matching the first address line, *Dilshad Banquet*.
2. OpenStreetMap node **10218172785**, *"Delhi Darbar"*, Swami Vivekanand (S.V.) Road, Jogeshwari West 400102 — the restaurant the address says the venue is **above** (same building, E.E. Heights, 1st floor). The coordinates are that node's.
3. Google blocks automated reading of the place pin, so the two were compared **visually, not numerically**. If the Google pin sits on a different building, replace the numbers with the pin's own (Google Maps → long-press / right-click the pin → copy the coordinates).

The Leaflet map (lazy, client-only, OSM tiles with a warm restrained filter, custom gold palace pin, tap-to-explore gate on touch devices) appears behind the palace doors. **Get Directions** routes to the coordinates; **Explore Location** opens the OSM pin. Setting `coordinates: null` brings back the address-only fallback card.

## Music

`wedding.music` starts **only from a guest's tap** — breaking the envelope's seal, or the music button (nav / opening controls) — never on load, with a 1.6 s fade in/out. The player is built (paused, hidden) in advance so the tap can start it instantly. YouTube tracks use the official IFrame Player API with the player mounted but invisible (audio only, by the family's choice — note that YouTube's developer policies ask for a visible player, so YouTube could restrict this). Nothing is downloaded or re-hosted. If a browser (some iPhones) refuses to start sound from a tap on the page, a small card appears with the player so the guest can tap ▶ once; it hides again as soon as the music plays. A local/hosted file works too: `{ kind: "audio", src: "/audio/track.mp3", title, volume }`.

## 14. Accessibility

- Semantic landmarks (`header/nav/main/footer/section/address/table`), single `h1`, ordered `h2/h3`, skip link.
- Opening overlay is an `aria-modal` dialog with Skip button, **Escape** to skip, focus trap, focus moved to **Enter** when it appears and to the hero heading afterwards; the rest of the page is `inert` while it plays. It never blocks access: `?open=1`, session skip, `<noscript>` fallback.
- Native `<dialog>` for the mobile menu and Hidden Passage (Escape, backdrop click, focus management).
- Visible gold focus rings (navy on parchment); text colours chosen for WCAG AA (bronze `#6e4f17` and deep turquoise `#17605f` on parchment; gold/sand on midnight).
- Countdown: `role="timer"` plus a polite live region updated at most once per minute; a single global announcer for secret discoveries and actions.
- `prefers-reduced-motion`: static opening (letter already open), no parallax, no particles loop (single still frame), static journey, static cursor image, instant transitions.
- Custom cursor only on fine pointers; the native text cursor is kept in editable fields.
- Sound is off by default and never needed to understand anything.

## 15. Performance

- Server-rendered static page (`○ /`); client islands only where needed.
- Leaflet + its CSS load only when the doors open *and* coordinates exist; RSVP form code is never loaded while disabled.
- One canvas per sand scene, DPR capped at 1.5, particle count scaled by area (fewer on mobile), loops paused off-screen and in hidden tabs.
- Parallax/journey driven by Motion values (no React re-renders per frame); GPU-friendly transforms; cursor trail capped at 36 particles.
- Self-hosted fonts via `next/font` (Arabic not preloaded); procedural SVG textures are tiny; deterministic seeded art (no hydration drift).

## 16. Hidden secrets (optional)

1. **The Sands of Time** — a tiny hourglass appears now and then at the edge of the screen; click it for a sand swirl.
2. **The Royal Seal** — click the TN seal on the opened invitation.
3. **The Hidden Passage** — a carved rosette at the base of the hero's left column.
4. **The Reversed Sands** — turn the countdown hourglass; every sand particle on the page briefly flows backwards.

## 17. Known limitations

- Venue coordinates come from the OSM building, compared visually (not numerically) with the Google place (see §13).
- The configured YouTube track is a third-party upload; it can be removed or region-blocked by YouTube at any time, may show ads, and its thumbnail is chosen by the uploader.
- Story, verse, hashtag, RSVP and developer credit not supplied → hidden / "To be announced" by design.
- The ICS/Google entry has no end time by design; some calendar apps display zero-duration events as a point in time.
- OSM's public tile server is meant for light use; for heavy traffic switch to a commercial tile provider in `VenueMap.tsx`.
- Tested in headless Chrome only (360 / 768 / 1440 px); not tested on physical iOS Safari / Android devices.
