import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { wedding } from "@/config/wedding";
import { eventFullDate } from "@/lib/dates";

export const alt = `${wedding.couple.groom.firstName} & ${wedding.couple.bride.firstName} — ${wedding.event.occasion}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const cinzel = await readFile(join(process.cwd(), "assets/fonts/Cinzel-SemiBold.woff"));
const italianno = await readFile(join(process.cwd(), "assets/fonts/Italianno-Regular.ttf"));

/** Open Graph card generated in code: midnight sky, gilded arch, the couple's names. */
export default async function Image() {
  const { groom, bride } = wedding.couple;
  const gold = "linear-gradient(100deg, #a77b2c, #f6db9a 35%, #fff1c9 50%, #e2bc73 65%, #a77b2c)";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(90% 80% at 50% 100%, #173b69 0%, #0d2145 45%, #07152f 85%)",
          fontFamily: "Cinzel",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 24, border: "2px solid rgba(196,154,74,0.7)", borderRadius: 8, display: "flex" }} />
        <div style={{ position: "absolute", inset: 36, border: "1px solid rgba(196,154,74,0.35)", borderRadius: 6, display: "flex" }} />
        <svg width="560" height="560" viewBox="0 0 400 400" style={{ position: "absolute", top: 50 }}>
          <path d="M40 400 V190 C40 120 140 60 200 20 C260 60 360 120 360 190 V400" fill="none" stroke="#C49A4A" strokeOpacity="0.6" strokeWidth="2" />
          <path d="M70 400 V200 C70 140 150 90 200 56 C250 90 330 140 330 200 V400" fill="none" stroke="#E2BC73" strokeOpacity="0.3" strokeWidth="1.5" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ fontSize: 22, letterSpacing: 10, color: "#D9BD91", textTransform: "uppercase" }}>{wedding.event.occasion}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
            <span style={{ fontSize: 104, letterSpacing: 8, backgroundImage: gold, backgroundClip: "text", color: "transparent" }}>{groom.firstName.toUpperCase()}</span>
            <span style={{ fontFamily: "Italianno", fontSize: 120, margin: "0 26px", color: "#E2BC73" }}>&</span>
            <span style={{ fontSize: 104, letterSpacing: 8, backgroundImage: gold, backgroundClip: "text", color: "transparent" }}>{bride.firstName.toUpperCase()}</span>
          </div>
          <div style={{ fontSize: 26, letterSpacing: 6, color: "#F3E8D2", marginTop: 20 }}>{eventFullDate.toUpperCase()}</div>
          <div style={{ fontSize: 20, letterSpacing: 6, color: "#D9BD91", marginTop: 12 }}>
            {`${wedding.venue.name} · ${wedding.venue.city}`.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cinzel", data: cinzel, style: "normal", weight: 600 },
        { name: "Italianno", data: italianno, style: "normal", weight: 400 },
      ],
    },
  );
}
