import Link from "next/link";
import { ArrowUpRight, Plane } from "lucide-react";
export function FinalCTA() {
  return (
    <section className="landing-section border-t border-slate-200/70 bg-[#edf4f7]">
      <div className="page-container flex flex-col items-center text-center">
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-slate-300/60 text-[#527c8a]">
          <Plane
            size={22}
            strokeWidth={1.3}
            className="-rotate-45"
            aria-hidden="true"
          />
        </span>
        <p className="section-kicker">THERE’S A WHOLE WORLD OUT THERE</p>
        <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-slate-900 sm:text-5xl">
          Your next chapter awaits.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
          Start with a destination. We’ll help you find your way there.
        </p>
        <Link
          href="/search"
          className="button-primary mt-7 !rounded-full !px-7"
        >
          Find my flight <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
