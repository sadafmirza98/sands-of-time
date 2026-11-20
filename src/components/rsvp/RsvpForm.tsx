"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { wedding } from "@/config/wedding";
import { RoyalButton } from "@/components/ui/RoyalButton";
import { rsvpSchema } from "@/services/rsvp/schema";
import { submitRsvp } from "@/services/rsvp";

/**
 * Future RSVP form (React Hook Form + Zod). Loaded lazily and only rendered
 * when RSVP is enabled with a real party-size cap and endpoint.
 */
export default function RsvpForm({ maxPartySize }: { maxPartySize: number }) {
  const schema = rsvpSchema(maxPartySize, wedding.rsvp.dietaryOptions);
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: "", attending: undefined, partySize: 1, dietary: [], message: "" } });

  if (state === "sent") {
    return (
      <p role="status" className="text-center text-xl italic text-parchment">
        Thank you — your reply has been received.
      </p>
    );
  }

  const field = "mt-2 w-full rounded-md border border-gold/40 bg-midnight/60 px-4 py-3 text-lg text-parchment placeholder:text-sand/50 focus:border-gold-bright focus:outline-none";
  const label = "font-display text-xs uppercase tracking-[0.3em] text-gold";
  const error = "mt-1 text-base text-[#f3b8a8]";

  return (
    <form
      noValidate
      className="mx-auto grid max-w-lg gap-6"
      onSubmit={handleSubmit(async (values) => {
        try {
          await submitRsvp(values);
          setState("sent");
        } catch {
          setState("error");
        }
      })}
    >
      <div>
        <label htmlFor="rsvp-name" className={label}>Name</label>
        <input id="rsvp-name" autoComplete="name" className={field} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "rsvp-name-err" : undefined} {...register("name")} />
        {errors.name && <p id="rsvp-name-err" className={error}>{errors.name.message}</p>}
      </div>
      <fieldset>
        <legend className={label}>Will you attend?</legend>
        <div className="mt-3 flex gap-6 text-lg">
          <label className="flex items-center gap-2"><input type="radio" value="yes" {...register("attending")} /> Joyfully accepts</label>
          <label className="flex items-center gap-2"><input type="radio" value="no" {...register("attending")} /> Regretfully declines</label>
        </div>
        {errors.attending && <p className={error}>{errors.attending.message}</p>}
      </fieldset>
      <div>
        <label htmlFor="rsvp-party" className={label}>Number of guests</label>
        <input id="rsvp-party" type="number" min={1} max={maxPartySize} inputMode="numeric" className={field} {...register("partySize")} />
        {errors.partySize && <p className={error}>{errors.partySize.message}</p>}
      </div>
      {wedding.rsvp.dietaryOptions.length > 0 && (
        <fieldset>
          <legend className={label}>Dietary requirements</legend>
          <div className="mt-3 flex flex-wrap gap-4 text-lg">
            {wedding.rsvp.dietaryOptions.map((o) => (
              <label key={o} className="flex items-center gap-2"><input type="checkbox" value={o} {...register("dietary")} /> {o}</label>
            ))}
          </div>
        </fieldset>
      )}
      <div>
        <label htmlFor="rsvp-message" className={label}>Message (optional)</label>
        <textarea id="rsvp-message" rows={3} className={field} {...register("message")} />
      </div>
      {state === "error" && <p role="alert" className={error}>Sorry — your reply could not be sent. Please try again or contact the family.</p>}
      <RoyalButton type="submit" variant="gold" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send reply"}
      </RoyalButton>
    </form>
  );
}
