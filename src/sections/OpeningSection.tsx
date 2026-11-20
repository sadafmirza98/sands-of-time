"use client";

import { useEffect } from "react";
import { Starfield } from "@/components/artwork/Starfield";
import { OpeningOverlay } from "@/components/invitation/OpeningOverlay";
import { useOpeningSequence } from "@/hooks/useOpeningSequence";

/**
 * Section 1 — The Royal Invitation (opening overlay).
 *
 * Server render / pre-hydration: a midnight cover (`data-opening-cover`) that the
 * inline head script hides for returning guests and `?open=1`, and <noscript>
 * hides when JavaScript is off — the invitation is never locked behind it.
 */
export function OpeningSection() {
  const { status } = useOpeningSequence();

  useEffect(() => {
    if (status !== "playing") return;
    const shell = document.getElementById("app-shell");
    shell?.setAttribute("inert", "");
    document.documentElement.setAttribute("data-opening-active", "");
    return () => {
      shell?.removeAttribute("inert");
      document.documentElement.removeAttribute("data-opening-active");
    };
  }, [status]);

  if (status === "done") return null;
  if (status === "pending") {
    return (
      <div data-opening-cover aria-hidden className="fixed inset-0 z-[100] bg-midnight">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,#173b69_0%,#0d2145_38%,#07152f_75%)]" />
        <Starfield count={110} seed={3} className="opacity-80" />
      </div>
    );
  }
  return <OpeningOverlay />;
}
