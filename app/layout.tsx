import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Italianno, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { wedding } from "@/config/wedding";
import { Providers } from "@/components/layout/Providers";
import { SandCursor } from "@/components/magical/SandCursor";
import { MusicHost } from "@/components/sound/MusicPlayer";
import { WanderingHourglass } from "@/components/secrets/WanderingHourglass";
import { Announcer } from "@/components/ui/Announcer";
import { InlineScript } from "@/components/ui/InlineScript";
import { OPENING_HEAD_SCRIPT } from "@/hooks/useOpeningSequence";
import { coupleFirstNames } from "@/lib/formatting";
import { siteUrl } from "@/lib/site";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });
const italianno = Italianno({ subsets: ["latin"], weight: "400", variable: "--font-italianno", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--font-naskh", display: "swap", preload: false });

const index = wedding.site.indexing;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: wedding.site.title,
  description: wedding.site.description,
  applicationName: wedding.theme.name,
  alternates: { canonical: "/" },
  robots: {
    index,
    follow: index,
    nocache: !index,
    googleBot: { index, follow: index, noimageindex: !index },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: wedding.theme.name,
    title: `${coupleFirstNames} · ${wedding.event.occasion}`,
    description: wedding.site.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${coupleFirstNames} · ${wedding.event.occasion}`,
    description: wedding.site.description,
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#07152F",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${cinzel.variable} ${italianno.variable} ${cormorant.variable} ${naskh.variable}`} suppressHydrationWarning>
      <head>
        <InlineScript html={OPENING_HEAD_SCRIPT} />
        <noscript>
          <style>{`[data-opening-cover]{display:none!important}[style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <Providers>
          {children}
          <WanderingHourglass />
          <MusicHost />
          <SandCursor />
          <Announcer />
        </Providers>
      </body>
    </html>
  );
}
