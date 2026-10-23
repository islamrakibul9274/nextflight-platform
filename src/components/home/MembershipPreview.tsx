import Link from "next/link";
import { ArrowUpRight, Crown, Check } from "lucide-react";

export function MembershipPreview() {
  return (
    <section className="landing-section bg-white">
      <div className="page-container">
        <div className="membership-preview">
          <div className="relative z-10 max-w-lg">
            <p className="section-kicker !text-sky-200/70">
              THE STRATOSPHERE CLUB
            </p>
            <h2 className="mt-4 text-4xl font-medium leading-[1.12] tracking-[-0.045em] sm:text-5xl">
              For the places
              <br />
              you’ll go next.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
              Make more of every journey. Explore a membership with fare
              savings, seat benefits, and a little extra room for the things you
              bring.
            </p>
            <Link
              href="/membership"
              className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-sky-100"
            >
              Discover your membership{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div
            className="membership-card"
            aria-label="Gold Stratosphere membership preview"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium tracking-tight">
                nextflight.
              </span>
              <Crown size={21} strokeWidth={1.4} aria-hidden="true" />
            </div>
            <div className="my-10">
              <p className="text-[9px] tracking-[0.24em] text-sky-100/60">
                THE STRATOSPHERE CLUB
              </p>
              <p className="mt-2 text-2xl font-medium tracking-tight">
                A little more, every journey.
              </p>
            </div>
            <div className="flex items-end justify-between border-t border-white/15 pt-4">
              <span className="text-xs text-sky-100/80">Gold Stratosphere</span>
              <span className="font-mono text-[10px] tracking-widest text-white/50">
                N / F
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 px-4 pt-6 text-xs text-slate-500">
          {[
            "A free tier to get you started",
            "Monthly and annual options",
            "Compare benefits before joining",
          ].map((text) => (
            <span key={text} className="inline-flex items-center gap-2">
              <Check size={13} className="text-[#527c8a]" aria-hidden="true" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
