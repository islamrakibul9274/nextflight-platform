"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Search, CheckCircle2, XCircle, ShieldAlert, Eye } from "lucide-react";

interface BookingDoc {
  _id: string;
  pnr: string;
  userEmail: string;
  contactName: string;
  flightId: {
    flightNumber: string;
    originAirport: string;
    destinationAirport: string;
    departureTime: string;
  };
  cabinClass: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  passengers: Array<{ firstName: string; lastName: string; seatNumber?: string }>;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingDoc[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingDoc | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.append("search", search);
      if (statusFilter !== "ALL") q.append("status", statusFilter);

      const res = await fetch(`/api/admin/bookings?${q.toString()}`);
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const handleUpdateStatus = async (id: string, status: string, paymentStatus?: string) => {
    try {
      await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, paymentStatus }),
      });
      fetchBookings();
      setSelectedBooking(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Passenger Bookings & PNR Manifests
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Search bookings by PNR, passenger email, or flight number. Process cancellations and refunds.
        </p>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search PNR (e.g. AET-789X4K), email, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "CONFIRMED", "CANCELLED", "REFUNDED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 uppercase">
              <th className="py-3.5 px-6 font-semibold">PNR</th>
              <th className="py-3.5 px-6 font-semibold">Passenger / Email</th>
              <th className="py-3.5 px-6 font-semibold">Flight Route</th>
              <th className="py-3.5 px-6 font-semibold">Cabin</th>
              <th className="py-3.5 px-6 font-semibold">Total Paid</th>
              <th className="py-3.5 px-6 font-semibold">Status</th>
              <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-extrabold text-sky-600">
                    {b.pnr}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-slate-900">{b.contactName}</div>
                    <div className="text-slate-400 text-[11px]">{b.userEmail}</div>
                  </td>
                  <td className="py-3.5 px-6 font-mono">
                    {b.flightId ? (
                      <div>
                        <span className="font-bold text-slate-900">
                          {b.flightId.originAirport} → {b.flightId.destinationAirport}
                        </span>
                        <span className="text-slate-400 text-[11px] ml-1">
                          ({b.flightId.flightNumber})
                        </span>
                      </div>
                    ) : (
                      "Scheduled Route"
                    )}
                  </td>
                  <td className="py-3.5 px-6 font-semibold">{b.cabinClass}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                    ${b.totalAmount} USD
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(b)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Booking Manifest</span>
                <h3 className="text-xl font-mono font-extrabold text-slate-900">
                  {selectedBooking.pnr}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400">Contact:</span>
                  <div className="font-bold text-slate-900">{selectedBooking.contactName}</div>
                  <div className="text-slate-500">{selectedBooking.userEmail}</div>
                </div>
                <div>
                  <span className="text-slate-400">Total Amount:</span>
                  <div className="font-bold font-mono text-base text-sky-600">
                    ${selectedBooking.totalAmount} USD
                  </div>
                  <div className="text-emerald-600 font-semibold">Payment: {selectedBooking.paymentStatus}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Manifest Passenger List</h4>
                <div className="space-y-1.5">
                  {selectedBooking.passengers?.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                    >
                      <span className="font-bold text-slate-800">
                        {p.firstName} {p.lastName}
                      </span>
                      <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                        Seat: {p.seatNumber || "Assigned at Gate"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {selectedBooking.status === "CONFIRMED" ? (
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(selectedBooking._id, "CANCELLED", "REFUNDED")
                  }
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                >
                  Trigger Refund & Cancel PNR
                </button>
              ) : (
                <span className="text-xs font-bold text-slate-400">Booking Cancelled / Inactive</span>
              )}

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
