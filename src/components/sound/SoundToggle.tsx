"use client";

import { Volume2, VolumeX } from "lucide-react";
import { setSoundEnabled, useSoundEnabled } from "@/components/sound/soundStore";
import { cx } from "@/lib/formatting";

export function SoundToggle({ className }: { className?: string }) {
  const on = useSoundEnabled();
  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!on)}
      aria-pressed={on}
      aria-label={on ? "Sound effects on. Turn sound off" : "Sound effects off. Turn sound on"}
      title={on ? "Sound on" : "Sound off"}
      className={cx(
        "group relative inline-flex size-10 items-center justify-center rounded-full border border-gold/40 bg-midnight/40 text-gold-bright backdrop-blur-sm transition hover:border-gold-bright hover:bg-midnight/70",
        className,
      )}
    >
      {on ? <Volume2 aria-hidden className="size-[18px]" /> : <VolumeX aria-hidden className="size-[18px] opacity-80" />}
      {on && <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-gold/30 [animation-iteration-count:1]" />}
    </button>
  );
}
