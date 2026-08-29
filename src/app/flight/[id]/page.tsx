import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Flight } from "@/models/Flight";
import { Airport } from "@/models/Airport";
import { Aircraft } from "@/models/Aircraft";
import {
  Plane,
  ArrowRight,
  Clock,
  Luggage,
  Wifi,
  Zap,
  Coffee,
  ShieldCheck,
  Leaf,
  Calendar,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";
import { formatFlightTime, formatDuration, formatFullDate } from "@/lib/utils";

export default async function FlightDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  let flight = null;
  try {
    flight = await Flight.findById(id).lean();
  } catch {
    notFound();
  }

  if (!flight) {
    notFound();
  }

  const [originAirport, destAirport, aircraft] = await Promise.all([
    Airport.findOne({ iataCode: flight.originAirport }).lean(),
    Airport.findOne({ iataCode: flight.destinationAirport }).lean(),
    Aircraft.findOne({ model: flight.aircraftModel }).lean(),
  ]);

  const taxes = Math.round(flight.basePrice * 0.12);
  const totalPrice = flight.basePrice + taxes;

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/search" className="hover:text-slate-900">Flight Search</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold">{flight.flightNumber} Details</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl shadow-xs">
                {flight.airlineLogo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    {flight.airlineName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                    {flight.flightNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {flight.aircraftModel} • {flight.stops === 0 ? "Nonstop Flight" : `${flight.stops} Stop`}
                </p>
              </div>
            </div>

            {/* Price Box */}
            <div className="text-left md:text-right flex md:flex-col items-center md:items-end justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-slate-400">Economy Standard from</div>
                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  ${flight.basePrice}{" "}
                  <span className="text-xs font-normal text-slate-400">USD</span>
                </div>
              </div>
              <Link
                href={`/booking?flightId=${flight._id}&cabin=ECONOMY`}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>Continue to Booking</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Timeline Itinerary Block */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Origin */}
            <div className="md:col-span-4">
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {formatFlightTime(flight.departureTime)}
              </div>
              <div className="text-base font-bold text-slate-800 mt-1">
                {originAirport?.city || flight.originCity} ({flight.originAirport})
              </div>
              <div className="text-xs text-slate-500">{originAirport?.name || `${flight.originAirport} International`}</div>
              <div className="text-xs font-mono font-semibold text-sky-600 mt-1">
                Terminal {flight.terminalDeparture || "4"} • Gate {flight.gateDeparture || "A12"}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {formatFullDate(flight.departureTime)}
              </div>
            </div>

            {/* Middle Flight Path */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-600 mb-1">
                {formatDuration(flight.durationMinutes)}
              </span>
              <div className="w-full flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-sky-600 bg-white shrink-0" />
                <div className="h-0.5 w-full bg-slate-200 relative">
                  <Plane className="w-4 h-4 text-sky-600 absolute left-1/2 -top-2 -translate-x-1/2 -rotate-45" />
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shrink-0" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1">
                {flight.stops === 0 ? "Direct Transoceanic Corridor" : `${flight.stops} Stop (${flight.stopAirports.join(", ")})`}
              </span>
            </div>

            {/* Destination */}
            <div className="md:col-span-4 text-left md:text-right">
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {formatFlightTime(flight.arrivalTime)}
              </div>
              <div className="text-base font-bold text-slate-800 mt-1">
                {destAirport?.city || flight.destinationCity} ({flight.destinationAirport})
              </div>
              <div className="text-xs text-slate-500">{destAirport?.name || `${flight.destinationAirport} International`}</div>
              <div className="text-xs font-mono font-semibold text-sky-600 mt-1">
                Terminal {flight.terminalArrival || "2"} • Gate {flight.gateArrival || "B04"}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {formatFullDate(flight.arrivalTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs & Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2 Cols: Aircraft & Cabin Specs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Aircraft Specs Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-sky-600" />
                  <h3 className="text-lg font-bold text-slate-900">Aircraft & Cabin Telemetry</h3>
                </div>
                <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-semibold">
                  {aircraft?.manufacturer || "Boeing"} {flight.aircraftModel}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Seat Pitch</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {aircraft?.seatPitchEconomyInches || 32}&quot; Economy
                  </div>
                  <div className="text-[10px] text-slate-500">38&quot; Prem / 78&quot; Lie-flat</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Cabin Layout</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {aircraft?.cabinLayout || "3-3-3"}
                  </div>
                  <div className="text-[10px] text-slate-500">Widebody twin-aisle</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Cruise Speed</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {aircraft?.cruiseSpeedKmh || 913} km/h
                  </div>
                  <div className="text-[10px] text-slate-500">Mach 0.86 cruise</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Capacity</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {aircraft?.totalSeats || 290} Seats
                  </div>
                  <div className="text-[10px] text-slate-500">Multi-class config</div>
                </div>
              </div>

              {/* Amenities Breakdown */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  In-Flight Passenger Amenities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <Wifi className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Starlink High-Speed Internet</div>
                      <div className="text-slate-500 text-[11px]">Free streaming & browsing onboard</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">In-Seat 65W USB-C & AC Power</div>
                      <div className="text-slate-500 text-[11px]">Universal power at every single seat</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <Coffee className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Chef-Curated In-Flight Dining</div>
                      <div className="text-slate-500 text-[11px]">Complimentary hot meals & bar service</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">4K OLED Entertainment Screens</div>
                      <div className="text-slate-500 text-[11px]">Over 1,200 movies, series, & live TV</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Baggage & Fare Policy Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-2xs">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Luggage className="w-5 h-5 text-sky-600" />
                Baggage & Fare Cancellation Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="font-bold text-slate-900 mb-1">Cabin Baggage Allowance</div>
                  <div className="text-slate-600">{flight.baggageAllowance.carryOn}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Fits under seat or overhead bin</div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="font-bold text-slate-900 mb-1">Checked Baggage Allowance</div>
                  <div className="text-slate-600">{flight.baggageAllowance.checked}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Drop off at airport counter</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Flexible Cancellation Guarantee</div>
                  <div className="text-emerald-700 text-[11px] mt-0.5 leading-relaxed">
                    Cancel online up to 2 hours before departure for an automated refund. Flex fares receive 100% cash refund to original payment card.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1 Col: Transparent Price Breakdown & Booking Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs sticky top-24">
              <h3 className="text-base font-bold text-slate-900">Fare Itemization</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Airfare (1 Adult)</span>
                  <span className="font-mono font-bold text-slate-900">${flight.basePrice}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Airport Passenger Service Charge</span>
                  <span className="font-mono font-bold text-slate-900">$34</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Aviation Security & Customs Fee</span>
                  <span className="font-mono font-bold text-slate-900">$22</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Government Air Passenger Taxes</span>
                  <span className="font-mono font-bold text-slate-900">${taxes - 56}</span>
                </div>

                <div className="border-t border-slate-100 my-2 pt-3 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Authoritative Fare</span>
                  <span className="font-mono text-xl text-sky-600">${totalPrice}</span>
                </div>
              </div>

              {/* Carbon Offset badge */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Carbon Footprint:</span>
                </div>
                <span className="font-bold font-mono text-slate-900">{flight.carbonKg} kg CO2e</span>
              </div>

              <Link
                href={`/booking?flightId=${flight._id}&cabin=ECONOMY`}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select & Proceed to Passengers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
