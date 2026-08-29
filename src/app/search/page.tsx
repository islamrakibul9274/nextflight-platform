"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FlightCard, FlightItem } from "@/components/search/FlightCard";
import { FlightFilterSidebar } from "@/components/search/FlightFilterSidebar";
import { FlightSortHeader } from "@/components/search/FlightSortHeader";
import { FlexibleDateMatrix } from "@/components/search/FlexibleDateMatrix";
import {
  Plane,
  ArrowRightLeft,
  Calendar,
  Users,
  Search,
  Filter,
  X,
  MapPin,
  ChevronDown,
} from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search query state
  const [from, setFrom] = useState(searchParams.get("from") || "JFK");
  const [to, setTo] = useState(searchParams.get("to") || "LHR");
  const [date, setDate] = useState(
    searchParams.get("date") ||
      new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0]
  );
  const [cabin, setCabin] = useState(searchParams.get("cabin") || "ECONOMY");
  const [passengers, setPassengers] = useState(
    Number(searchParams.get("passengers") || searchParams.get("adults") || 1)
  );

  // Sorting & Filtering
  const [sortBy, setSortBy] = useState("recommended");
  const [filters, setFilters] = useState({
    stops: "all",
    maxPrice: 2500,
    timeWindow: "all",
    selectedAirlines: [] as string[],
    refundableOnly: false,
  });

  // Results state
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableAirlines, setAvailableAirlines] = useState<
    Record<string, { name: string; count: number; logo: string }>
  >({});
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [dateMatrix, setDateMatrix] = useState<
    Array<{ date: string; minPrice: number; formattedDate: string }>
  >([]);
  const [routeInfo, setRouteInfo] = useState<{
    origin?: { city: string; name: string };
    destination?: { city: string; name: string };
  }>({});

  // Mobile filters drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch flights
  const fetchFlights = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        from,
        to,
        date,
        cabin,
        stops: filters.stops,
        sort: sortBy,
        timeWindow: filters.timeWindow,
        refundable: filters.refundableOnly ? "true" : "false",
      });

      if (filters.selectedAirlines.length > 0) {
        q.append("airlines", filters.selectedAirlines.join(","));
      }

      if (filters.maxPrice) {
        q.append("maxPrice", filters.maxPrice.toString());
      }

      const res = await fetch(`/api/flights/search?${q.toString()}`);
      const data = await res.json();

      if (data.flights) {
        setFlights(data.flights);
      }
      if (data.filters) {
        setAvailableAirlines(data.filters.airlines || {});
        setMinPrice(data.filters.minPrice || 200);
        setMaxPrice(data.filters.maxPrice || 3000);
        if (filters.maxPrice === 2500 && data.filters.maxPrice) {
          setFilters((prev) => ({ ...prev, maxPrice: data.filters.maxPrice }));
        }
      }
      if (data.dateMatrix) {
        setDateMatrix(data.dateMatrix);
      }
      if (data.routeInfo) {
        setRouteInfo(data.routeInfo);
      }
    } catch (e) {
      console.error("Flight search fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [from, to, date, cabin, filters, sortBy]);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const handleSwapAirports = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleDateChangeFromMatrix = (newDate: string) => {
    setDate(newDate);
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", newDate);
    router.push(`/search?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", from);
    params.set("to", to);
    params.set("date", date);
    params.set("cabin", cabin);
    params.set("passengers", passengers.toString());
    router.push(`/search?${params.toString()}`);
    fetchFlights();
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Search Bar Card — Perfectly Aligned & Justified */}
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4 sm:p-5 mb-8">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            {/* Top Row: Mini Selectors */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-semibold">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <select
                  id="search-passengers-select"
                  name="passengers"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="bg-transparent font-bold outline-hidden cursor-pointer"
                >
                  <option value={1}>1 Traveler</option>
                  <option value={2}>2 Travelers</option>
                  <option value={3}>3 Travelers</option>
                  <option value={4}>4 Travelers</option>
                  <option value={5}>5+ Travelers</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-semibold">
                <select
                  id="search-cabin-select"
                  name="cabin"
                  value={cabin}
                  onChange={(e) => setCabin(e.target.value)}
                  className="bg-transparent font-bold outline-hidden cursor-pointer"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business Class</option>
                  <option value="FIRST">First Class</option>
                </select>
              </div>
            </div>

            {/* Inputs Row — Pixel-Perfect Aligned Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
              {/* Departure & Arrival Connected Capsule (6 cols) */}
              <div className="lg:col-span-6">
                <label className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider mb-1">
                  Flight Route (From → To)
                </label>
                <div className="h-[52px] bg-zinc-50 border border-zinc-200/90 rounded-2xl p-1.5 flex items-center gap-1.5 relative">
                  {/* Departure (From) */}
                  <div className="flex-1 h-full flex items-center gap-2.5 px-3 bg-white rounded-xl border border-zinc-200/80">
                    <Plane className="w-4 h-4 text-blue-600 shrink-0 -rotate-45" />
                    <input
                      id="origin-airport-input"
                      name="originAirport"
                      type="text"
                      value={from}
                      onChange={(e) => setFrom(e.target.value.toUpperCase())}
                      placeholder="e.g. JFK"
                      autoComplete="off"
                      className="w-full bg-transparent text-sm font-black text-zinc-950 outline-hidden font-mono uppercase tracking-wide"
                    />
                  </div>

                  {/* Center Swap Button */}
                  <button
                    type="button"
                    onClick={handleSwapAirports}
                    className="w-8 h-8 rounded-full bg-zinc-950 hover:bg-blue-600 text-white shadow-2xs flex items-center justify-center shrink-0 transition-transform active:rotate-180 cursor-pointer"
                    title="Swap Origin and Destination"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Arrival (To) */}
                  <div className="flex-1 h-full flex items-center gap-2.5 px-3 bg-white rounded-xl border border-zinc-200/80">
                    <MapPin className="w-4 h-4 text-zinc-700 shrink-0" />
                    <input
                      id="dest-airport-input"
                      name="destAirport"
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value.toUpperCase())}
                      placeholder="e.g. LHR"
                      autoComplete="off"
                      className="w-full bg-transparent text-sm font-black text-zinc-950 outline-hidden font-mono uppercase tracking-wide"
                    />
                  </div>
                </div>
              </div>

              {/* Travel Date (4 cols) */}
              <div className="lg:col-span-4">
                <label htmlFor="flight-date-input" className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider mb-1">
                  Travel Date
                </label>
                <div className="h-[52px] bg-zinc-50 border border-zinc-200/90 rounded-2xl p-1.5 flex items-center">
                  <div className="w-full h-full flex items-center gap-2.5 px-3 bg-white rounded-xl border border-zinc-200/80">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <input
                      id="flight-date-input"
                      name="travelDate"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent text-sm font-black text-zinc-950 outline-hidden cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA Button (2 cols) */}
              <div className="lg:col-span-2">
                <div className="text-[10px] uppercase font-bold text-transparent select-none mb-1 hidden lg:block">
                  Update
                </div>
                <button
                  type="submit"
                  className="w-full h-[52px] px-5 rounded-2xl bg-zinc-950 hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>Update</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Flexible Date Matrix Strip */}
        <FlexibleDateMatrix
          dates={dateMatrix}
          selectedDate={date}
          onSelectDate={handleDateChangeFromMatrix}
        />

        {/* Main Content Layout: Sidebar + Flight Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <FlightFilterSidebar
              filters={filters}
              onChange={setFilters}
              availableAirlines={availableAirlines}
              minCalculatedPrice={minPrice}
              maxCalculatedPrice={maxPrice}
            />
          </div>

          {/* Results Column */}
          <div className="lg:col-span-3 space-y-4">
            {/* Mobile Filter Toggle Button */}
            <div className="flex lg:hidden items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Filters & Preferences</span>
              </button>
            </div>

            {/* Sorting Tabs Header */}
            <FlightSortHeader
              currentSort={sortBy}
              onSortChange={setSortBy}
              flightCount={flights.length}
            />

            {/* Flight Results Cards */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="p-6 rounded-3xl bg-white border border-zinc-200 animate-pulse space-y-4"
                  >
                    <div className="h-4 bg-zinc-200 rounded w-1/4" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-8 bg-zinc-200 rounded" />
                      <div className="h-8 bg-zinc-200 rounded" />
                      <div className="h-8 bg-zinc-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : flights.length > 0 ? (
              <div className="space-y-4">
                {flights.map((flight) => (
                  <FlightCard
                    key={flight._id}
                    flight={flight}
                    cabinClass={cabin}
                    passengerCount={passengers}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center space-y-4 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Plane className="w-6 h-6 -rotate-45" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">
                  No flights match your exact criteria
                </h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Try adjusting your maximum price slider, clearing airline filters, or selecting a flexible travel date.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      stops: "all",
                      maxPrice: 3000,
                      timeWindow: "all",
                      selectedAirlines: [],
                      refundableOnly: false,
                    });
                  }}
                  className="px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-base font-bold text-zinc-900">Flight Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FlightFilterSidebar
              filters={filters}
              onChange={setFilters}
              availableAirlines={availableAirlines}
              minCalculatedPrice={minPrice}
              maxCalculatedPrice={maxPrice}
            />

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-3 bg-zinc-950 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-zinc-500">Loading flight matrix...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
