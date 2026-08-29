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
  const [origin, setOrigin] = useState({ iata: "JFK", city: "New York", name: "John F. Kennedy Intl" });
  const [destination, setDestination] = useState({ iata: "LHR", city: "London", name: "London Heathrow" });
  const [departureDate, setDepartureDate] = useState("2026-09-05");
  const [returnDate, setReturnDate] = useState("2026-09-12");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("ECONOMY");

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

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Google Flights-Style Unified Search Console */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-5 sm:p-7 relative z-20">
        {/* Top Filter Chips */}
        <div ref={dropdownRef} className="flex flex-wrap items-center gap-2 mb-4">
          {/* Trip Type Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenTripDropdown(!openTripDropdown);
                setOpenPassengerDropdown(false);
                setOpenCabinDropdown(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-zinc-500" />
              <span>{tripType === "ROUND_TRIP" ? "Round trip" : tripType === "ONE_WAY" ? "One way" : "Multi-city"}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {openTripDropdown && (
              <div className="absolute left-0 mt-1 w-36 bg-white rounded-xl border border-zinc-200 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
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
                    className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                      tripType === t.id ? "text-blue-600 bg-blue-50/50" : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <span>{t.label}</span>
                    {tripType === t.id && <Check className="w-3 h-3" />}
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-zinc-500" />
              <span>{passengers} {passengers === 1 ? "passenger" : "passengers"}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {openPassengerDropdown && (
              <div className="absolute left-0 mt-1 w-64 bg-white rounded-2xl border border-zinc-200 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between py-1">
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Adults</div>
                    <div className="text-[11px] text-zinc-500">Age 12+</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={passengers <= 1}
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center font-bold text-xs disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs w-4 text-center">{passengers}</span>
                    <button
                      type="button"
                      disabled={passengers >= 9}
                      onClick={() => setPassengers(Math.min(9, passengers + 1))}
                      className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center font-bold text-xs disabled:opacity-30"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <span>{cabinClass.replace("_", " ")}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {openCabinDropdown && (
              <div className="absolute left-0 mt-1 w-44 bg-white rounded-xl border border-zinc-200 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                {[
                  { id: "ECONOMY", label: "Economy" },
                  { id: "PREMIUM_ECONOMY", label: "Premium Economy" },
                  { id: "BUSINESS", label: "Business Class" },
                  { id: "FIRST", label: "First Class" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCabinClass(c.id);
                      setOpenCabinDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                      cabinClass === c.id ? "text-blue-600 bg-blue-50/50" : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <span>{c.label}</span>
                    {cabinClass === c.id && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Inputs Capsule Row */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-12 gap-2">
          {/* Origin & Destination Pair */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
            {/* Origin Button */}
            <div
              onClick={() => {
                setOpenOriginModal(true);
                fetchSuggestions(originQuery);
              }}
              className="p-3 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/90 rounded-xl cursor-pointer transition-all flex items-center gap-3"
            >
              <Plane className="w-4 h-4 text-zinc-500 shrink-0 -rotate-45" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase font-bold text-zinc-400">Where from?</div>
                <div className="text-sm font-bold text-zinc-900 truncate">
                  {origin.city} <span className="font-mono text-xs text-zinc-500 font-semibold">({origin.iata})</span>
                </div>
              </div>
            </div>

            {/* Middle Swap Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSwap();
              }}
              className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 shadow-2xs items-center justify-center text-zinc-600 hover:text-zinc-900 z-10 transition-transform active:rotate-180"
              title="Swap Origin & Destination"
            >
              <ArrowRightLeft className="w-3 h-3" />
            </button>

            {/* Destination Button */}
            <div
              onClick={() => {
                setOpenDestModal(true);
                fetchSuggestions(destQuery);
              }}
              className="p-3 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/90 rounded-xl cursor-pointer transition-all flex items-center gap-3"
            >
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase font-bold text-zinc-400">Where to?</div>
                <div className="text-sm font-bold text-zinc-900 truncate">
                  {destination.city} <span className="font-mono text-xs text-zinc-500 font-semibold">({destination.iata})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dates Pair */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-2">
            {/* Departure */}
            <div className="p-3 bg-zinc-50 border border-zinc-200/90 rounded-xl">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Departure</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 outline-hidden cursor-pointer"
              />
            </div>

            {/* Return */}
            <div className={`p-3 bg-zinc-50 border border-zinc-200/90 rounded-xl ${tripType === "ONE_WAY" ? "opacity-40 pointer-events-none" : ""}`}>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Return</label>
              <input
                type="date"
                disabled={tripType === "ONE_WAY"}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 outline-hidden cursor-pointer"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full h-full min-h-[50px] px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Search className="w-4 h-4" />
              <span>Explore Flights</span>
            </button>
          </div>
        </form>

        {/* Quick Popular Route Pills with Live Prices */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" /> Popular:
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
                setOrigin({ iata: r.from, city: r.fromCity, name: `${r.fromCity} International` });
                setDestination({ iata: r.to, city: r.toCity, name: `${r.toCity} International` });
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <span>{r.fromCity} → {r.toCity}</span>
              <span className="font-mono font-bold text-blue-600 text-[11px]">{r.fare}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Origin Airport Modal */}
      {openOriginModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-md w-full p-4 space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="text-xs font-bold text-zinc-900">Select Origin Airport</div>
              <button
                type="button"
                onClick={() => setOpenOriginModal(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search city, airport name, or IATA code..."
                value={originQuery}
                onChange={(e) => {
                  setOriginQuery(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1">
              {suggestions.map((item) => (
                <div
                  key={item.iataCode}
                  onClick={() => {
                    setOrigin({ iata: item.iataCode, city: item.city, name: item.name });
                    setOpenOriginModal(false);
                    setOriginQuery("");
                  }}
                  className="p-2.5 rounded-xl hover:bg-zinc-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-zinc-900">
                      {item.city}, {item.country}
                    </div>
                    <div className="text-[11px] text-zinc-400">{item.name}</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                    {item.iataCode}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Destination Airport Modal */}
      {openDestModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-md w-full p-4 space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="text-xs font-bold text-zinc-900">Select Destination Airport</div>
              <button
                type="button"
                onClick={() => setOpenDestModal(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search city, airport name, or IATA code..."
                value={destQuery}
                onChange={(e) => {
                  setDestQuery(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1">
              {suggestions.map((item) => (
                <div
                  key={item.iataCode}
                  onClick={() => {
                    setDestination({ iata: item.iataCode, city: item.city, name: item.name });
                    setOpenDestModal(false);
                    setDestQuery("");
                  }}
                  className="p-2.5 rounded-xl hover:bg-zinc-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-zinc-900">
                      {item.city}, {item.country}
                    </div>
                    <div className="text-[11px] text-zinc-400">{item.name}</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
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
