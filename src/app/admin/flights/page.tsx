"use client";

import React, { useState, useEffect } from "react";
import {
  Plane,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
} from "lucide-react";
import { formatFlightTime, formatDuration } from "@/lib/utils";

interface FlightDoc {
  _id: string;
  flightNumber: string;
  airlineName: string;
  originAirport: string;
  originCity: string;
  destinationAirport: string;
  destinationCity: string;
  departureTime: string;
  durationMinutes: number;
  aircraftModel: string;
  basePrice: number;
  businessPrice: number;
  economySeatsAvailable: number;
  status: string;
}

export default function AdminFlightsPage() {
  const [flights, setFlights] = useState<FlightDoc[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Flight Form
  const [newFlight, setNewFlight] = useState({
    flightNumber: "AE-510",
    airlineCode: "AE",
    airlineName: "Aetheria Flagship Airways",
    airlineLogo: "✈️",
    originAirport: "JFK",
    originCity: "New York",
    destinationAirport: "LHR",
    destinationCity: "London",
    departureTime: new Date(Date.now() + 86400000 * 2).toISOString(),
    arrivalTime: new Date(Date.now() + 86400000 * 2 + 7 * 3600000).toISOString(),
    durationMinutes: 420,
    aircraftModel: "Boeing 787-9 Dreamliner",
    basePrice: 580,
    premiumEconomyPrice: 890,
    businessPrice: 1980,
    firstPrice: 3400,
    economySeatsAvailable: 180,
    status: "SCHEDULED",
    refundable: true,
  });

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.append("search", search);
      if (statusFilter !== "ALL") q.append("status", statusFilter);

      const res = await fetch(`/api/admin/flights?${q.toString()}`);
      const data = await res.json();
      if (data.flights) {
        setFlights(data.flights);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const handleCreateFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFlight),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchFlights();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteFlight = async (id: string) => {
    if (!confirm("Are you sure you want to remove this flight schedule?")) return;
    try {
      await fetch(`/api/admin/flights?id=${id}`, { method: "DELETE" });
      fetchFlights();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Flight Inventory & Schedules
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage scheduled transoceanic departures, aircraft tail assignments, and seat capacities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Flight</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flight #, IATA code, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["ALL", "SCHEDULED", "BOARDING", "DELAYED", "CANCELLED"].map((st) => (
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

      {/* Flight Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 uppercase">
              <th className="py-3.5 px-6 font-semibold">Flight</th>
              <th className="py-3.5 px-6 font-semibold">Route</th>
              <th className="py-3.5 px-6 font-semibold">Departure</th>
              <th className="py-3.5 px-6 font-semibold">Aircraft</th>
              <th className="py-3.5 px-6 font-semibold">Base Fare</th>
              <th className="py-3.5 px-6 font-semibold">Seats Avail</th>
              <th className="py-3.5 px-6 font-semibold">Status</th>
              <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Loading flight inventory...
                </td>
              </tr>
            ) : flights.length > 0 ? (
              flights.map((f) => (
                <tr key={f._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                    {f.flightNumber}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900 font-mono">
                    {f.originAirport} → {f.destinationAirport}
                  </td>
                  <td className="py-3.5 px-6">{new Date(f.departureTime).toLocaleDateString()} {formatFlightTime(f.departureTime)}</td>
                  <td className="py-3.5 px-6 text-slate-500">{f.aircraftModel}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900">${f.basePrice}</td>
                  <td className="py-3.5 px-6">{f.economySeatsAvailable} left</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        f.status === "BOARDING"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : f.status === "CANCELLED"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleDeleteFlight(f._id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete flight"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No flights match the current query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Flight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule New Flight</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleCreateFlight} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Flight Number *</label>
                  <input
                    type="text"
                    required
                    value={newFlight.flightNumber}
                    onChange={(e) => setNewFlight({ ...newFlight, flightNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Aircraft Model *</label>
                  <select
                    value={newFlight.aircraftModel}
                    onChange={(e) => setNewFlight({ ...newFlight, aircraftModel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Boeing 787-9 Dreamliner">Boeing 787-9 Dreamliner</option>
                    <option value="Airbus A350-1000 XWB">Airbus A350-1000 XWB</option>
                    <option value="Airbus A380-800 Superjumbo">Airbus A380-800 Superjumbo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Origin IATA *</label>
                  <input
                    type="text"
                    required
                    value={newFlight.originAirport}
                    onChange={(e) => setNewFlight({ ...newFlight, originAirport: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination IATA *</label>
                  <input
                    type="text"
                    required
                    value={newFlight.destinationAirport}
                    onChange={(e) => setNewFlight({ ...newFlight, destinationAirport: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Economy Base Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={newFlight.basePrice}
                    onChange={(e) => setNewFlight({ ...newFlight, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Business Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={newFlight.businessPrice}
                    onChange={(e) => setNewFlight({ ...newFlight, businessPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Schedule Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
