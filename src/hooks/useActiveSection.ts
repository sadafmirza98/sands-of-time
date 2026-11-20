"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing the middle band of the
 * viewport. Uses one IntersectionObserver for all sections.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const elements = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        // Pick the earliest section (document order) that is in the band.
        const next = elements.find((el) => visible.has(el.id))?.id ?? null;
        setActive((prev) => (prev === next ? prev : next));
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.01] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
