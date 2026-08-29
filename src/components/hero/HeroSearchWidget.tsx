"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Calendar,
  Users,
  ArrowRightLeft,
  Search,
  ChevronDown,
  MapPin,
  Sparkles,
  Check,
  X,
  TrendingDown,
  ShieldCheck,
  Compass,
  ArrowRight,
} from "lucide-react";

interface AirportSuggestion {
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

export function HeroSearchWidget() {
  const router = useRouter();

  // Search State
  const [tripType, setTripType] = useState<"ROUND_TRIP" | "ONE_WAY" | "MULTI_CITY">("ROUND_TRIP");
  const [origin, setOrigin] = useState({ iata: "JFK", city: "New York", name: "John F. Kennedy Intl", country: "United States" });
  const [destination, setDestination] = useState({ iata: "LHR", city: "London", name: "London Heathrow", country: "United Kingdom" });
  const [departureDate, setDepartureDate] = useState("2026-09-05");
  const [returnDate, setReturnDate] = useState("2026-09-12");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("ECONOMY");
  const [directOnly, setDirectOnly] = useState(true);

  // Dropdown UI States
  const [openTripDropdown, setOpenTripDropdown] = useState(false);
  const [openPassengerDropdown, setOpenPassengerDropdown] = useState(false);
  const [openCabinDropdown, setOpenCabinDropdown] = useState(false);
  const [openOriginModal, setOpenOriginModal] = useState(false);
  const [openDestModal, setOpenDestModal] = useState(false);

  const [originQuery, setOriginQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AirportSuggestion[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenTripDropdown(false);
        setOpenPassengerDropdown(false);
        setOpenCabinDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultAirports: AirportSuggestion[] = [
    { iataCode: "JFK", city: "New York", name: "John F. Kennedy Intl", country: "United States" },
    { iataCode: "LHR", city: "London", name: "London Heathrow", country: "United Kingdom" },
    { iataCode: "HND", city: "Tokyo", name: "Tokyo Haneda Airport", country: "Japan" },
    { iataCode: "SIN", city: "Singapore", name: "Singapore Changi Airport", country: "Singapore" },
    { iataCode: "DXB", city: "Dubai", name: "Dubai International", country: "United Arab Emirates" },
    { iataCode: "SFO", city: "San Francisco", name: "San Francisco Intl", country: "United States" },
    { iataCode: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
    { iataCode: "LAX", city: "Los Angeles", name: "Los Angeles Intl", country: "United States" },
  ];

  const fetchSuggestions = async (query: string) => {
    if (!query || query.trim().length < 1) {
      setSuggestions(defaultAirports);
      return;
    }
    try {
      const res = await fetch(`/api/airports/autocomplete?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.airports && data.airports.length > 0) {
        setSuggestions(data.airports);
      } else {
        setSuggestions(
          defaultAirports.filter(
            (a) =>
              a.city.toLowerCase().includes(query.toLowerCase()) ||
              a.iataCode.toLowerCase().includes(query.toLowerCase()) ||
              a.name.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
    } catch {
      setSuggestions(defaultAirports);
    }
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("from", origin.iata);
    params.set("to", destination.iata);
    params.set("departure", departureDate);
    if (tripType === "ROUND_TRIP") params.set("return", returnDate);
    params.set("passengers", passengers.toString());
    params.set("class", cabinClass);
    if (directOnly) params.set("stops", "0");

    router.push(`/search?${params.toString()}`);
  };

  // Format date helper for display
  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T12:00:00Z");
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Immersive Aviation Command Console Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-zinc-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] p-6 sm:p-8 relative z-20 overflow-hidden">
        {/* Ambient Top Glow Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600" />

        {/* Top Control Bar */}
        <div ref={dropdownRef} className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-zinc-100 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {/* Trip Type Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setOpenTripDropdown(!openTripDropdown);
                  setOpenPassengerDropdown(false);
                  setOpenCabinDropdown(false);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/80 text-xs font-bold text-zinc-800 transition-all cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                <span>{tripType === "ROUND_TRIP" ? "Round trip" : tripType === "ONE_WAY" ? "One way" : "Multi-city"}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {openTripDropdown && (
                <div className="absolute left-0 mt-1.5 w-40 bg-white rounded-2xl border border-zinc-200 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                  {[
                    { id: "ROUND_TRIP", label: "Round trip" },
                    { id: "ONE_WAY", label: "One way" },
                    { id: "MULTI_CITY", label: "Multi-city" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTripType(t.id as typeof tripType);
                        setOpenTripDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                        tripType === t.id ? "text-blue-600 bg-blue-50/60 font-bold" : "text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <span>{t.label}</span>
                      {tripType === t.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Passenger Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setOpenPassengerDropdown(!openPassengerDropdown);
                  setOpenTripDropdown(false);
                  setOpenCabinDropdown(false);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/80 text-xs font-bold text-zinc-800 transition-all cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-zinc-600" />
                <span>{passengers} {passengers === 1 ? "Traveler" : "Travelers"}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {openPassengerDropdown && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-2xl border border-zinc-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-xs font-bold text-zinc-900 mb-3">Passenger Count</div>
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Adults</div>
                      <div className="text-[10px] text-zinc-400">Age 12+</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={passengers <= 1}
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-xs w-4 text-center">{passengers}</span>
                      <button
                        type="button"
                        disabled={passengers >= 9}
                        onClick={() => setPassengers(Math.min(9, passengers + 1))}
                        className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cabin Class Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setOpenCabinDropdown(!openCabinDropdown);
                  setOpenTripDropdown(false);
                  setOpenPassengerDropdown(false);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/80 text-xs font-bold text-zinc-800 transition-all cursor-pointer"
              >
                <span>{cabinClass.replace("_", " ")}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {openCabinDropdown && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-2xl border border-zinc-200 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                  {[
                    { id: "ECONOMY", label: "Economy Standard" },
                    { id: "PREMIUM_ECONOMY", label: "Premium Economy" },
                    { id: "BUSINESS", label: "Business Suite" },
                    { id: "FIRST", label: "First Class Sky" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCabinClass(c.id);
                        setOpenCabinDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                        cabinClass === c.id ? "text-blue-600 bg-blue-50/60 font-bold" : "text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <span>{c.label}</span>
                      {cabinClass === c.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Live GDS Feed Status Pill */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-zinc-500 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GDS Live Feed: <strong className="text-zinc-900">2,928 Scheduled Flights</strong></span>
          </div>
        </div>

        {/* The Core Flight Airway Bar */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            {/* Connected Route Segment (Origin & Destination) */}
            <div className="lg:col-span-6 bg-zinc-50 border border-zinc-200/90 rounded-2xl p-2 flex flex-col sm:flex-row items-center gap-2 relative">
              {/* Origin Block */}
              <div
                onClick={() => {
                  setOpenOriginModal(true);
                  fetchSuggestions(originQuery);
                }}
                className="flex-1 w-full p-3 bg-white hover:bg-zinc-50/80 border border-zinc-200/80 rounded-xl cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <Plane className="w-4 h-4 -rotate-45" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Departure</div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-lg font-black text-zinc-950 tracking-tight">{origin.iata}</span>
                    <span className="text-xs font-bold text-zinc-700 truncate">{origin.city}</span>
                  </div>
                </div>
              </div>

              {/* Center Interactive Airway Swap Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwap();
                }}
                className="w-8 h-8 rounded-full bg-zinc-950 hover:bg-blue-600 text-white shadow-sm flex items-center justify-center shrink-0 transition-transform active:rotate-180 cursor-pointer"
                title="Swap Departure and Destination"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>

              {/* Destination Block */}
              <div
                onClick={() => {
                  setOpenDestModal(true);
                  fetchSuggestions(destQuery);
                }}
                className="flex-1 w-full p-3 bg-white hover:bg-zinc-50/80 border border-zinc-200/80 rounded-xl cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center font-bold shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Arrival</div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-lg font-black text-zinc-950 tracking-tight">{destination.iata}</span>
                    <span className="text-xs font-bold text-zinc-700 truncate">{destination.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Departure & Return Dates */}
            <div className="lg:col-span-4 bg-zinc-50 border border-zinc-200/90 rounded-2xl p-2 grid grid-cols-2 gap-2">
              {/* Departure Date */}
              <div className="p-3 bg-white border border-zinc-200/80 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-600" /> Departure
                </div>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-transparent mt-1 text-xs sm:text-sm font-black text-zinc-950 outline-hidden cursor-pointer"
                />
              </div>

              {/* Return Date */}
              <div className={`p-3 bg-white border border-zinc-200/80 rounded-xl ${tripType === "ONE_WAY" ? "opacity-30 pointer-events-none" : ""}`}>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-500" /> Return
                </div>
                <input
                  type="date"
                  disabled={tripType === "ONE_WAY"}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent mt-1 text-xs sm:text-sm font-black text-zinc-950 outline-hidden cursor-pointer"
                />
              </div>
            </div>

            {/* Action Search CTA */}
            <div className="lg:col-span-2 flex items-stretch">
              <button
                type="submit"
                className="w-full h-full min-h-[60px] px-6 bg-zinc-950 hover:bg-blue-600 text-white font-extrabold text-xs tracking-wide uppercase rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
              >
                <span>Search Flights</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </form>

        {/* Bottom Intelligence & Fare Trends Strip */}
        <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Quick Route Shortcuts with Live Fares */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" /> Direct Deals:
            </span>
            {[
              { from: "JFK", fromCity: "New York", to: "LHR", toCity: "London", fare: "$420" },
              { from: "SFO", fromCity: "San Francisco", to: "HND", toCity: "Tokyo", fare: "$680" },
              { from: "DXB", fromCity: "Dubai", to: "SIN", toCity: "Singapore", fare: "$540" },
              { from: "LHR", fromCity: "London", to: "CDG", toCity: "Paris", fare: "$140" },
            ].map((r, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setOrigin({ iata: r.from, city: r.fromCity, name: `${r.fromCity} International`, country: "" });
                  setDestination({ iata: r.to, city: r.toCity, name: `${r.toCity} International`, country: "" });
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{r.fromCity} → {r.toCity}</span>
                <span className="font-mono font-bold text-blue-600 text-[11px]">{r.fare}</span>
              </button>
            ))}
          </div>

          {/* Quick Direct-Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-600 font-medium text-xs">
            <input
              type="checkbox"
              checked={directOnly}
              onChange={(e) => setDirectOnly(e.target.checked)}
              className="w-4 h-4 rounded-md accent-blue-600 cursor-pointer"
            />
            <span>Direct flights only</span>
          </label>
        </div>
      </div>

      {/* Origin Airport Autocomplete Modal */}
      {openOriginModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="text-sm font-bold text-zinc-900">Select Origin Airport</div>
              <button
                type="button"
                onClick={() => setOpenOriginModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search city, airport name, or IATA code..."
                value={originQuery}
                onChange={(e) => {
                  setOriginQuery(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1">
              {suggestions.map((item) => (
                <div
                  key={item.iataCode}
                  onClick={() => {
                    setOrigin({ iata: item.iataCode, city: item.city, name: item.name, country: item.country });
                    setOpenOriginModal(false);
                    setOriginQuery("");
                  }}
                  className="p-3 rounded-xl hover:bg-zinc-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-zinc-900">
                      {item.city}, {item.country}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{item.name}</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200">
                    {item.iataCode}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Destination Airport Autocomplete Modal */}
      {openDestModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="text-sm font-bold text-zinc-900">Select Destination Airport</div>
              <button
                type="button"
                onClick={() => setOpenDestModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search city, airport name, or IATA code..."
                value={destQuery}
                onChange={(e) => {
                  setDestQuery(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1">
              {suggestions.map((item) => (
                <div
                  key={item.iataCode}
                  onClick={() => {
                    setDestination({ iata: item.iataCode, city: item.city, name: item.name, country: item.country });
                    setOpenDestModal(false);
                    setDestQuery("");
                  }}
                  className="p-3 rounded-xl hover:bg-zinc-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-zinc-900">
                      {item.city}, {item.country}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{item.name}</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200">
                    {item.iataCode}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
