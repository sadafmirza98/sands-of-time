"use client";

import { CalendarPlus } from "lucide-react";
import { wedding } from "@/config/wedding";
import { RoyalLink } from "@/components/ui/RoyalButton";
import { googleCalendarUrl } from "@/lib/calendar";
import { cx } from "@/lib/formatting";

const gcal = googleCalendarUrl();

export function CalendarActions({ tone = "parchment", className }: { tone?: "parchment" | "dark"; className?: string }) {
  return (
    <div className={cx("flex flex-wrap justify-center gap-3", className)}>
      <RoyalLink href={gcal} external variant={tone === "parchment" ? "parchment" : "ghost"} icon={<CalendarPlus />}>
        {wedding.copy.details.actions.googleCalendar}
      </RoyalLink>
    </div>
  );
}
