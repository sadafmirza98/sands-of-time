import { wedding } from "@/config/wedding";

export interface NavItem {
  id: string;
  label: string;
}

const { nav } = wedding.copy;

/** Section anchors in page order. Story and RSVP appear only when configured. */
export const navItems: NavItem[] = [
  { id: "home", label: nav.home },
  ...(wedding.story.length > 0 ? [{ id: "story", label: nav.story }] : []),
  { id: "journey", label: nav.journey },
  { id: "details", label: nav.details },
  { id: "countdown", label: nav.countdown },
  { id: "calendar", label: nav.calendar },
  { id: "location", label: nav.location },
  ...(wedding.rsvp.enabled ? [{ id: "rsvp", label: nav.rsvp }] : []),
];
