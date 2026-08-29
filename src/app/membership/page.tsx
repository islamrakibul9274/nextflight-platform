"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Crown,
  Check,
  Sparkles,
  ShieldCheck,
  Plane,
  ArrowRight,
  Zap,
  Coffee,
  Luggage,
} from "lucide-react";

export default function MembershipPage() {
  const { user, refreshUser } = useAuth();
  const [annualBilling, setAnnualBilling] = useState(true);
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const tiers = [
    {
      id: "VOYAGER",
      name: "Silver Voyager",
      tagline: "Essential privileges for occasional global travelers.",
      priceMonth: 0,
      priceYear: 0,
      discount: "0%",
      perks: [
        "Real-time aeronautical radar tracking",
        "Standard seat selection at check-in",
        "1x 8kg cabin + 1x 23kg checked bag",
        "Digital e-ticket & Apple Wallet sync",
        "Standard 24h change window",
      ],
      current: user?.membershipTier === "VOYAGER" || !user,
      cta: "Current Tier",
    },
    {
      id: "STRATOSPHERE",
      name: "Gold Stratosphere",
      tagline: "Unrestricted flexibility, VIP lounge passes, and guaranteed flight savings.",
      priceMonth: 19,
      priceYear: 190,
      discount: "15% Off All Flights",
      badge: "Most Popular",
      perks: [
        "15% Automatic instant discount on every route",
        "Complimentary extra legroom seat assignment",
        "Unlimited Global VIP Airport Lounge Passes",
        "+1 Extra 23kg checked bag on all flights",
        "Priority Fast-Track airport security lane clearance",
        "Dedicated 24/7 AI Concierge with phone priority",
        "Free flight date changes with zero penalty",
      ],
      current: user?.membershipTier === "STRATOSPHERE",
      cta: "Upgrade to Stratosphere",
      highlight: true,
    },
    {
      id: "APEX",
      name: "Apex Black",
      tagline: "The absolute pinnacle of private-aviation tier bespoke global luxury.",
      priceMonth: 49,
      priceYear: 490,
      discount: "20% Off All Flights",
      perks: [
        "20% Automatic instant discount on every route",
        "Complimentary First/Business Class upgrades on availability",
        "Private chauffeur airport transfer (up to 40 miles)",
        "Dedicated human flight operations manager & concierge",
        "Unlimited VIP lounges worldwide with +2 guests",
        "Zero cancellation fees forever with 100% instant refund",
        "Exclusive invitation to private charter fleet network",
      ],
      current: user?.membershipTier === "APEX",
      cta: "Upgrade to Apex Black",
    },
  ];

  const handleUpgrade = async (tierId: string) => {
    setUpgradingTier(tierId);
    setSuccessMsg("");

    try {
      // Update membership on DB
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipTier: tierId }),
      });

      if (res.ok) {
        setSuccessMsg(`Congratulations! You have successfully upgraded to ${tierId} tier.`);
        refreshUser();
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (e) {
      console.error("Upgrade error:", e);
    } finally {
      setUpgradingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-500" /> Stratosphere Club Tiers
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Elevate Every Stage of Your Voyage
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Guaranteed flight savings on every ticket, complimentary airport lounge access, and expedited VIP clearance.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                !annualBilling ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                annualBilling ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500 text-white">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="max-w-xl mx-auto mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl text-center shadow-xs">
            {successMsg}
          </div>
        )}

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {tiers.map((t) => {
            const price = annualBilling ? Math.round(t.priceYear / 12) : t.priceMonth;

            return (
              <div
                key={t.id}
                className={`relative rounded-3xl p-8 transition-all flex flex-col justify-between ${
                  t.highlight
                    ? "bg-slate-900 text-white shadow-2xl ring-2 ring-sky-500 scale-102 lg:-translate-y-2"
                    : "bg-white text-slate-900 border border-slate-200 shadow-2xs"
                }`}
              >
                {t.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-sky-500 text-white font-bold text-[11px] uppercase tracking-wide shadow-sm">
                    {t.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold">{t.name}</h3>
                    <Crown className={`w-5 h-5 ${t.highlight ? "text-sky-400" : "text-slate-400"}`} />
                  </div>
                  <p
                    className={`mt-2 text-xs leading-relaxed ${
                      t.highlight ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {t.tagline}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono">${price}</span>
                    <span className={`text-xs ${t.highlight ? "text-slate-400" : "text-slate-500"}`}>
                      / month {annualBilling && t.priceYear > 0 ? `(billed $${t.priceYear}/yr)` : ""}
                    </span>
                  </div>

                  <div className={`border-t my-6 ${t.highlight ? "border-slate-800" : "border-slate-100"}`} />

                  <ul className="space-y-3">
                    {t.perks.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            t.highlight ? "text-sky-400" : "text-sky-600"
                          }`}
                        />
                        <span className={t.highlight ? "text-slate-200" : "text-slate-700"}>
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    disabled={t.current || upgradingTier === t.id}
                    onClick={() => handleUpgrade(t.id)}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                      t.current
                        ? "bg-slate-100 text-slate-400 border border-slate-200"
                        : t.highlight
                        ? "bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <span>{t.current ? "Active Tier ✓" : upgradingTier === t.id ? "Upgrading..." : t.cta}</span>
                    {!t.current && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-2xs overflow-x-auto">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Detailed Tier Comparison Matrix</h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase">
                <th className="py-3 font-semibold">Privilege / Feature</th>
                <th className="py-3 font-semibold">Silver Voyager</th>
                <th className="py-3 font-semibold text-sky-600">Gold Stratosphere</th>
                <th className="py-3 font-semibold text-indigo-600">Apex Black</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr>
                <td className="py-3 font-bold text-slate-900">Flight Fare Discount</td>
                <td className="py-3">Standard Fares</td>
                <td className="py-3 text-sky-600 font-bold">15% Off All Routes</td>
                <td className="py-3 text-indigo-600 font-bold">20% Off All Routes</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">VIP Airport Lounge Access</td>
                <td className="py-3 text-slate-400">Pay per visit ($50)</td>
                <td className="py-3 text-emerald-600 font-bold">Unlimited Global Access</td>
                <td className="py-3 text-emerald-600 font-bold">Unlimited + 2 Guests</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Complimentary Extra Baggage</td>
                <td className="py-3 text-slate-400">1x 23kg standard</td>
                <td className="py-3 text-sky-600 font-bold">+1x 23kg Free (2 total)</td>
                <td className="py-3 text-indigo-600 font-bold">+2x 32kg Free (3 total)</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Extra Legroom Seat Selection</td>
                <td className="py-3 text-slate-400">Paid ($35)</td>
                <td className="py-3 text-emerald-600 font-bold">Free Instant Selection</td>
                <td className="py-3 text-emerald-600 font-bold">Free Instant Selection</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Cancellation & Refund Policy</td>
                <td className="py-3 text-slate-400">85% automated refund</td>
                <td className="py-3 text-emerald-600 font-bold">100% Cash Refund</td>
                <td className="py-3 text-emerald-600 font-bold">100% Instant Refund</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Private Chauffeur Airport Transfer</td>
                <td className="py-3 text-slate-400">—</td>
                <td className="py-3 text-slate-400">—</td>
                <td className="py-3 text-indigo-600 font-bold">Complimentary (40 mi)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
