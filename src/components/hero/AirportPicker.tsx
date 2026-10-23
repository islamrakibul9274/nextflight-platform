"use client";

import { useEffect, useState } from "react";
import { Search, X, MapPin, ArrowUpRight } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";

export interface AirportSuggestion {
  iataCode: string;
  name: string;
  city: string;
  country: string;
}
const airports: AirportSuggestion[] = [
  {
    iataCode: "JFK",
    city: "New York",
    name: "John F. Kennedy International",
    country: "United States",
  },
  {
    iataCode: "LHR",
    city: "London",
    name: "Heathrow Airport",
    country: "United Kingdom",
  },
  { iataCode: "HND", city: "Tokyo", name: "Haneda Airport", country: "Japan" },
  {
    iataCode: "SIN",
    city: "Singapore",
    name: "Changi Airport",
    country: "Singapore",
  },
  {
    iataCode: "DXB",
    city: "Dubai",
    name: "Dubai International",
    country: "United Arab Emirates",
  },
  {
    iataCode: "SFO",
    city: "San Francisco",
    name: "San Francisco International",
    country: "United States",
  },
  {
    iataCode: "CDG",
    city: "Paris",
    name: "Charles de Gaulle Airport",
    country: "France",
  },
  {
    iataCode: "LAX",
    city: "Los Angeles",
    name: "Los Angeles International",
    country: "United States",
  },
  {
    iataCode: "SYD",
    city: "Sydney",
    name: "Sydney Airport",
    country: "Australia",
  },
];

export function AirportPicker({
  title,
  onSelect,
  onClose,
}: {
  title: string;
  onSelect: (airport: AirportSuggestion) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<{
    query: string;
    airports: AirportSuggestion[];
  } | null>(null);
  const normalized = query.trim().toLowerCase();
  const localMatches = airports.filter((airport) =>
    `${airport.city} ${airport.name} ${airport.iataCode} ${airport.country}`
      .toLowerCase()
      .includes(normalized),
  );
  const items =
    response?.query === normalized ? response.airports : localMatches;
  useEffect(() => {
    if (!normalized) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const result = await fetch(
          `/api/airports/autocomplete?q=${encodeURIComponent(normalized)}`,
          { signal: controller.signal },
        );
        if (!result.ok) return;
        const data = await result.json();
        if (
          !controller.signal.aborted &&
          Array.isArray(data.airports) &&
          data.airports.length
        )
          setResponse({ query: normalized, airports: data.airports });
      } catch {
        /* Local matches remain usable when the network is unavailable. */
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [normalized]);
  return (
    <Dialog title={title} onClose={onClose} className="!p-0 max-w-lg">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close airport picker"
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="relative mx-6 my-5">
        <Search
          size={17}
          className="absolute left-3.5 top-3.5 text-slate-400"
          aria-hidden="true"
        />
        <input
          autoFocus
          aria-label="Search city or airport"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="City, airport, or three-letter code"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800"
        />
      </div>
      <p className="px-6 pb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {normalized ? "Matching airports" : "Popular airports"}
      </p>
      <div className="max-h-[min(380px,50dvh)] overflow-y-auto px-3 pb-3">
        <ul className="space-y-1">
          {items.map((airport) => (
            <li key={airport.iataCode}>
              <button
                type="button"
                onClick={() => onSelect(airport)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400">
                  <MapPin size={17} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-slate-800">
                    {airport.city}
                    <span className="ml-2 text-xs text-slate-400">
                      {airport.country}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {airport.name}
                  </span>
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {airport.iataCode}
                </span>
                <ArrowUpRight
                  size={13}
                  className="text-slate-300"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
        {!items.length && (
          <p
            role="status"
            className="px-3 py-8 text-center text-sm text-slate-500"
          >
            No airports found. Try a city name or airport code.
          </p>
        )}
      </div>
    </Dialog>
  );
}
