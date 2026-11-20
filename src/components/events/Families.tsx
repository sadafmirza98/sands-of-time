import type { Person } from "@/types/wedding";

/** Full name + parents, exactly as configured. */
export function PersonBlock({ person }: { person: Person }) {
  const { parents } = person;
  return (
    <div className="flex flex-col items-center">
      <p className="font-display text-[clamp(1.3rem,5.2vw,2rem)] font-semibold uppercase leading-tight tracking-[0.12em] text-navy">{person.fullName}</p>
      <p className="mt-2 text-[0.95rem] italic text-bronze">{parents.relation}</p>
      <p className="text-lg leading-snug text-ink">{parents.mother}</p>
      <p className="text-[0.95rem] italic text-bronze">and</p>
      <p className="text-lg leading-snug text-ink">{parents.father}</p>
    </div>
  );
}
