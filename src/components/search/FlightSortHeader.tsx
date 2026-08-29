"use client";

import React from "react";
import { Sparkles, DollarSign, Zap, Clock } from "lucide-react";

interface FlightSortHeaderProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
  flightCount: number;
}

export function FlightSortHeader({
  currentSort,
  onSortChange,
  flightCount,
}: FlightSortHeaderProps) {
  const sortOptions = [
    { id: "recommended", label: "Best Match", icon: Sparkles, badge: "AI Ranked" },
    { id: "cheapest", label: "Cheapest", icon: DollarSign },
    { id: "fastest", label: "Fastest", icon: Zap },
    { id: "earliest", label: "Earliest", icon: Clock },
    { id: "latest", label: "Latest", icon: Clock },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs mb-4">
      <div className="text-xs font-semibold text-slate-700">
        Showing <span className="font-bold text-slate-900">{flightCount}</span> flight
        {flightCount === 1 ? "" : "s"} found
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
        {sortOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = currentSort === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSortChange(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
              <span>{opt.label}</span>
              {opt.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? "bg-sky-500 text-white" : "bg-sky-50 text-sky-700"
                  }`}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
