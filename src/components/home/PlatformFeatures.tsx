import React from "react";
import { Zap, ShieldCheck, Sparkles, SlidersHorizontal, RefreshCw, Smartphone } from "lucide-react";

export function PlatformFeatures() {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Telemetry & Radar",
      description:
        "Direct connection to aeronautical ATC networks ensures millisecond-accurate seat inventory, live departure gates, and zero ghost fares.",
    },
    {
      icon: ShieldCheck,
      title: "Transparent Authoritative Pricing",
      description:
        "What you see is authoritative. No hidden luggage surcharges, seat selection bait-and-switch, or unexpected checkout fees.",
    },
    {
      icon: Sparkles,
      title: "AI Travel Concierge",
      description:
        "Instant visa validation, customized connection routing, baggage advisories, and hotel integration via our intelligent LLM concierge.",
    },
    {
      icon: SlidersHorizontal,
      title: "Interactive Cabin Seat Pitch",
      description:
        "Explore exact seat layouts, pitch dimensions, power outlets, and lie-flat angle before confirming your booking.",
    },
    {
      icon: RefreshCw,
      title: "Self-Service 1-Click Changes",
      description:
        "Modify dates, select upgraded cabins, or request automated refunds without enduring endless customer service call hold queues.",
    },
    {
      icon: Smartphone,
      title: "Apple Wallet & E-Ticket Sync",
      description:
        "Instant boarding pass issuance with scannable dynamic QR codes, Apple Wallet integration, and offline itinerary access.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Engineered Without Compromise
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Why Discerning Travelers Choose NextFlight
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Every layer of our flight technology is engineered to eliminate travel friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-500/80 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 border border-sky-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
