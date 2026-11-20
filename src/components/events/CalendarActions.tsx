"use client";

import { CalendarPlus, Download } from "lucide-react";
import { wedding } from "@/config/wedding";
import { announce } from "@/components/ui/Announcer";
import { RoyalButton, RoyalLink } from "@/components/ui/RoyalButton";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import { cx } from "@/lib/formatting";

const gcal = googleCalendarUrl();

export function CalendarActions({ tone = "parchment", className }: { tone?: "parchment" | "dark"; className?: string }) {
  const { actions } = wedding.copy.details;
  const variant = tone === "parchment" ? "parchment" : "ghost";
  return (
    <div className={cx("flex flex-wrap justify-center gap-3", className)}>
      <RoyalLink href={gcal} external variant={variant} icon={<CalendarPlus />}>
        {actions.googleCalendar}
      </RoyalLink>
      <RoyalButton
        variant={variant}
        icon={<Download />}
        onClick={() => {
          downloadIcs();
          announce("Calendar invitation downloaded.");
        }}
      >
        {actions.ics}
      </RoyalButton>
    </div>
  );
}
