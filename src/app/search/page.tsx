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
  Sparkles,
  AlertCircle,
  Building2,
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
        // Only set default maxPrice once if not manually set lower
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

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Search Bar Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Origin */}
            <div className="md:col-span-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Departure (From)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <Plane className="w-4 h-4 text-sky-600 shrink-0" />
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value.toUpperCase())}
                  placeholder="e.g. JFK, SFO, LHR"
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-hidden font-mono uppercase"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={handleSwapAirports}
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-sky-500 hover:text-sky-600 bg-white flex items-center justify-center text-slate-600 transition-all hover:rotate-180"
                title="Swap Departure and Arrival"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Destination */}
            <div className="md:col-span-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Arrival (To)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <Plane className="w-4 h-4 text-sky-600 shrink-0 -rotate-45" />
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value.toUpperCase())}
                  placeholder="e.g. LHR, HND, DXB"
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-hidden font-mono uppercase"
                />
              </div>
            </div>

            {/* Departure Date */}
            <div className="md:col-span-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Travel Date
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-hidden cursor-pointer"
                />
              </div>
            </div>

            {/* Cabin Class & Update CTA */}
            <div className="md:col-span-2 flex items-end gap-2">
              <button
                type="button"
                onClick={fetchFlights}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Update</span>
              </button>
            </div>
          </div>
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
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs"
              >
                <Filter className="w-3.5 h-3.5 text-sky-600" />
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
                    className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4"
                  >
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-8 bg-slate-200 rounded" />
                      <div className="h-8 bg-slate-200 rounded" />
                      <div className="h-8 bg-slate-200 rounded" />
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
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                  <Plane className="w-6 h-6 -rotate-45" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No flights match your exact criteria
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
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
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Flight Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
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
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold"
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading flight matrix...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
