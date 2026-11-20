import { wedding } from "@/config/wedding";

const digits = wedding.contact.phone.replace(/[^\d+]/g, "");

/** "tel:+918433783337" */
export const telHref = `tel:${digits}`;

/** WhatsApp click-to-chat (expects the number without "+" or spaces). */
export const whatsappHref = wedding.contact.whatsapp ? `https://wa.me/${digits.replace(/^\+/, "")}` : null;

export const phoneDisplay = wedding.contact.phone;
