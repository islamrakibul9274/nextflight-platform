"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Ticket,
  Plane,
  Calendar,
  Clock,
  Printer,
  XCircle,
  AlertCircle,
  CheckCircle2,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Luggage,
} from "lucide-react";
import { formatFlightTime, formatFullDate, formatDuration } from "@/lib/utils";

export default function MyTripsPage() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"UPCOMING" | "COMPLETED" | "CANCELLED">("UPCOMING");

  // Modals
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cancelModalBooking, setCancelModalBooking] = useState<any | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState("");

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const email = user?.email || "traveler@aetheria.com";
      const res = await fetch(`/api/bookings/my-trips?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.bookings) {
        setTrips(data.bookings);
      }
    } catch (e) {
      console.error("Fetch trips error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCancelBooking = async (pnr: string) => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${pnr}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setCancelSuccessMsg(data.message);
        setTimeout(() => {
          setCancelModalBooking(null);
          setCancelSuccessMsg("");
          fetchTrips();
        }, 2000);
      }
    } catch (e) {
      console.error("Cancel booking error:", e);
    } finally {
      setCancelling(false);
    }
  };

  const filteredTrips = trips.filter((t) => {
    if (tab === "CANCELLED") return t.status === "CANCELLED" || t.status === "REFUNDED";
    if (tab === "COMPLETED") return t.status === "COMPLETED";
    return t.status === "CONFIRMED" || t.status === "CHECKED_IN";
  });

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Ticket className="w-3.5 h-3.5" /> Traveler Itinerary Console
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Trips & Reservations
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your flight bookings, view dynamic boarding passes, and request automated cancellations.
            </p>
          </div>

          <Link
            href="/search"
            className="px-5 py-2.5 bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plane className="w-4 h-4 -rotate-45" />
            <span>Book New Flight</span>
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-8">
          {[
            { id: "UPCOMING", label: "Upcoming Flights" },
            { id: "COMPLETED", label: "Past Journeys" },
            { id: "CANCELLED", label: "Cancelled & Refunded" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === t.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Trips List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="p-8 rounded-3xl bg-white border border-slate-200 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-10 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="space-y-6">
            {filteredTrips.map((booking) => {
              const flight = booking.flightId || {};
              const isCancelled = booking.status === "CANCELLED" || booking.status === "REFUNDED";

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden p-6 sm:p-8"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                        <Plane className="w-5 h-5 -rotate-45" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {flight.airlineName || "Aetheria Airways"}
                          </span>
                          <span className="font-mono text-xs text-slate-500 font-semibold">
                            {flight.flightNumber || "AE-402"}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">PNR Reference</div>
                        <div className="font-mono font-extrabold text-sky-600 text-sm">
                          {booking.pnr}
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isCancelled
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Flight Schedule */}
                  <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    {/* Departure */}
                    <div className="sm:col-span-4">
                      <div className="text-2xl font-extrabold text-slate-900 font-mono">
                        {formatFlightTime(flight.departureTime || new Date())}
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {flight.originAirport} • {flight.originCity}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatFullDate(flight.departureTime || new Date())}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-bold text-slate-500 mb-1">
                        {formatDuration(flight.durationMinutes || 420)}
                      </span>
                      <div className="w-full flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full border-2 border-sky-600 bg-white" />
                        <div className="h-0.5 w-full bg-slate-200 relative">
                          <Plane className="w-3.5 h-3.5 text-sky-600 absolute left-1/2 -top-1.5 -translate-x-1/2 -rotate-45" />
                        </div>
                        <div className="w-2 h-2 rounded-full bg-slate-900" />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-mono">
                        {flight.aircraftModel || "Boeing 787-9"}
                      </span>
                    </div>

                    {/* Arrival */}
                    <div className="sm:col-span-4 text-left sm:text-right">
                      <div className="text-2xl font-extrabold text-slate-900 font-mono">
                        {formatFlightTime(flight.arrivalTime || new Date())}
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {flight.destinationAirport} • {flight.destinationCity}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatFullDate(flight.arrivalTime || new Date())}
                      </div>
                    </div>
                  </div>

                  {/* Passenger Strip & Actions */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="font-bold text-slate-900">
                        Passenger: {booking.passengers?.[0]?.firstName}{" "}
                        {booking.passengers?.[0]?.lastName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>
                        Seat: <strong>{booking.passengers?.[0]?.seatNumber || "14A"}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>Class: {booking.cabinClass}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono font-bold text-slate-900">${booking.totalAmount} USD</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(booking)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View Boarding Pass</span>
                      </button>

                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => setCancelModalBooking(booking)}
                          className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold"
                        >
                          Cancel Trip
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No trips found in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready for your next adventure? Search hundreds of direct international flight corridors.
            </p>
            <Link
              href="/search"
              className="inline-block px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Search Flights
            </Link>
          </div>
        )}
      </div>

      {/* Boarding Pass Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plane className="w-5 h-5 text-sky-400 -rotate-45" />
                <span className="font-bold tracking-wider text-sm">NEXTFLIGHT BOARDING PASS</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-xs text-slate-400 hover:text-white font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Passenger</div>
                  <div className="text-base font-extrabold text-slate-900">
                    {selectedTicket.passengers?.[0]?.firstName} {selectedTicket.passengers?.[0]?.lastName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Seat / Gate</div>
                  <div className="text-base font-extrabold text-sky-600 font-mono">
                    {selectedTicket.passengers?.[0]?.seatNumber || "14A"} / Gate A12
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold font-mono">
                    {selectedTicket.flightId?.originAirport || "JFK"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {selectedTicket.flightId?.originCity || "New York"}
                  </div>
                </div>
                <Plane className="w-5 h-5 text-sky-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono">
                    {selectedTicket.flightId?.destinationAirport || "LHR"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {selectedTicket.flightId?.destinationCity || "London"}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <QrCode className="w-12 h-12 text-slate-900" />
                <div className="text-right font-mono text-xs">
                  <div className="text-slate-400">PNR Reference</div>
                  <div className="font-extrabold text-slate-900 text-sm">{selectedTicket.pnr}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center">
              Cancel Booking ({cancelModalBooking.pnr})?
            </h3>

            <p className="text-xs text-slate-600 text-center leading-relaxed">
              Are you sure you want to cancel this reservation? An automated refund of{" "}
              <strong>${cancelModalBooking.totalAmount} USD</strong> will be initiated back to your original payment method according to the fare policy.
            </p>

            {cancelSuccessMsg ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl text-center">
                {cancelSuccessMsg}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={() => handleCancelBooking(cancelModalBooking.pnr)}
                  className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  {cancelling ? "Processing Refund..." : "Confirm Cancellation"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
