"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Crown, ArrowRight } from "lucide-react";

export function MembershipPreview() {
  const [annualBilling, setAnnualBilling] = useState(true);

  const tiers = [
    {
      name: "Silver Voyager",
      tier: "VOYAGER",
      priceMonth: 0,
      priceYear: 0,
      description: "Essential privileges for modern independent travelers.",
      features: [
        "Real-time flight radar tracking",
        "Standard seat selection at check-in",
        "1x 8kg cabin + 1x 23kg checked bag",
        "Email e-ticket & boarding pass dispatch",
        "Standard cancellation window",
      ],
      cta: "Start free",
      highlight: false,
    },
    {
      name: "Gold Stratosphere",
      tier: "STRATOSPHERE",
      priceMonth: 19,
      priceYear: 190,
      description: "Unrestricted flexibility, VIP lounge passes, and guaranteed fare savings.",
      features: [
        "15% automatic discount on all flights",
        "Free seat selection on every booking",
        "Unlimited airport lounge access",
        "+1 extra 23kg checked bag",
        "Priority security lane clearance",
        "100% cash refunds",
      ],
      cta: "Join Gold Stratosphere",
      highlight: true,
      badge: "Most Popular",
    },
    {
      name: "Apex Black",
      tier: "APEX",
      priceMonth: 49,
      priceYear: 490,
      description: "The absolute pinnacle of private-aviation tier bespoke global luxury.",
      features: [
        "20% automatic discount on all flights",
        "Free seat selection on every booking",
        "Lounges worldwide with +2 guests",
        "Private chauffeur airport transfer (up to 40 miles)",
        "100% instant refunds, zero fees",
        "Private charter fleet invitations",
      ],
      cta: "Upgrade to Apex Black",
      highlight: false,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-500" aria-hidden /> Stratosphere Club
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Elevate Every Stage of Your Voyage
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Guaranteed flight savings, priority airport expedited lanes, and VIP lounge access.
          </p>

          {/* Billing Switch Toggle */}
          <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80" role="group" aria-label="Billing period">
            <button
              onClick={() => setAnnualBilling(false)}
              aria-pressed={!annualBilling}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !annualBilling
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              aria-pressed={annualBilling}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                annualBilling
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-700">
                Save ~17%
              </span>
            </button>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((t) => (
            <div
              key={t.tier}
              className={`relative rounded-3xl p-8 transition-all duration-200 flex flex-col justify-between bg-white text-slate-900 border shadow-xs ${
                t.highlight
                  ? "border-sky-500 ring-2 ring-sky-500 shadow-lg lg:-translate-y-2"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              {t.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-sky-600 text-white font-bold text-[11px] tracking-wide uppercase shadow-sm">
                  {t.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{t.name}</h3>
                  <Crown className="w-5 h-5 text-amber-500" aria-hidden />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {t.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-sans">
                    ${annualBilling ? Math.round(t.priceYear / 12) : t.priceMonth}
                  </span>
                  <span className="text-xs text-slate-500">
                    / month {annualBilling && t.priceYear > 0 ? `(billed $${t.priceYear}/yr)` : ""}
                  </span>
                </div>

                <div className="border-t my-6 border-slate-100" />

                {/* Features List */}
                <ul className="space-y-3">
                  {t.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-sky-600" aria-hidden />
                      <span className="text-slate-700">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/membership"
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                    t.highlight
                      ? "bg-sky-600 hover:bg-sky-700 text-white shadow-md"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                  }`}
                >
                  <span>{t.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
