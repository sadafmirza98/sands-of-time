import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { CalendarSection } from "@/sections/CalendarSection";
import { ClosingSection } from "@/sections/ClosingSection";
import { CountdownSection } from "@/sections/CountdownSection";
import { EventDetailsSection } from "@/sections/EventDetailsSection";
import { HeroSection } from "@/sections/HeroSection";
import { JourneySection } from "@/sections/JourneySection";
import { MapSection } from "@/sections/MapSection";
import { OpeningSection } from "@/sections/OpeningSection";
import { RsvpSection } from "@/sections/RsvpSection";
import { StorySection } from "@/sections/StorySection";
import { VerseSection } from "@/sections/VerseSection";

export default function Home() {
  return (
    <>
      {/* 1 — The Royal Invitation (overlay; outside the inert shell) */}
      <OpeningSection />

      <div id="app-shell">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-gold-bright px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" tabIndex={-1} className="outline-none">
          <HeroSection />
          <StorySection />
          <JourneySection />
          <EventDetailsSection />
          <CountdownSection />
          <CalendarSection />
          <MapSection />
          <RsvpSection />
          <VerseSection />
          <ClosingSection />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
