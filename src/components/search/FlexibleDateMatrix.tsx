"use client";

import React from "react";
import { Calendar } from "lucide-react";

interface DateMatrixItem {
  date: string;
  minPrice: number | null;
  formattedDate: string;
}

interface FlexibleDateMatrixProps {
  dates: DateMatrixItem[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function FlexibleDateMatrix({
  dates,
  selectedDate,
  onSelectDate,
}: FlexibleDateMatrixProps) {
  if (!dates || dates.length === 0) return null;

  return (
    <div className="bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xs mb-6 overflow-hidden">
      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 mb-2 px-1">
        <Calendar className="w-3.5 h-3.5 text-blue-600" />
        <span>Nearby dates · fares per traveler</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5">
        {dates.map((d) => {
          const isSelected = selectedDate === d.date;
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => onSelectDate(d.date)}
              aria-pressed={isSelected}
              aria-label={`${d.formattedDate}: ${d.minPrice === null ? "no flights available" : `from $${d.minPrice}`}`}
              className={`p-2.5 rounded-xl text-center transition-all border cursor-pointer ${
                isSelected
                  ? "bg-blue-50 border-blue-500 shadow-2xs"
                  : "bg-zinc-50/60 border-zinc-100 hover:border-zinc-200 hover:bg-zinc-100/70"
              }`}
            >
              <div
                className={`text-[11px] font-semibold ${
                  isSelected ? "text-blue-950 font-bold" : "text-zinc-600"
                }`}
              >
                {d.formattedDate}
              </div>
              <div
                className={`text-xs font-mono font-extrabold mt-0.5 ${
                  isSelected ? "text-blue-600" : "text-zinc-900"
                }`}
              >
                {d.minPrice === null
                  ? "No flights"
                  : `from $${d.minPrice.toLocaleString("en-US")}`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
