"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  PlaneTakeoff,
  PlaneLanding,
  ArrowRightLeft,
  Calendar,
  Users,
  ChevronDown,
  Search,
  Check,
  Building2,
  Sparkles,
} from "lucide-react";

interface AirportOption {
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

export function HeroSearchWidget() {
  const router = useRouter();

  // Search state
  const [tripType, setTripType] = useState<"ROUND_TRIP" | "ONE_WAY" | "MULTI_CITY">("ROUND_TRIP");
  const [cabinClass, setCabinClass] = useState<string>("ECONOMY");

  const [origin, setOrigin] = useState<AirportOption>({
    iataCode: "JFK",
    name: "John F. Kennedy International",
    city: "New York",
    country: "United States",
  });

  const [destination, setDestination] = useState<AirportOption>({
    iataCode: "LHR",
    name: "London Heathrow",
    city: "London",
    country: "United Kingdom",
  });

  // Calculate default dates (departure in 5 days, return in 12 days)
  const defaultDepDate = new Date();
  defaultDepDate.setDate(defaultDepDate.getDate() + 5);
  const defaultRetDate = new Date();
  defaultRetDate.setDate(defaultRetDate.getDate() + 12);

  const [departureDate, setDepartureDate] = useState(defaultDepDate.toISOString().split("T")[0]);
  const [returnDate, setReturnDate] = useState(defaultRetDate.toISOString().split("T")[0]);

  // Passengers
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [showCabinModal, setShowCabinModal] = useState(false);

  // Autocomplete modals
  const [activeAirportField, setActiveAirportField] = useState<"origin" | "destination" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [airportsList, setAirportsList] = useState<AirportOption[]>([]);
  const [searchingAirports, setSearchingAirports] = useState(false);

  const totalPassengers = adults + children + infants;

  // Search airports
  useEffect(() => {
    if (!activeAirportField) return;

    const timer = setTimeout(async () => {
      setSearchingAirports(true);
      try {
        const res = await fetch(`/api/airports/autocomplete?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.airports) {
          setAirportsList(data.airports);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSearchingAirports(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, activeAirportField]);

  // Swap origin and destination
  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // Submit search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: origin.iataCode,
      to: destination.iataCode,
      date: departureDate,
      tripType,
      cabin: cabinClass,
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
    });

    if (tripType === "ROUND_TRIP" && returnDate) {
      params.append("returnDate", returnDate);
    }

    router.push(`/search?${params.toString()}`);
  };

  const passengerModalRef = useRef<HTMLDivElement>(null);
  const cabinModalRef = useRef<HTMLDivElement>(null);

  // Close modals on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (passengerModalRef.current && !passengerModalRef.current.contains(event.target as Node)) {
        setShowPassengerModal(false);
      }
      if (cabinModalRef.current && !cabinModalRef.current.contains(event.target as Node)) {
        setShowCabinModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto z-20">
      {/* Container with premium white glassmorphism card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12)] p-4 sm:p-6 transition-all duration-300">
        {/* Top Controls Row (Trip Type, Cabin, Passengers) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          {/* Trip Type Tabs */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl">
            {(
              [
                { id: "ROUND_TRIP", label: "Round trip" },
                { id: "ONE_WAY", label: "One way" },
                { id: "MULTI_CITY", label: "Multi-city" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTripType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tripType === tab.id
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Passengers & Cabin Dropdowns */}
          <div className="flex items-center gap-2">
            {/* Passengers dropdown */}
            <div className="relative" ref={passengerModalRef}>
              <button
                type="button"
                onClick={() => setShowPassengerModal(!showPassengerModal)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 text-xs font-medium text-slate-700 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-sky-600" />
                <span>
                  {totalPassengers} Traveler{totalPassengers > 1 ? "s" : ""}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showPassengerModal && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-900">Adults</div>
                        <div className="text-[10px] text-slate-500">Age 12+</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 text-sm font-semibold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(Math.min(9, adults + 1))}
                          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 text-sm font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-900">Children</div>
                        <div className="text-[10px] text-slate-500">Age 2-11</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 text-sm font-semibold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{children}</span>
                        <button
                          type="button"
                          onClick={() => setChildren(Math.min(6, children + 1))}
                          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 text-sm font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-900">Infants</div>
                        <div className="text-[10px] text-slate-500">Under 2 (on lap)</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setInfants(Math.max(0, infants - 1))}
                          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 text-sm font-semibold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{infants}</span>
                        <button
                          type="button"
                          onClick={() => setInfants(Math.min(adults, infants + 1))}
                          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 text-sm font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPassengerModal(false)}
                      className="w-full mt-2 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cabin dropdown */}
            <div className="relative" ref={cabinModalRef}>
              <button
                type="button"
                onClick={() => setShowCabinModal(!showCabinModal)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 text-xs font-medium text-slate-700 transition-colors"
              >
                <span>{cabinClass.replace("_", " ")}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCabinModal && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
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
                        setShowCabinModal(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>{c.label}</span>
                      {cabinClass === c.id && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Search Inputs Grid */}
        <form onSubmit={handleSearch} className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
            {/* Origin & Destination Block */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
              {/* Origin */}
              <div
                onClick={() => {
                  setActiveAirportField("origin");
                  setSearchQuery("");
                }}
                className="cursor-pointer p-3 rounded-xl border border-slate-200/90 hover:border-sky-500 bg-slate-50/50 hover:bg-white transition-all group relative"
              >
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  <PlaneTakeoff className="w-3.5 h-3.5 text-sky-600 group-hover:text-sky-600" />
                  <span>Where from?</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-900">{origin.city}</span>
                  <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                    {origin.iataCode}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">{origin.name}</div>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwap();
                }}
                className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-slate-200 hover:border-sky-500 shadow-2xs items-center justify-center text-slate-600 hover:text-sky-600 z-10 transition-all hover:scale-110 active:rotate-180"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>

              {/* Destination */}
              <div
                onClick={() => {
                  setActiveAirportField("destination");
                  setSearchQuery("");
                }}
                className="cursor-pointer p-3 rounded-xl border border-slate-200/90 hover:border-sky-500 bg-slate-50/50 hover:bg-white transition-all group relative"
              >
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  <PlaneLanding className="w-3.5 h-3.5 text-sky-600 group-hover:text-sky-600" />
                  <span>Where to?</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-900">{destination.city}</span>
                  <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                    {destination.iataCode}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">{destination.name}</div>
              </div>
            </div>

            {/* Dates Block */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-2">
              {/* Departure */}
              <div className="p-3 rounded-xl border border-slate-200/90 hover:border-sky-500 bg-slate-50/50 hover:bg-white transition-all">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Departure</span>
                </div>
                <input
                  type="date"
                  value={departureDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full mt-1 bg-transparent text-sm font-bold text-slate-900 outline-hidden cursor-pointer"
                />
              </div>

              {/* Return (disabled if one way) */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  tripType === "ONE_WAY"
                    ? "opacity-40 bg-slate-100/60 border-slate-200 cursor-not-allowed"
                    : "border-slate-200/90 hover:border-sky-500 bg-slate-50/50 hover:bg-white cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Return</span>
                </div>
                <input
                  type="date"
                  disabled={tripType === "ONE_WAY"}
                  value={returnDate}
                  min={departureDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full mt-1 bg-transparent text-sm font-bold text-slate-900 outline-hidden cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Search CTA Button */}
            <div className="lg:col-span-3">
              <button
                type="submit"
                className="w-full h-full min-h-[56px] px-6 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-semibold text-sm shadow-md hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Search Flights</span>
              </button>
            </div>
          </div>
        </form>

        {/* Airport Autocomplete Modal Dialog */}
        {activeAirportField && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Select {activeAirportField === "origin" ? "Departure" : "Arrival"} Airport
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveAirportField(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1"
                >
                  Esc
                </button>
              </div>

              {/* Search input */}
              <div className="mt-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search city, country, or 3-letter IATA code (e.g. JFK, London, Tokyo)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:border-sky-500 focus:bg-white transition-all"
                />
              </div>

              {/* Airport list */}
              <div className="mt-4 max-h-64 overflow-y-auto space-y-1 pr-1">
                {searchingAirports ? (
                  <div className="py-8 text-center text-xs text-slate-400 font-medium animate-pulse">
                    Scanning global aeronautical registry...
                  </div>
                ) : airportsList.length > 0 ? (
                  airportsList.map((apt) => (
                    <button
                      key={apt.iataCode}
                      type="button"
                      onClick={() => {
                        if (activeAirportField === "origin") setOrigin(apt);
                        else setDestination(apt);
                        setActiveAirportField(null);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-sky-50/80 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-sky-700">
                          {apt.city}, {apt.country}
                        </div>
                        <div className="text-xs text-slate-500">{apt.name}</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700 group-hover:text-sky-600 bg-slate-100 group-hover:bg-white px-2 py-1 rounded-md border border-slate-200">
                        {apt.iataCode}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No matching airports found. Try typing &apos;JFK&apos;, &apos;LHR&apos;, &apos;Tokyo&apos;, or &apos;Singapore&apos;.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Route Shortcuts Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-500" /> Popular:
          </span>
          {[
            { label: "New York → London", from: "JFK", to: "LHR" },
            { label: "San Francisco → Tokyo", from: "SFO", to: "HND" },
            { label: "Dubai → Singapore", from: "DXB", to: "SIN" },
            { label: "Paris → New York", from: "CDG", to: "JFK" },
          ].map((route) => (
            <button
              key={route.label}
              type="button"
              onClick={() => {
                setOrigin({
                  iataCode: route.from,
                  city: route.label.split(" → ")[0],
                  name: `${route.from} Airport`,
                  country: "Global",
                });
                setDestination({
                  iataCode: route.to,
                  city: route.label.split(" → ")[1],
                  name: `${route.to} Airport`,
                  country: "Global",
                });
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-sky-50 hover:text-sky-700 border border-slate-200/70 transition-colors font-medium"
            >
              {route.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
