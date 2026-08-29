"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, Check } from "lucide-react";

interface FilterState {
  stops: string; // 'all' | '0' | '1' | '2'
  maxPrice: number;
  timeWindow: string; // 'all' | 'morning' | 'afternoon' | 'evening' | 'night'
  selectedAirlines: string[];
  refundableOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableAirlines: Record<string, { name: string; count: number; logo: string }>;
  minCalculatedPrice: number;
  maxCalculatedPrice: number;
}

export function FlightFilterSidebar({
  filters,
  onChange,
  availableAirlines,
  minCalculatedPrice,
  maxCalculatedPrice,
}: FilterSidebarProps) {
  const handleStopChange = (stopVal: string) => {
    onChange({ ...filters, stops: stopVal });
  };

  const handlePriceChange = (val: number) => {
    onChange({ ...filters, maxPrice: val });
  };

  const handleTimeWindowChange = (tw: string) => {
    onChange({ ...filters, timeWindow: tw });
  };

  const toggleAirline = (code: string) => {
    const current = [...filters.selectedAirlines];
    const index = current.indexOf(code);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(code);
    }
    onChange({ ...filters, selectedAirlines: current });
  };

  const handleReset = () => {
    onChange({
      stops: "all",
      maxPrice: maxCalculatedPrice || 2500,
      timeWindow: "all",
      selectedAirlines: [],
      refundableOnly: false,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold text-slate-900">Filters</h3>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* 1. Stops */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Stops</h4>
        <div className="space-y-1.5">
          {[
            { id: "all", label: "Any number of stops" },
            { id: "0", label: "Nonstop only" },
            { id: "1", label: "1 stop or fewer" },
          ].map((s) => (
            <label
              key={s.id}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 py-1"
            >
              <input
                type="radio"
                name="stopsFilter"
                checked={filters.stops === s.id}
                onChange={() => handleStopChange(s.id)}
                className="accent-sky-600 w-3.5 h-3.5"
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Price Range */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Max Price</h4>
          <span className="text-xs font-mono font-bold text-sky-600">${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min={minCalculatedPrice || 200}
          max={maxCalculatedPrice || 3000}
          step={20}
          value={filters.maxPrice}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-sky-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>${minCalculatedPrice || 200}</span>
          <span>${maxCalculatedPrice || 3000}</span>
        </div>
      </div>

      {/* 3. Departure Times Window */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Departure Window</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "all", label: "Anytime", sub: "24 Hours" },
            { id: "morning", label: "Morning", sub: "06:00 - 12:00" },
            { id: "afternoon", label: "Afternoon", sub: "12:00 - 18:00" },
            { id: "evening", label: "Evening", sub: "18:00 - 24:00" },
          ].map((tw) => (
            <button
              key={tw.id}
              type="button"
              onClick={() => handleTimeWindowChange(tw.id)}
              className={`p-2 rounded-xl text-left border transition-all ${
                filters.timeWindow === tw.id
                  ? "border-sky-500 bg-sky-50 text-sky-950 font-bold"
                  : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
              }`}
            >
              <div className="text-[11px] font-semibold">{tw.label}</div>
              <div className="text-[9px] text-slate-400">{tw.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Airlines */}
      {Object.keys(availableAirlines).length > 0 && (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Airlines</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {Object.entries(availableAirlines).map(([code, info]) => {
              const isChecked =
                filters.selectedAirlines.length === 0 ||
                filters.selectedAirlines.includes(code);

              return (
                <label
                  key={code}
                  className="flex items-center justify-between text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.selectedAirlines.includes(code)}
                      onChange={() => toggleAirline(code)}
                      className="accent-sky-600 rounded w-3.5 h-3.5"
                    />
                    <span className="text-sm">{info.logo}</span>
                    <span className="truncate max-w-[120px]">{info.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">({info.count})</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Policy Toggles */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-slate-700">Refundable Fares Only</span>
          <input
            type="checkbox"
            checked={filters.refundableOnly}
            onChange={(e) => onChange({ ...filters, refundableOnly: e.target.checked })}
            className="accent-sky-600 rounded w-4 h-4"
          />
        </label>
      </div>
    </div>
  );
}
