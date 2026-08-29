"use client";

import React, { useState } from "react";
import { Settings, Database, RefreshCw, CheckCircle2, Shield, Globe, Radio } from "lucide-react";

export default function AdminSettingsPage() {
  const [provider, setProvider] = useState("INTERNAL_MOCK");
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState("");

  const handleTriggerSeed = async () => {
    setSeeding(true);
    setSeedResult("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedResult(`Database successfully populated with ${data.stats.airports} airports, ${data.stats.airlines} airlines, and ${data.stats.flights} realistic upcoming flights.`);
      } else {
        setSeedResult("Seeding failed: " + data.error);
      }
    } catch (e: unknown) {
      const err = e as Error;
      setSeedResult("Error triggering seed: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Platform Architecture & Gateway Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure flight provider adapters, database seeding routines, and external API webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Flight Inventory Provider Adapter */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-sky-600" />
            Flight Inventory Provider Engine
          </h3>
          <p className="text-xs text-slate-500">
            Aetheria is architected with provider-agnostic abstractions (<code className="font-mono text-sky-700 font-bold">FlightProvider</code> interface) allowing seamless switching between internal telemetry and live GDS / NDC feeds.
          </p>

          <div className="space-y-3">
            {[
              {
                id: "INTERNAL_MOCK",
                name: "Aetheria High-Fidelity Autonomous Engine (Active)",
                desc: "MongoDB Atlas cluster with 120+ realistic international scheduled flights, accurate routes, and dynamic seat inventory.",
              },
              {
                id: "EXTERNAL_AMADEUS",
                name: "Amadeus / Duffel NDC Enterprise Adapter",
                desc: "Live external API gateway. Switches when production GDS credentials are configured in environment variables.",
              },
            ].map((p) => (
              <label
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  provider === p.id
                    ? "border-sky-600 bg-sky-50/40"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="provider"
                  checked={provider === p.id}
                  onChange={() => setProvider(p.id)}
                  className="accent-sky-600 mt-0.5"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{p.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Database Seeder Control */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            Database Seed & Demonstration Reset
          </h3>
          <p className="text-xs text-slate-500">
            Reset or populate the MongoDB Atlas database with 24 international airports, premier airlines, upcoming flights across the next 60 days, coupons, and test traveler accounts.
          </p>

          {seedResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{seedResult}</span>
            </div>
          )}

          <button
            type="button"
            disabled={seeding}
            onClick={handleTriggerSeed}
            className="w-full py-3.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${seeding ? "animate-spin" : ""}`} />
            <span>{seeding ? "Seeding Global Airports & Flights..." : "Seed Database Now"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
