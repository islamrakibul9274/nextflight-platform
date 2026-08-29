import React from "react";
import Link from "next/link";
import { Plane, ArrowRight, Sparkles, Shield, Wifi, Coffee } from "lucide-react";

export function FeaturedRoutes() {
  const routes = [
    {
      fromCode: "JFK",
      fromCity: "New York",
      toCode: "LHR",
      toCity: "London",
      airline: "Aetheria Flagship",
      airlineLogo: "✈️",
      flightNum: "AE-402",
      aircraft: "Boeing 787-9",
      duration: "7h 00m",
      stops: "Nonstop",
      price: 580,
      amenities: ["Lie-flat", "Starlink WiFi", "Gourmet Dining"],
    },
    {
      fromCode: "SFO",
      fromCity: "San Francisco",
      toCode: "HND",
      toCity: "Tokyo",
      airline: "All Nippon Airways",
      airlineLogo: "🇯🇵",
      flightNum: "NH-108",
      aircraft: "Airbus A350-1000",
      duration: "10h 30m",
      stops: "Nonstop",
      price: 820,
      amenities: ["Lie-flat", "Starlink WiFi", "Omakase Menu"],
    },
    {
      fromCode: "DXB",
      fromCity: "Dubai",
      toCode: "SIN",
      toCity: "Singapore",
      airline: "Emirates",
      airlineLogo: "🇦🇪",
      flightNum: "EK-354",
      aircraft: "Airbus A380-800",
      duration: "7h 20m",
      stops: "Nonstop",
      price: 530,
      amenities: ["Onboard Lounge", "WiFi", "Shower Spa"],
    },
    {
      fromCode: "LAX",
      fromCity: "Los Angeles",
      toCode: "SYD",
      toCity: "Sydney",
      airline: "Aetheria Flagship",
      airlineLogo: "✈️",
      flightNum: "AE-880",
      aircraft: "Airbus A350-1000",
      duration: "14h 50m",
      stops: "Nonstop",
      price: 1180,
      amenities: ["Private Suite", "WiFi", "Sommelier Selection"],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Featured Direct Corridors
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              High-Frequency Transoceanic Routes
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Guaranteed lowest fares with authoritative real-time seat inventory.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {routes.map((r, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-200/90 hover:border-sky-500 bg-white hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              {/* Top Row: Airline & Aircraft */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{r.airlineLogo}</span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{r.airline}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {r.flightNum} • {r.aircraft}
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {r.stops}
                </span>
              </div>

              {/* Middle: Route & Times */}
              <div className="py-6 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">
                    {r.fromCode}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{r.fromCity}</div>
                </div>

                <div className="flex flex-col items-center px-4 flex-1">
                  <span className="text-[11px] font-semibold text-slate-400 mb-1">{r.duration}</span>
                  <div className="w-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full border-2 border-sky-600 bg-white shrink-0" />
                    <div className="h-0.5 w-full bg-slate-200 group-hover:bg-sky-400 transition-colors relative">
                      <Plane className="w-3.5 h-3.5 text-sky-600 absolute left-1/2 -top-1.5 -translate-x-1/2 -rotate-45" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-slate-900 shrink-0" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">Direct Airway</span>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">
                    {r.toCode}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{r.toCity}</div>
                </div>
              </div>

              {/* Amenities Strip */}
              <div className="flex items-center gap-3 pt-2 pb-4 text-xs text-slate-500">
                {r.amenities.map((amenity, idx) => (
                  <span key={idx} className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-500" />
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Bottom: Price and CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">One-way from</span>
                  <div className="text-2xl font-extrabold text-slate-900">
                    ${r.price}{" "}
                    <span className="text-xs font-normal text-slate-400">USD</span>
                  </div>
                </div>
                <Link
                  href={`/search?from=${r.fromCode}&to=${r.toCode}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
                >
                  <span>Select Flight</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
