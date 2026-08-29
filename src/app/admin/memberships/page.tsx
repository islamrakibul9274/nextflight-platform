"use client";

import React from "react";
import { Crown, Users, TrendingUp, DollarSign, Award, ShieldCheck } from "lucide-react";

export default function AdminMembershipsPage() {
  const plans = [
    {
      tier: "VOYAGER",
      name: "Silver Voyager",
      subscribers: 28400,
      mrr: "$0",
      churn: "0.2%",
      growth: "+18%",
    },
    {
      tier: "STRATOSPHERE",
      name: "Gold Stratosphere",
      subscribers: 8940,
      mrr: "$169,860",
      churn: "1.1%",
      growth: "+24%",
    },
    {
      tier: "APEX",
      name: "Apex Black",
      subscribers: 1420,
      mrr: "$69,580",
      churn: "0.4%",
      growth: "+31%",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Stratosphere Club & Loyalty Tiers
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Subscriber growth metrics, recurring revenue, and tier retention analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {p.tier}
              </span>
              <Crown className="w-5 h-5 text-sky-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
              <div className="text-3xl font-extrabold font-mono text-slate-900 mt-2">
                {p.subscribers.toLocaleString()}{" "}
                <span className="text-xs font-normal text-slate-400">Members</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Monthly Run-Rate</span>
                <div className="font-bold text-emerald-600 font-mono">{p.mrr}</div>
              </div>
              <div>
                <span className="text-slate-400">MoM Growth</span>
                <div className="font-bold text-sky-600">{p.growth}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
