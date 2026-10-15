import React from "react";
import { ShieldCheck, Activity, Users, Award } from "lucide-react";

export function TrustTelemetry() {
  const stats = [
    {
      icon: Activity,
      value: "99.98%",
      label: "On-Time Dispatch Rate",
      subtext: "Across global partner networks",
    },
    {
      icon: Users,
      value: "180+",
      label: "International Airports",
      subtext: "Direct & single-stop connections",
    },
    {
      icon: Award,
      value: "4.95 / 5",
      label: "Traveler Satisfaction",
      subtext: "Over 48,000 verified reviews",
    },
    {
      icon: ShieldCheck,
      value: "$2.8M+",
      label: "Member Fare Savings",
      subtext: "Delivered in the past 12 months",
    },
  ];

  return (
    <section className="py-20 bg-sky-50/70 border-y border-sky-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-sky-100">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="pt-6 sm:pt-0 sm:px-6 first:pl-0 last:pr-0 text-center sm:text-left">
                <div className="w-10 h-10 rounded-lg bg-white border border-sky-100 flex items-center justify-center text-sky-600 mb-4 mx-auto sm:mx-0 shadow-sm">
                  <Icon className="w-5 h-5" aria-hidden />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-slate-900">
                  {s.value}
                </div>
                <div className="text-sm font-semibold text-slate-900 mt-1">{s.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.subtext}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
