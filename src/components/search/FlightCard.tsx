"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plane,
  Clock,
  Luggage,
  Wifi,
  Zap,
  Coffee,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Leaf,
  AlertCircle,
} from "lucide-react";
import { formatFlightTime, formatDuration } from "@/lib/utils";

export interface FlightItem {
  _id: string;
  flightNumber: string;
  airlineCode: string;
  airlineName: string;
  airlineLogo: string;
  originAirport: string;
  originCity: string;
  destinationAirport: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stops: number;
  stopAirports: string[];
  aircraftModel: string;
  basePrice: number;
  premiumEconomyPrice: number;
  businessPrice: number;
  firstPrice: number;
  economySeatsAvailable: number;
  businessSeatsAvailable: number;
  baggageAllowance: {
    carryOn: string;
    checked: string;
  };
  amenities: {
    wifi: boolean;
    power: boolean;
    entertainment: boolean;
    meal: boolean;
    lieFlatSeats: boolean;
  };
  carbonKg: number;
  refundable: boolean;
  terminalDeparture?: string;
  terminalArrival?: string;
}

interface FlightCardProps {
  flight: FlightItem;
  cabinClass: string;
  passengerCount?: number;
}

export function FlightCard({ flight, cabinClass = "ECONOMY", passengerCount = 1 }: FlightCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Price based on selected cabin
  const price =
    cabinClass === "FIRST"
      ? flight.firstPrice
      : cabinClass === "BUSINESS"
      ? flight.businessPrice
      : cabinClass === "PREMIUM_ECONOMY"
      ? flight.premiumEconomyPrice
      : flight.basePrice;

  const seatsLeft =
    cabinClass === "BUSINESS"
      ? flight.businessSeatsAvailable
      : flight.economySeatsAvailable;

  return (
    <div className="rounded-3xl border border-slate-200/90 hover:border-blue-500/80 bg-white shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Main Row */}
      <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Col: Airline & Times */}
        <div className="flex-1 space-y-4">
          {/* Airline Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{flight.airlineLogo}</span>
              <div>
                <span className="text-sm font-bold text-slate-900">{flight.airlineName}</span>
                <span className="ml-2 text-xs font-mono text-slate-400">
                  {flight.flightNumber} • {flight.aircraftModel}
                </span>
              </div>
            </div>

            {seatsLeft <= 5 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                <AlertCircle className="w-3 h-3" /> Only {seatsLeft} seat{seatsLeft > 1 ? "s" : ""} left
              </span>
            )}
          </div>

          {/* Flight Timeline Details */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Departure */}
            <div className="sm:col-span-4">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatFlightTime(flight.departureTime)}
              </div>
              <div className="text-xs font-bold text-slate-700">{flight.originAirport}</div>
              <div className="text-[11px] text-slate-500 truncate">
                {flight.originCity} {flight.terminalDeparture ? `(${flight.terminalDeparture})` : ""}
              </div>
            </div>

            {/* Flight Duration & Stops */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-slate-500 mb-1">
                {formatDuration(flight.durationMinutes)}
              </span>
              <div className="w-full flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full border-2 border-sky-600 bg-white shrink-0" />
                <div className="h-0.5 w-full bg-slate-200 relative">
                  {flight.stops > 0 ? (
                    <div className="absolute left-1/2 -top-1 w-2 h-2 rounded-full bg-amber-500 -translate-x-1/2" />
                  ) : (
                    <Plane className="w-3.5 h-3.5 text-sky-600 absolute left-1/2 -top-1.5 -translate-x-1/2 -rotate-45" />
                  )}
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-900 shrink-0" />
              </div>
              <span
                className={`text-[10px] font-semibold mt-1 ${
                  flight.stops === 0 ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {flight.stops === 0
                  ? "Nonstop"
                  : `${flight.stops} Stop (${flight.stopAirports.join(", ")})`}
              </span>
            </div>

            {/* Arrival */}
            <div className="sm:col-span-4 text-left sm:text-right">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatFlightTime(flight.arrivalTime)}
              </div>
              <div className="text-xs font-bold text-slate-700">{flight.destinationAirport}</div>
              <div className="text-[11px] text-slate-500 truncate">
                {flight.destinationCity} {flight.terminalArrival ? `(${flight.terminalArrival})` : ""}
              </div>
            </div>
          </div>

          {/* Amenities & Baggage tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-700">
              <Luggage className="w-3 h-3 text-slate-500" />
              {flight.baggageAllowance.checked}
            </span>
            {flight.amenities.wifi && (
              <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md font-medium border border-sky-100">
                <Wifi className="w-3 h-3" /> Starlink WiFi
              </span>
            )}
            {flight.amenities.lieFlatSeats && (
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium border border-indigo-100">
                <Zap className="w-3 h-3" /> 180° Lie-Flat
              </span>
            )}
            {flight.refundable && (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Refundable
              </span>
            )}
          </div>
        </div>

        {/* Right Col: Price and Select CTA */}
        <div className="lg:border-l lg:border-slate-100 lg:pl-6 flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0">
          <div className="text-left lg:text-right">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {cabinClass.replace("_", " ")}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              ${price}
            </div>
            <div className="text-[10px] text-slate-500">Total per passenger</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="View flight details & itinerary"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  expanded ? "rotate-180 text-sky-600" : ""
                }`}
              />
            </button>

            <Link
              href={`/booking?flightId=${flight._id}&cabin=${cabinClass}&passengers=${passengerCount}`}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-semibold text-xs shadow-xs hover:shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Select</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Expanded Flight Breakdown Drawer */}
      {expanded && (
        <div className="bg-slate-50/80 border-t border-slate-100 p-5 sm:p-6 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Segment Breakdown */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Flight Route Details
              </h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Flight:</span>
                  <span className="font-semibold text-slate-900">{flight.flightNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Aircraft:</span>
                  <span className="font-semibold text-slate-900">{flight.aircraftModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Departure:</span>
                  <span className="font-semibold text-slate-900">{new Date(flight.departureTime).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Arrival:</span>
                  <span className="font-semibold text-slate-900">{new Date(flight.arrivalTime).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Baggage & Rules */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Baggage & Fare Policy
              </h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cabin Bag:</span>
                  <span className="font-semibold text-slate-900">{flight.baggageAllowance.carryOn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Checked Bag:</span>
                  <span className="font-semibold text-slate-900">{flight.baggageAllowance.checked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cancellation:</span>
                  <span className="font-semibold text-emerald-600">
                    {flight.refundable ? "Refundable (Up to 2h prior)" : "Non-refundable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Environmental & Cabin Perks */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Cabin Perks & Footprint
              </h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Est. Carbon Footprint: <strong>{flight.carbonKg} kg CO2e</strong></span>
                </div>
                <div className="text-[11px] text-slate-500">
                  18% lower emissions than industry average on this route.
                </div>
                <div className="pt-2">
                  <Link
                    href={`/flight/${flight._id}`}
                    className="text-sky-600 hover:text-sky-700 font-bold underline inline-flex items-center gap-1"
                  >
                    View Full Itinerary & Seat Pitch Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
