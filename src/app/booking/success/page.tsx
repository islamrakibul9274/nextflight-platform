"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Printer,
  Calendar,
  Plane,
  Download,
  Share2,
  Ticket,
  ArrowRight,
  ShieldCheck,
  Luggage,
  QrCode,
} from "lucide-react";
import { formatFlightTime, formatFullDate, formatDuration } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pnr = searchParams.get("pnr") || "AET-789X4K";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${pnr}`);
        const data = await res.json();
        if (data.booking) {
          setBookingData(data.booking);
        }
      } catch (e) {
        console.error("Fetch booking error:", e);
      } finally {
        setLoading(false);
      }
    }

    if (pnr) {
      fetchBooking();
    }
  }, [pnr]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCalendar = () => {
    if (!bookingData || !bookingData.flightId) return;
    const flight = bookingData.flightId;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Aetheria Airways//Flight Booking//EN
BEGIN:VEVENT
UID:${pnr}@aetheria.aero
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${new Date(flight.departureTime).toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${new Date(flight.arrivalTime).toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:Flight ${flight.flightNumber} (${flight.originAirport} → ${flight.destinationAirport})
DESCRIPTION:Aetheria Flight Booking ${pnr}. Gate ${flight.gateDeparture || "A12"}, Terminal ${flight.terminalDeparture || "4"}.
LOCATION:${flight.originAirport} International Airport
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Aetheria_Flight_${pnr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const flight = bookingData?.flightId || {
    flightNumber: "AE-402",
    airlineName: "Aetheria Flagship",
    airlineLogo: "✈️",
    originAirport: "JFK",
    originCity: "New York",
    destinationAirport: "LHR",
    destinationCity: "London",
    departureTime: new Date(Date.now() + 86400000 * 3).toISOString(),
    arrivalTime: new Date(Date.now() + 86400000 * 3 + 7 * 3600000).toISOString(),
    durationMinutes: 420,
    aircraftModel: "Boeing 787-9",
    terminalDeparture: "T4",
    terminalArrival: "T2",
    gateDeparture: "A12",
  };

  const passenger = bookingData?.passengers?.[0] || {
    firstName: "Alex",
    lastName: "Thorne",
    seatNumber: "14A",
    ticketNumber: `016-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 pb-20 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="text-center space-y-3 mb-10 print:hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Booking Confirmed & Issued!
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Your flight reservation is locked. A confirmation e-ticket has been sent to{" "}
            <strong>{bookingData?.contactEmail || "your email"}</strong>.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Booking Reference (PNR):
            </span>
            <span className="text-lg font-extrabold text-sky-600 font-mono tracking-wider">
              {pnr}
            </span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print E-Ticket</span>
          </button>

          <button
            type="button"
            onClick={handleExportCalendar}
            className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>Add to Calendar (.ics)</span>
          </button>

          <Link
            href="/my-trips"
            className="px-5 py-2.5 bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            <span>View in My Trips</span>
          </Link>
        </div>

        {/* Boarding Pass / E-Ticket Card (Printable) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden mb-8 print:border-0 print:shadow-none">
          {/* Header Strip */}
          <div className="bg-slate-950 text-white p-6 sm:p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center font-bold">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-wider">AETHERIA</h2>
                <p className="text-xs text-slate-400">Electronic Passenger Boarding Pass</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">PNR Reference</div>
              <div className="text-xl font-mono font-extrabold text-sky-400">{pnr}</div>
            </div>
          </div>

          {/* Passenger & Flight Info Body */}
          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-6 border-b border-slate-100">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Passenger</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {passenger.firstName} {passenger.lastName}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {bookingData?.cabinClass || "Economy Standard"}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Flight Number</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5 font-mono">
                  {flight.flightNumber}
                </div>
                <div className="text-xs text-slate-500">{flight.aircraftModel}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Seat</div>
                <div className="text-base font-extrabold text-sky-600 mt-0.5 font-mono">
                  {passenger.seatNumber || "14A"}
                </div>
                <div className="text-xs text-slate-500">Boarding Group 2</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Departure Gate</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5 font-mono">
                  Gate {flight.gateDeparture || "A12"}
                </div>
                <div className="text-xs text-slate-500">Terminal {flight.terminalDeparture || "4"}</div>
              </div>
            </div>

            {/* Flight Times & Airports */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-5">
                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  {formatFlightTime(flight.departureTime)}
                </div>
                <div className="text-base font-bold text-slate-800 mt-1">
                  {flight.originCity} ({flight.originAirport})
                </div>
                <div className="text-xs text-slate-500">{formatFullDate(flight.departureTime)}</div>
              </div>

              <div className="sm:col-span-2 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-slate-500 mb-1">
                  {formatDuration(flight.durationMinutes)}
                </span>
                <div className="w-full flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full border-2 border-sky-600 bg-white" />
                  <div className="h-0.5 w-full bg-slate-300 relative">
                    <Plane className="w-3.5 h-3.5 text-sky-600 absolute left-1/2 -top-1.5 -translate-x-1/2 -rotate-45" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                </div>
                <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1">Nonstop</span>
              </div>

              <div className="sm:col-span-5 text-left sm:text-right">
                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  {formatFlightTime(flight.arrivalTime)}
                </div>
                <div className="text-base font-bold text-slate-800 mt-1">
                  {flight.destinationCity} ({flight.destinationAirport})
                </div>
                <div className="text-xs text-slate-500">{formatFullDate(flight.arrivalTime)}</div>
              </div>
            </div>

            {/* Barcode & QR Code Section */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Electronic Ticket Security Number
                </div>
                <div className="text-sm font-mono font-bold text-slate-700">
                  016-8923049182390 • IATA SECURE
                </div>
                <div className="text-xs text-slate-500">
                  Valid for international carriage subject to airline conditions.
                </div>
              </div>

              {/* Dynamic QR Mock */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <QrCode className="w-12 h-12 text-slate-900" />
                <div className="text-[10px] font-mono text-slate-500">
                  <div>SCAN AT GATE</div>
                  <div className="font-bold text-slate-800">PNR: {pnr}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
