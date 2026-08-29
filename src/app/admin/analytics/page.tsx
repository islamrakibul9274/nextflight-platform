"use client";

import React from "react";
import { BarChart3, TrendingUp, Globe, Users, ArrowUpRight, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminAnalyticsPage() {
  const demandTrends = [
    { day: "Mon", bookings: 120, searches: 2400 },
    { day: "Tue", bookings: 145, searches: 2800 },
    { day: "Wed", bookings: 190, searches: 3600 },
    { day: "Thu", bookings: 210, searches: 4100 },
    { day: "Fri", bookings: 280, searches: 5200 },
    { day: "Sat", bookings: 240, searches: 4800 },
    { day: "Sun", bookings: 310, searches: 5900 },
  ];

  const pieData = [
    { name: "North America (JFK/SFO/LAX)", value: 42, color: "#0284c7" },
    { name: "Europe (LHR/CDG/FRA)", value: 28, color: "#6366f1" },
    { name: "Asia-Pacific (HND/SIN/SYD)", value: 20, color: "#10b981" },
    { name: "Middle East (DXB/DOH)", value: 10, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Route Telemetry & Demand Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Search-to-booking conversion rates, peak flight days, and geographic corridor density.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Demand Line Chart */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Flight Booking Trajectory</h3>
              <p className="text-xs text-slate-500">Live booking volume vs search intent</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: 12,
                    color: "#ffffff",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ fill: "#0284c7", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Market Share */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">Geographic Regional Share</h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
