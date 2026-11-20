import { wedding } from "@/config/wedding";
import { venueOneLine } from "@/lib/formatting";

const { coordinates } = wedding.venue;

/** True only when coordinates were independently verified and configured. */
export const hasVerifiedCoordinates = coordinates !== null;

/** The family's own Google Maps link when supplied; otherwise an address-based search. */
export const googleMapsSearchUrl =
  wedding.venue.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueOneLine)}`;

/** Turn-by-turn directions to the venue from the guest's current location. */
export const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  coordinates ? `${coordinates.lat},${coordinates.lng}` : venueOneLine,
)}`;
