import React from "react";
import Link from "next/link";
import { Plane, ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-white border border-slate-200 p-10 sm:p-16 overflow-hidden shadow-sm">
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-sky-100 rounded-full blur-3xl" aria-hidden />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" aria-hidden /> Start Your Voyage Today
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Ready to experience modern flight travel?
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Join thousands of travelers flying with direct routes, transparent fares, and effortless booking intelligence.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/search"
                className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow transition-all flex items-center gap-2"
              >
                <Plane className="w-4 h-4 -rotate-45" aria-hidden />
                <span>Search Flights Now</span>
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/membership"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm transition-all"
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
