"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FlightCard, FlightItem } from "@/components/search/FlightCard";
import { FlightFilterSidebar } from "@/components/search/FlightFilterSidebar";
import { FlightSortHeader } from "@/components/search/FlightSortHeader";
import { useLocalToday } from "@/lib/use-local-today";
import { dateAfterDays } from "@/lib/search-dates";
import { normalizeCabin } from "@/lib/flight-search";
import { useToast } from "@/components/ui/Toast";
import { Dialog } from "@/components/ui/Dialog";
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
  AlertCircle,
  ArrowRight,
} from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const today = useLocalToday();
  const { notify } = useToast();
  const queryFrom = searchParams.get("from") || "JFK";
  const queryTo = searchParams.get("to") || "LHR";
  const queryDate =
    searchParams.get("date") ||
    searchParams.get("departure") ||
    (today ? dateAfterDays(7, new Date(today + "T12:00:00")) : "");
  const queryCabin = normalizeCabin(
    searchParams.get("cabin") || searchParams.get("class"),
  );
  const requestedPassengers = Number(
    searchParams.get("passengers") || searchParams.get("adults") || 1,
  );
  const queryPassengers =
    Number.isInteger(requestedPassengers) &&
    requestedPassengers >= 1 &&
    requestedPassengers <= 9
      ? requestedPassengers
      : 1;
  // Draft inputs don't trigger network requests until the traveler submits the form.
  const [from, setFrom] = useState(queryFrom);
  const [to, setTo] = useState(queryTo);
  const [selectedDate, setDate] = useState<string | null>(null);
  const date = selectedDate ?? queryDate;
  const [cabin, setCabin] = useState(queryCabin);
  const [passengers, setPassengers] = useState(queryPassengers);
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "recommended",
  );
  const [filters, setFilters] = useState({
    stops: searchParams.get("stops") || "all",
    maxPrice: Number(searchParams.get("maxPrice")) || 0,
    timeWindow: searchParams.get("timeWindow") || "all",
    selectedAirlines: (searchParams.get("airlines") || "")
      .split(",")
      .filter(Boolean),
    refundableOnly: searchParams.get("refundable") === "true",
  });
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  // Results state
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableAirlines, setAvailableAirlines] = useState<
    Record<string, { name: string; count: number; logo: string }>
  >({});
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [dateMatrix, setDateMatrix] = useState<
    Array<{ date: string; minPrice: number | null; formattedDate: string }>
  >([]);
  const [routeInfo, setRouteInfo] = useState<{
    origin?: { city: string; name: string };
    destination?: { city: string; name: string };
  }>({});

  // Mobile filters drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (!queryDate) return;
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError("");
      const q = new URLSearchParams({
        from: queryFrom,
        to: queryTo,
        date: queryDate,
        cabin: queryCabin,
        passengers: String(queryPassengers),
        stops: filters.stops,
        sort: sortBy,
        timeWindow: filters.timeWindow,
        refundable: String(filters.refundableOnly),
      });
      if (filters.selectedAirlines.length)
        q.set("airlines", filters.selectedAirlines.join(","));
      if (filters.maxPrice > 0) q.set("maxPrice", String(filters.maxPrice));
      try {
        const res = await fetch(`/api/flights/search?${q}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.error || "We couldn't load flights. Please try again.",
          );
        if (controller.signal.aborted) return;
        setFlights(data.flights || []);
        setAvailableAirlines(data.filters?.airlines || {});
        setMinPrice(data.filters?.minPrice ?? 0);
        setMaxPrice(data.filters?.maxPrice ?? 0);
        setDateMatrix(data.dateMatrix || []);
        setRouteInfo(data.routeInfo || {});
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error
            ? err.message
            : "We couldn't load flights. Please try again.",
        );
        setFlights([]);
        setDateMatrix([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    // Debounce rapidly changing sliders; cancellation prevents stale responses winning.
    const timer = setTimeout(load, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    queryFrom,
    queryTo,
    queryDate,
    queryCabin,
    queryPassengers,
    filters,
    sortBy,
    attempt,
  ]);

  const buildParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("departure");
    params.delete("class");
    params.set("stops", filters.stops);
    params.set("sort", sortBy);
    params.set("timeWindow", filters.timeWindow);
    params.set("refundable", String(filters.refundableOnly));
    if (filters.maxPrice > 0) params.set("maxPrice", String(filters.maxPrice));
    else params.delete("maxPrice");
    if (filters.selectedAirlines.length)
      params.set("airlines", filters.selectedAirlines.join(","));
    else params.delete("airlines");
    return params;
  };

  const handleSwapAirports = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleDateChangeFromMatrix = (newDate: string) => {
    const params = buildParams();
    params.set("date", newDate);
    router.push(`/search?${params}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to) || from === to) {
      notify("Choose two different three-letter airport codes.", "error");
      return;
    }
    if (!date || date < today) {
      notify("Choose a travel date today or later.", "error");
      return;
    }
    const params = buildParams();
    params.set("from", from);
    params.set("to", to);
    params.set("date", date);
    params.set("cabin", cabin);
    params.set("passengers", String(passengers));
    router.push(`/search?${params}`, { scroll: false });
    setAttempt((value) => value + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="section-kicker mb-2">YOUR NEXT CHAPTER</p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Find your way there.
            </h1>
            <p className="mt-2 text-sm text-slate-500 flex flex-wrap items-center gap-2">
              {routeInfo.origin?.city || queryFrom}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              {routeInfo.destination?.city || queryTo}
              <span className="text-slate-300" aria-hidden="true">
                /
              </span>
              {queryPassengers}{" "}
              {queryPassengers === 1 ? "traveler" : "travelers"}
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Compare the details. Travel with confidence.
          </span>
        </div>
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
                  aria-label="Number of travelers"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="bg-transparent font-bold outline-hidden cursor-pointer"
                >
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? "Traveler" : "Travelers"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-semibold">
                <select
                  id="search-cabin-select"
                  name="cabin"
                  aria-label="Cabin class"
                  value={cabin}
                  onChange={(e) => setCabin(normalizeCabin(e.target.value))}
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
                      aria-label="Departure airport code"
                      required
                      pattern="[A-Z]{3}"
                      maxLength={3}
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
                    className="w-8 h-8 rounded-full bg-slate-950 hover:bg-slate-800 text-white shadow-2xs flex items-center justify-center shrink-0 transition-transform active:rotate-180 cursor-pointer"
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
                      aria-label="Arrival airport code"
                      required
                      pattern="[A-Z]{3}"
                      maxLength={3}
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
                <label
                  htmlFor="flight-date-input"
                  className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider mb-1"
                >
                  Travel Date
                </label>
                <div className="h-[52px] bg-zinc-50 border border-zinc-200/90 rounded-2xl p-1.5 flex items-center">
                  <div className="w-full h-full flex items-center gap-2.5 px-3 bg-white rounded-xl border border-zinc-200/80">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <input
                      id="flight-date-input"
                      name="travelDate"
                      required
                      min={today}
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
                  className="w-full h-[52px] px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs tracking-wider uppercase shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
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
              loading={loading}
            />

            <p className="px-1 text-[11px] text-slate-500">
              Departure and arrival times shown in UTC.
            </p>
            {/* Flight Results Cards */}
            {loading ? (
              <div
                className="space-y-4"
                role="status"
                aria-label="Searching available flights"
              >
                <span className="sr-only">Searching available flights…</span>
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
            ) : error ? (
              <div
                role="alert"
                className="rounded-3xl border border-rose-100 bg-white px-6 py-12 text-center"
              >
                <AlertCircle
                  className="mx-auto mb-4 h-8 w-8 text-rose-500"
                  aria-hidden="true"
                />
                <h2 className="text-lg font-semibold text-slate-900">
                  We couldn’t load your flights
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => setAttempt((value) => value + 1)}
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                >
                  Try again
                </button>
              </div>
            ) : flights.length > 0 ? (
              <div className="space-y-4">
                {flights.map((flight) => (
                  <FlightCard
                    key={flight._id}
                    flight={flight}
                    cabinClass={queryCabin}
                    passengerCount={queryPassengers}
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
                  Try adjusting your maximum price slider, clearing airline
                  filters, or selecting a flexible travel date.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      stops: "all",
                      maxPrice: 0,
                      timeWindow: "all",
                      selectedAirlines: [],
                      refundableOnly: false,
                    });
                  }}
                  className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
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
        <Dialog
          title="Flight filters"
          onClose={() => setMobileFiltersOpen(false)}
          className="ml-auto h-dvh max-h-dvh max-w-sm rounded-none p-6 space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="text-base font-bold text-zinc-900">
              Flight Filters
            </h3>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
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
            className="w-full py-3 bg-slate-950 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-800"
          >
            Apply Filters
          </button>
        </Dialog>
      )}
    </div>
  );
}

function SearchRoute() {
  const params = useSearchParams();
  return <SearchContent key={params.toString()} />;
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-zinc-500">
              Loading flight matrix...
            </p>
          </div>
        </div>
      }
    >
      <SearchRoute />
    </Suspense>
  );
}
