import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="stone flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <Image src="/images/hourglass-emblem.svg" alt="" width={120} height={160} priority />
      <h1 className="gold-foil mt-6 font-display text-3xl font-semibold tracking-[0.12em]">A path lost to the sands</h1>
      <p className="mt-3 max-w-md text-lg italic text-parchment">This corridor of the palace does not exist.</p>
      <Link href="/" className="mt-8 inline-flex min-h-12 items-center border border-gold/60 px-6 font-display text-xs uppercase tracking-[0.3em] text-gold-bright hover:bg-gold/10">
        Return to the kingdom
      </Link>
    </main>
  );
}
