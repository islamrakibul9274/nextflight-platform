"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Ticket,
  Plane,
  Users,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function AdminDashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = stats?.metrics || {
    totalRevenue: 5892000,
    activeBookingsCount: 1420,
    totalFlights: 124,
    totalPassengers: 2890,
    conversionRate: "4.82%",
    averageLoadFactor: "91.4%",
  };

  const monthlyRevenue = stats?.monthlyRevenue || [
    { month: "Jan", revenue: 420000, bookings: 380, loadFactor: 84 },
    { month: "Feb", revenue: 490000, bookings: 440, loadFactor: 86 },
    { month: "Mar", revenue: 610000, bookings: 530, loadFactor: 89 },
    { month: "Apr", revenue: 580000, bookings: 510, loadFactor: 87 },
    { month: "May", revenue: 720000, bookings: 640, loadFactor: 91 },
    { month: "Jun", revenue: 890000, bookings: 790, loadFactor: 94 },
    { month: "Jul", revenue: 980000, bookings: 880, loadFactor: 96 },
    { month: "Aug", revenue: 940000, bookings: 850, loadFactor: 95 },
  ];

  const popularRoutes = stats?.popularRoutes || [
    { route: "JFK ⇄ LHR", volume: "1,420 trips", revenue: "$824,000", onTime: "96.4%" },
    { route: "SFO ⇄ HND", volume: "1,180 trips", revenue: "$967,600", onTime: "98.1%" },
    { route: "LAX ⇄ SYD", volume: "840 trips", revenue: "$991,200", onTime: "95.8%" },
    { route: "LHR ⇄ DXB", volume: "990 trips", revenue: "$613,800", onTime: "97.2%" },
    { route: "SIN ⇄ HND", volume: "780 trips", revenue: "$382,200", onTime: "99.0%" },
  ];

  const recentBookings = stats?.recentBookings || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Operations Telemetry
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Executive Airline Operations Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time flight reservations, gross transoceanic revenue, load factor telemetry, and fleet health.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            ${metrics.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% vs last month
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            {metrics.activeBookingsCount.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-sky-600 flex items-center gap-1">
            <span>{metrics.totalPassengers.toLocaleString()} Total Passengers</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Load Factor</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            {metrics.averageLoadFactor}
          </div>
          <div className="text-[11px] font-semibold text-indigo-600">
            {metrics.totalFlights} Scheduled Flights Active
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Search Conversion</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            {metrics.conversionRate}
          </div>
          <div className="text-[11px] font-semibold text-slate-500">
            Industry Benchmark: 3.1%
          </div>
        </div>
      </div>

      {/* Revenue & Load Factor Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Monthly Revenue & Volume Dynamics</h3>
            <p className="text-xs text-slate-500">
              Aggregated gross flight ticket sales across transoceanic corridors.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-sky-600" />
              <span>Revenue ($)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-indigo-500" />
              <span>Bookings</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: 12,
                  color: "#ffffff",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="revenue" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Popular Routes & Recent Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Routes Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">High-Yield Corridors</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase">
                  <th className="pb-3 font-semibold">Airway Route</th>
                  <th className="pb-3 font-semibold">Passenger Volume</th>
                  <th className="pb-3 font-semibold">Total Revenue</th>
                  <th className="pb-3 font-semibold text-right">On-Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {popularRoutes.map((r: { route: string; volume: string; revenue: string; onTime: string }, idx: number) => (
                  <tr key={idx}>
                    <td className="py-3 font-bold text-slate-900 font-mono">{r.route}</td>
                    <td className="py-3">{r.volume}</td>
                    <td className="py-3 font-mono font-bold text-sky-600">{r.revenue}</td>
                    <td className="py-3 text-right font-bold text-emerald-600">{r.onTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Live Bookings Feed */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Recent Passenger Bookings</h3>
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((b: { pnr: string; userEmail: string; cabinClass: string; totalAmount: number; status: string }) => (
                <div
                  key={b.pnr}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-slate-900">{b.pnr}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium truncate max-w-[140px]">
                        {b.userEmail}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      {b.cabinClass} Class • ${b.totalAmount} USD
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Live reservations will stream here as tickets are booked.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
