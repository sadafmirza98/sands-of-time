import { z } from "zod";

/** Validation for a future RSVP form. Party size cap comes from config. */
export function rsvpSchema(maxPartySize: number, dietaryOptions: string[]) {
  return z.object({
    name: z.string().trim().min(2, "Please enter your name.").max(80),
    attending: z.enum(["yes", "no"], { message: "Please let us know if you can attend." }),
    partySize: z.coerce.number().int().min(1).max(maxPartySize, `At most ${maxPartySize} guests per invitation.`),
    dietary: dietaryOptions.length ? z.array(z.enum(dietaryOptions as [string, ...string[]])).default([]) : z.array(z.string()).max(0).default([]),
    message: z.string().trim().max(500).optional(),
  });
}

export type RsvpPayload = z.output<ReturnType<typeof rsvpSchema>>;
