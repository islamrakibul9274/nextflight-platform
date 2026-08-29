"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Calendar,
  Users,
  ArrowRightLeft,
  Search,
  Sparkles,
  ChevronDown,
  MapPin,
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

  // Autocomplete UI Dropdowns
  const [openOriginDropdown, setOpenOriginDropdown] = useState(false);
  const [openDestDropdown, setOpenDestDropdown] = useState(false);
  const [openPassengerDropdown, setOpenPassengerDropdown] = useState(false);
  const [originQuery, setOriginQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AirportSuggestion[]>([]);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const passRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setOpenOriginDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setOpenDestDropdown(false);
      }
      if (passRef.current && !passRef.current.contains(event.target as Node)) {
        setOpenPassengerDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 1) {
      setSuggestions([
        { iataCode: "JFK", city: "New York", name: "John F. Kennedy Intl", country: "United States" },
        { iataCode: "LHR", city: "London", name: "London Heathrow", country: "United Kingdom" },
        { iataCode: "HND", city: "Tokyo", name: "Tokyo Haneda Airport", country: "Japan" },
        { iataCode: "SIN", city: "Singapore", name: "Singapore Changi Airport", country: "Singapore" },
        { iataCode: "DXB", city: "Dubai", name: "Dubai International", country: "United Arab Emirates" },
        { iataCode: "SFO", city: "San Francisco", name: "San Francisco Intl", country: "United States" },
        { iataCode: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
      ]);
      return;
    }
    try {
      const res = await fetch(`/api/airports/autocomplete?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.airports) {
        setSuggestions(data.airports);
      }
    } catch {
      // fallback
    }
  };

  const handleSwapAirports = () => {
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-float-clean relative z-20">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-100 mb-6">
          {/* Trip Type Tabs */}
          <div className="inline-flex p-1 bg-zinc-100 rounded-xl">
            {[
              { id: "ROUND_TRIP", label: "Round trip" },
              { id: "ONE_WAY", label: "One way" },
              { id: "MULTI_CITY", label: "Multi-city" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTripType(t.id as typeof tripType)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tripType === t.id
                    ? "bg-white text-zinc-950 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Passenger & Cabin Dropdown Controls */}
          <div className="flex items-center gap-2.5" ref={passRef}>
            {/* Passenger Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenPassengerDropdown(!openPassengerDropdown)}
                className="px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold transition-all flex items-center gap-2"
              >
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <span>{passengers} {passengers === 1 ? "Traveler" : "Travelers"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {openPassengerDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-zinc-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-xs font-bold text-zinc-900 mb-3">Select Passengers</div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <div>
                      <div className="text-xs font-semibold text-zinc-800">Adults</div>
                      <div className="text-[10px] text-zinc-400">Age 12+</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={passengers <= 1}
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center font-bold text-xs disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="font-bold text-xs w-4 text-center">{passengers}</span>
                      <button
                        type="button"
                        disabled={passengers >= 9}
                        onClick={() => setPassengers(Math.min(9, passengers + 1))}
                        className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center font-bold text-xs disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cabin Class Selector */}
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold transition-all outline-hidden cursor-pointer"
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business Class</option>
              <option value="FIRST">First Class</option>
            </select>
          </div>
        </div>

        {/* Search Inputs Matrix */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Origin & Destination Segment */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
            {/* Origin Input */}
            <div
              ref={originRef}
              onClick={() => {
                setOpenOriginDropdown(true);
                fetchSuggestions(originQuery);
              }}
              className="p-3.5 rounded-2xl bg-zinc-50/80 hover:bg-zinc-100/90 border border-zinc-200 cursor-pointer transition-all relative"
            >
              <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1.5">
                <Plane className="w-3 h-3 text-blue-600 -rotate-45" /> Where From?
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-bold text-zinc-950 truncate">
                  {origin.city}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-200 text-zinc-800 font-mono text-xs font-bold">
                  {origin.iata}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 truncate mt-0.5">{origin.name}</div>

              {/* Origin Dropdown */}
              {openOriginDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl border border-zinc-200 shadow-2xl p-3 z-50"
                >
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search origin city or airport..."
                      value={originQuery}
                      onChange={(e) => {
                        setOriginQuery(e.target.value);
                        fetchSuggestions(e.target.value);
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:bg-white outline-hidden"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {suggestions.map((item) => (
                      <div
                        key={item.iataCode}
                        onClick={() => {
                          setOrigin({ iata: item.iataCode, city: item.city, name: item.name });
                          setOpenOriginDropdown(false);
                          setOriginQuery("");
                        }}
                        className="p-2.5 rounded-xl hover:bg-zinc-50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-zinc-900">
                            {item.city}, {item.country}
                          </div>
                          <div className="text-[10px] text-zinc-400">{item.name}</div>
                        </div>
                        <span className="font-mono text-xs font-bold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                          {item.iataCode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSwapAirports();
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 shadow-2xs flex items-center justify-center text-zinc-600 hover:text-zinc-900 z-10 transition-transform active:rotate-180"
              title="Swap Departure and Destination"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>

            {/* Destination Input */}
            <div
              ref={destRef}
              onClick={() => {
                setOpenDestDropdown(true);
                fetchSuggestions(destQuery);
              }}
              className="p-3.5 rounded-2xl bg-zinc-50/80 hover:bg-zinc-100/90 border border-zinc-200 cursor-pointer transition-all relative"
            >
              <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-zinc-700" /> Where To?
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-bold text-zinc-950 truncate">
                  {destination.city}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-200 text-zinc-800 font-mono text-xs font-bold">
                  {destination.iata}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 truncate mt-0.5">{destination.name}</div>

              {/* Destination Dropdown */}
              {openDestDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-zinc-200 shadow-2xl p-3 z-50"
                >
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search destination city or airport..."
                      value={destQuery}
                      onChange={(e) => {
                        setDestQuery(e.target.value);
                        fetchSuggestions(e.target.value);
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:bg-white outline-hidden"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {suggestions.map((item) => (
                      <div
                        key={item.iataCode}
                        onClick={() => {
                          setDestination({ iata: item.iataCode, city: item.city, name: item.name });
                          setOpenDestDropdown(false);
                          setDestQuery("");
                        }}
                        className="p-2.5 rounded-xl hover:bg-zinc-50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-zinc-900">
                            {item.city}, {item.country}
                          </div>
                          <div className="text-[10px] text-zinc-400">{item.name}</div>
                        </div>
                        <span className="font-mono text-xs font-bold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                          {item.iataCode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates Segment */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-2">
            <div className="p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200">
              <label className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3 h-3 text-zinc-500" /> Departure
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-zinc-900 outline-hidden cursor-pointer"
              />
            </div>

            <div className={`p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200 ${tripType === "ONE_WAY" ? "opacity-50 pointer-events-none" : ""}`}>
              <label className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3 h-3 text-zinc-500" /> Return
              </label>
              <input
                type="date"
                disabled={tripType === "ONE_WAY"}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-zinc-900 outline-hidden cursor-pointer"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-2 flex items-stretch">
            <button
              type="submit"
              className="w-full h-full min-h-[58px] px-6 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Popular Quick Route Tags */}
        <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-zinc-500" /> Popular:
          </span>
          {[
            { from: "JFK", fromCity: "New York", to: "LHR", toCity: "London" },
            { from: "SFO", fromCity: "San Francisco", to: "HND", toCity: "Tokyo" },
            { from: "DXB", fromCity: "Dubai", to: "SIN", toCity: "Singapore" },
            { from: "LHR", fromCity: "London", to: "CDG", toCity: "Paris" },
          ].map((r, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setOrigin({ iata: r.from, city: r.fromCity, name: `${r.fromCity} International` });
                setDestination({ iata: r.to, city: r.toCity, name: `${r.toCity} International` });
              }}
              className="px-3 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors"
            >
              {r.fromCity} → {r.toCity}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
