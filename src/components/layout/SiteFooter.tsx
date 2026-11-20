import { wedding } from "@/config/wedding";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-gold/20 bg-[#040c1f] px-4 py-8 text-center">
      <p className="text-base tracking-[0.06em] text-sand">
        {wedding.copy.footer.creditPrefix} {wedding.developerCredit}
      </p>
    </footer>
  );
}
