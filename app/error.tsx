"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="stone flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <Image src="/images/hourglass-emblem.svg" alt="" width={120} height={160} priority />
      <h1 className="gold-foil mt-6 font-display text-3xl font-semibold tracking-[0.12em]">The sands have shifted</h1>
      <p className="mt-3 max-w-md text-lg italic text-parchment">Something interrupted the journey. Turn the hourglass and try again.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-8 min-h-12 border border-gold/60 px-6 font-display text-xs uppercase tracking-[0.3em] text-gold-bright hover:bg-gold/10"
      >
        Try again
      </button>
    </main>
  );
}
