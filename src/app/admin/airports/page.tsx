"use client";

import React, { useState, useEffect } from "react";
import { Building2, Plus, Search, MapPin, Globe } from "lucide-react";

interface AirportDoc {
  _id: string;
  iataCode: string;
  icaoCode: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
  terminals: number;
  isPopular: boolean;
}

export default function AdminAirportsPage() {
  const [airports, setAirports] = useState<AirportDoc[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAirport, setNewAirport] = useState({
    iataCode: "MUC",
    icaoCode: "EDDM",
    name: "Munich International Airport",
    city: "Munich",
    country: "Germany",
    countryCode: "DE",
    timezone: "Europe/Berlin",
    latitude: 48.3538,
    longitude: 11.7861,
    terminals: 2,
    isPopular: true,
  });

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/airports");
      const data = await res.json();
      if (data.airports) {
        setAirports(data.airports);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/airports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAirport),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchAirports();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = airports.filter(
    (a) =>
      a.iataCode.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Global Airport & Hub Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered international airports, runways, terminals, and geographic coordinates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Airport Hub</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by IATA code (e.g. JFK), City, or Airport name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden"
          />
        </div>
      </div>

      {/* Airports Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 uppercase">
              <th className="py-3.5 px-6 font-semibold">IATA / ICAO</th>
              <th className="py-3.5 px-6 font-semibold">City & Country</th>
              <th className="py-3.5 px-6 font-semibold">Airport Name</th>
              <th className="py-3.5 px-6 font-semibold">Timezone</th>
              <th className="py-3.5 px-6 font-semibold">Terminals</th>
              <th className="py-3.5 px-6 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Loading airport directory...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((a) => (
                <tr key={a._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-sky-700 border border-slate-200">
                      {a.iataCode}
                    </span>
                    <span className="ml-2 text-slate-400 font-normal">{a.icaoCode}</span>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    {a.city}, {a.country}
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 truncate max-w-xs">{a.name}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-400">{a.timezone}</td>
                  <td className="py-3.5 px-6 font-semibold">{a.terminals} Terminals</td>
                  <td className="py-3.5 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Operational
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No airports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Airport Hub</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">IATA Code *</label>
                  <input
                    type="text"
                    required
                    value={newAirport.iataCode}
                    onChange={(e) => setNewAirport({ ...newAirport, iataCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newAirport.city}
                    onChange={(e) => setNewAirport({ ...newAirport, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Airport Name *</label>
                <input
                  type="text"
                  required
                  value={newAirport.name}
                  onChange={(e) => setNewAirport({ ...newAirport, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={newAirport.country}
                    onChange={(e) => setNewAirport({ ...newAirport, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Terminals</label>
                  <input
                    type="number"
                    value={newAirport.terminals}
                    onChange={(e) => setNewAirport({ ...newAirport, terminals: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
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
                  Save Airport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
