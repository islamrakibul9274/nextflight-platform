import React from "react";
import Link from "next/link";
import { Plane, ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-900 text-white p-10 sm:p-16 overflow-hidden shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-300 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Start Your Voyage Today
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to experience modern flight travel?
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of travelers flying with direct routes, transparent fares, and effortless booking intelligence.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/search"
                className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2"
              >
                <Plane className="w-4 h-4 -rotate-45" />
                <span>Search Flights Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/membership"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
              >
                Explore Stratosphere Club
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
