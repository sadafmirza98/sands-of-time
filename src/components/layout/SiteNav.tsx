"use client";

import { Menu, X } from "lucide-react";
import { useRef, useSyncExternalStore } from "react";
import { wedding } from "@/config/wedding";
import { MonogramInsignia } from "@/components/artwork/Ornaments";
import { navItems } from "@/components/layout/navItems";
import { MusicToggle } from "@/components/sound/MusicPlayer";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { useActiveSection } from "@/hooks/useActiveSection";
import { replayOpening } from "@/hooks/useOpeningSequence";
import { cx } from "@/lib/formatting";

const ids = navItems.map((n) => n.id);

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}
const isScrolled = () => window.scrollY > 40;

export function SiteNav() {
  const active = useActiveSection(ids);
  const scrolled = useSyncExternalStore(subscribeScroll, isScrolled, () => false);
  const menu = useRef<HTMLDialogElement | null>(null);

  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    menu.current?.close();
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
    // Move focus for keyboard and screen-reader users without scrolling again.
    const heading = el.querySelector<HTMLElement>("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  };

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
        scrolled ? "bg-midnight/80 shadow-[0_1px_0_rgb(196_154_74/0.25),0_10px_30px_-12px_rgb(0_0_0/0.6)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={replayOpening}
          className="group flex items-center gap-2.5"
          aria-label={`${wedding.couple.monogram} — replay the royal invitation`}
          title="Replay the royal invitation"
        >
          <MonogramInsignia monogram={wedding.couple.monogram} className="size-11 transition duration-500 group-hover:rotate-[22.5deg] group-hover:drop-shadow-[0_0_10px_rgb(226_188_115/0.6)]" />
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={go(item.id)}
                aria-current={active === item.id ? "location" : undefined}
                className={cx(
                  "relative px-3 py-2 font-display text-[0.7rem] font-semibold uppercase tracking-[0.24em] transition-colors",
                  active === item.id ? "text-gold-pale" : "text-sand/85 hover:text-gold-bright",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cx(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-center bg-gradient-to-r from-transparent via-gold-bright to-transparent transition-transform duration-500",
                    active === item.id ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <MusicToggle />
          <SoundToggle />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-gold/40 bg-midnight/40 text-gold-bright backdrop-blur-sm lg:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={() => menu.current?.showModal()}
          >
            <Menu aria-hidden className="size-5" />
          </button>
        </div>
      </nav>

      <dialog
        ref={menu}
        aria-label="Site menu"
        className="m-0 ml-auto h-dvh max-h-none w-[min(22rem,88vw)] max-w-none bg-transparent p-0 text-parchment open:animate-[menu-in_0.45s_cubic-bezier(0.22,1,0.36,1)] backdrop:bg-midnight/70"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="stone relative flex h-full flex-col border-l border-gold/30 px-6 pb-8 pt-5">
          <div aria-hidden className="khatam-bg pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative flex items-center justify-between">
            <span className="font-display text-xs uppercase tracking-[0.4em] text-sand">{wedding.couple.groom.firstName} & {wedding.couple.bride.firstName}</span>
            <button type="button" aria-label="Close menu" className="inline-flex size-10 items-center justify-center rounded-full border border-gold/40 text-gold-bright" onClick={() => menu.current?.close()}>
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <ul className="relative mt-10 flex flex-col gap-1">
            {navItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  aria-current={active === item.id ? "location" : undefined}
                  className={cx(
                    "flex items-center gap-4 border-b border-gold/15 py-4 font-display text-sm uppercase tracking-[0.28em] transition-colors",
                    active === item.id ? "text-gold-pale" : "text-sand hover:text-gold-bright",
                  )}
                >
                  <span aria-hidden className="w-6 font-body text-base italic text-gold/70">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              menu.current?.close();
              replayOpening();
            }}
            className="relative mt-auto self-start font-display text-xs uppercase tracking-[0.3em] text-gold-bright underline decoration-gold/40 underline-offset-8"
          >
            {wedding.copy.closing.replay}
          </button>
        </div>
      </dialog>
    </header>
  );
}
