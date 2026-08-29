"use client";

import React from "react";
import { Luggage, Utensils, Shield, Leaf, Check } from "lucide-react";

interface AddOnsProps {
  extraBaggage: number; // 0, 1, 2 bags
  onUpdateBaggage: (count: number) => void;
  mealPreference: string;
  onUpdateMeal: (meal: string) => void;
  travelInsurance: boolean;
  onToggleInsurance: (enabled: boolean) => void;
  carbonOffset: boolean;
  onToggleOffset: (enabled: boolean) => void;
  passengerCount: number;
}

export function AddOnsSelector({
  extraBaggage,
  onUpdateBaggage,
  mealPreference,
  onUpdateMeal,
  travelInsurance,
  onToggleInsurance,
  carbonOffset,
  onToggleOffset,
  passengerCount = 1,
}: AddOnsProps) {
  return (
    <div className="space-y-6">
      {/* 1. Additional Checked Baggage */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Luggage className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Additional Checked Luggage</h3>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">$45 / 23kg bag</span>
        </div>
        <p className="text-xs text-slate-500">
          Standard tickets include 1x 23kg checked bag. Add extra luggage now to save 35% compared to airport check-in desk rates.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { count: 0, label: "Included 1x 23kg Bag", price: 0 },
            { count: 1, label: "+1 Extra 23kg Bag", price: 45 },
            { count: 2, label: "+2 Extra 23kg Bags", price: 90 },
          ].map((item) => (
            <button
              key={item.count}
              type="button"
              onClick={() => onUpdateBaggage(item.count)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                extraBaggage === item.count
                  ? "border-sky-500 bg-sky-50 text-slate-900 shadow-2xs ring-1 ring-sky-400"
                  : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{item.label}</span>
                {extraBaggage === item.count && <Check className="w-4 h-4 text-sky-600" />}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                {item.price === 0 ? "Standard Allowance" : `+$${item.price}`}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Gourmet In-Flight Dining Preference */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">In-Flight Meal Preference</h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Complimentary
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Chef-crafted meals served on fine china with beverage pairings. Special dietary requirements guaranteed.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
          {[
            { id: "STANDARD", label: "Chef Signature Special" },
            { id: "VEGAN", label: "Plant-Based / Vegan" },
            { id: "HALAL", label: "Certified Halal" },
            { id: "KOSHER", label: "Certified Glatt Kosher" },
            { id: "GLUTEN_FREE", label: "Gluten-Free Gourmet" },
          ].map((meal) => (
            <button
              key={meal.id}
              type="button"
              onClick={() => onUpdateMeal(meal.id)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                mealPreference === meal.id
                  ? "border-indigo-500 bg-indigo-50 text-indigo-950 font-bold shadow-2xs"
                  : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white text-xs"
              }`}
            >
              <div className="text-[11px] font-semibold">{meal.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Comprehensive Travel Protection Insurance */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                NextFlight Global Travel Protection & Medical
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Includes $100,000 emergency medical evacuation, 100% trip cancellation refund for any illness, and $2,500 lost baggage reimbursement.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-bold text-slate-900">$39 / person</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-700">Add protection for all {passengerCount} passenger(s)</span>
          <button
            type="button"
            onClick={() => onToggleInsurance(!travelInsurance)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              travelInsurance
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {travelInsurance ? "Protected ✓" : "+ Add Protection"}
          </button>
        </div>
      </div>

      {/* 4. Verified Carbon Offset */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Gold Standard Verified Carbon Neutral Contribution
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                100% offsets your flight&apos;s carbon emissions through verified reforestation and sustainable aviation fuel (SAF) investments.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-bold text-slate-900">$12 / person</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-700">Offset carbon footprint</span>
          <button
            type="button"
            onClick={() => onToggleOffset(!carbonOffset)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              carbonOffset
                ? "bg-sky-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {carbonOffset ? "Offset Added ✓" : "+ Add $12 Offset"}
          </button>
        </div>
      </div>
    </div>
  );
}
