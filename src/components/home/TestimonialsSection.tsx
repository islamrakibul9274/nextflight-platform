import React from "react";
import { Star, CheckCircle2, Quote } from "lucide-react";

export function TestimonialsSection() {
  const reviews = [
    {
      name: "Jonathan Vance",
      role: "Managing Partner, Ridgeview Capital",
      comment:
        "The cleanest flight booking interface I have ever experienced. Being able to see genuine seat pitch and book an A350 lie-flat suite in under 60 seconds with instant Apple Wallet pass delivery is remarkable.",
      route: "SFO → HND (Tokyo Haneda)",
      cabin: "First Class Sky Suite",
      rating: 5,
    },
    {
      name: "Dr. Elena Rostova",
      role: "Global Health Director, Geneva",
      comment:
        "Transparent pricing with zero bait-and-switch baggage fees. The Three.js interactive journey storytelling is visually stunning, but the reliable customer experience is what keeps me flying.",
      route: "JFK → LHR (London Heathrow)",
      cabin: "Business Class",
      rating: 5,
    },
    {
      name: "Marcus Aurel",
      role: "Architect & Frequent Traveler",
      comment:
        "Gold Stratosphere membership has already paid for itself threefold with airport lounge access and 15% automatic flight discounts. The AI Travel Concierge answered all my Japan transit visa questions instantly.",
      route: "DXB → SIN (Singapore Changi)",
      cabin: "Business Class",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Traveler Endorsements
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Trusted by Leaders in Tech, Design & Finance
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Read verified reviews from passengers flying across our global airway corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(r.rating)].map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.role}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                </div>
                <div className="mt-2 text-[11px] font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md inline-block">
                  {r.route} • {r.cabin}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
