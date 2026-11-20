import { MessageCircle, Phone } from "lucide-react";
import { wedding } from "@/config/wedding";
import { RoyalLink } from "@/components/ui/RoyalButton";
import { telHref, whatsappHref } from "@/lib/contacts";
import { cx } from "@/lib/formatting";

export function ContactActions({ tone = "parchment", className }: { tone?: "parchment" | "dark"; className?: string }) {
  const { actions } = wedding.copy.details;
  const variant = tone === "parchment" ? "parchment" : "ghost";
  return (
    <div className={cx("flex flex-wrap justify-center gap-3", className)}>
      <RoyalLink href={telHref} variant={variant} icon={<Phone />} aria-label={`${actions.call}: ${wedding.contact.phone}`}>
        {actions.call}
      </RoyalLink>
      {whatsappHref && (
        <RoyalLink href={whatsappHref} external variant={variant} icon={<MessageCircle />} aria-label={`${actions.whatsapp}: ${wedding.contact.phone}`}>
          {actions.whatsapp}
        </RoyalLink>
      )}
    </div>
  );
}
