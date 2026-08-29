"use client";

import React, { useState } from "react";
import { DollarSign, SlidersHorizontal, ArrowUpRight, ShieldCheck, Check } from "lucide-react";

export default function AdminPricingPage() {
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.15);
  const [weekendSurcharge, setWeekendSurcharge] = useState(45);
  const [autoTaxRate, setAutoTaxRate] = useState(12);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Dynamic Pricing Engine & Surge Rules
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Adjust automated algorithmic price multipliers based on route load factors and peak booking velocity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-sky-600" />
            Route Demand Calibration
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                <span>Peak Load Factor Surge Multiplier</span>
                <span className="font-mono text-sky-600 font-bold">{surgeMultiplier}x</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={2.0}
                step={0.05}
                value={surgeMultiplier}
                onChange={(e) => setSurgeMultiplier(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Applies when flight seats remaining fall below 15% capacity.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                <span>Weekend Departure Surcharge</span>
                <span className="font-mono text-sky-600 font-bold">${weekendSurcharge} USD</span>
              </div>
              <input
                type="range"
                min={0}
                max={150}
                step={5}
                value={weekendSurcharge}
                onChange={(e) => setWeekendSurcharge(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                <span>Regulatory Taxes & Fees Rate</span>
                <span className="font-mono text-sky-600 font-bold">{autoTaxRate}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                step={1}
                value={autoTaxRate}
                onChange={(e) => setAutoTaxRate(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => alert("Pricing engine rules saved to live telemetry.")}
              className="px-5 py-2.5 bg-slate-900 hover:bg-sky-600 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
            >
              Update Pricing Rules
            </button>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Authoritative Fare Guarantee
          </div>
          <h3 className="text-xl font-extrabold">Algorithmic Safeguard Protocol</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All server-calculated pricing is authoritative. When a traveler initiates a checkout session, their price is locked in the central memory store to prevent race conditions during heavy booking spikes.
          </p>
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Zero client-side price tampering vulnerability</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Real-time GDS currency conversion sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
