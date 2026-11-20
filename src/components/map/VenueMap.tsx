"use client";

import "leaflet/dist/leaflet.css";
import { Hand, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { wedding } from "@/config/wedding";
import type { Coordinates } from "@/types/wedding";
import { useCoarsePointer } from "@/hooks/useReducedMotion";

/**
 * Leaflet + OpenStreetMap, loaded client-side only (next/dynamic, ssr:false)
 * and only after the palace doors open. Rendered ONLY when the venue has
 * independently verified coordinates — never with an invented position.
 *
 * Touch devices get a "tap to explore" gate so the map never hijacks page
 * scrolling; desktop scroll-wheel zoom is enabled only after a click.
 */
const PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 64" width="48" height="64">
  <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1C9"/><stop offset="0.5" stop-color="#E2BC73"/><stop offset="1" stop-color="#8a6526"/></linearGradient></defs>
  <path d="M24 63 C24 63 4 38 4 22 A20 20 0 0 1 44 22 C44 38 24 63 24 63 Z" fill="url(#pg)" stroke="#07152F" stroke-width="2"/>
  <path d="M14 30 V20 C14 14 19 10 24 8 C29 10 34 14 34 20 V30 Z" fill="#07152F"/>
  <path d="M19 30 V23 C19 20 21 18 24 17 C27 18 29 20 29 23 V30 Z" fill="#E2BC73"/>
</svg>`;

export default function VenueMap({ coordinates }: { coordinates: Coordinates }) {
  const host = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const coarse = useCoarsePointer();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import("leaflet").then(({ default: L }) => {
      if (cancelled || !host.current || mapRef.current) return;
      const map = L.map(host.current, {
        center: [coordinates.lat, coordinates.lng],
        zoom: 17,
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false,
        zoomControl: true,
        attributionControl: true,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      const icon = L.divIcon({ html: PIN_SVG, className: "", iconSize: [48, 64], iconAnchor: [24, 62], popupAnchor: [0, -58] });
      L.marker([coordinates.lat, coordinates.lng], { icon, title: wedding.venue.name, alt: wedding.venue.name })
        .addTo(map)
        .bindPopup(`<strong>${wedding.venue.name}</strong><br/>${wedding.venue.area}`);
      map.on("click", () => {
        if (!window.matchMedia("(pointer: coarse)").matches) {
          map.scrollWheelZoom.enable();
          map.dragging.enable();
        }
      });
      mapRef.current = map;
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [coordinates.lat, coordinates.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (unlocked || !coarse) {
      map.dragging.enable();
      map.touchZoom.enable();
    } else {
      map.dragging.disable();
      map.touchZoom.disable();
    }
  }, [unlocked, coarse]);

  return (
    <div className="royal-map relative size-full">
      <div ref={host} className="size-full" role="region" aria-label={`Map showing ${wedding.venue.name}`} />
      {coarse && !unlocked && (
        <button
          type="button"
          onClick={() => setUnlocked(true)}
          className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-2 bg-midnight/45 font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold-pale backdrop-blur-[1px]"
        >
          <Hand aria-hidden className="size-6" />
          {wedding.copy.map.tapToExplore}
        </button>
      )}
      {coarse && unlocked && (
        <button
          type="button"
          onClick={() => setUnlocked(false)}
          className="absolute right-3 top-3 z-[500] inline-flex items-center gap-2 rounded-full border border-gold/50 bg-midnight/85 px-3 py-2 font-display text-[0.65rem] uppercase tracking-[0.2em] text-gold-bright"
        >
          <Lock aria-hidden className="size-3.5" /> Done
        </button>
      )}
    </div>
  );
}
