"use client";

import React, { useState, useEffect } from "react";
import { ScrollFlightCanvas } from "./ScrollFlightCanvas";
import { HeroSearchWidget } from "./HeroSearchWidget";
import { ShieldCheck, Zap, Plane, Sparkles } from "lucide-react";

export function HeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(Math.max(window.scrollY / Math.min(totalScroll, 1600), 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between pt-28 pb-16 overflow-hidden bg-clean-grid">
      {/* 3D Atmospheric Flight Trajectory Canvas */}
      <ScrollFlightCanvas scrollProgress={scrollProgress} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        {/* Editorial Headline & Telemetry Strip */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 shadow-2xs text-xs font-semibold text-zinc-800">
            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-zinc-950 font-bold uppercase tracking-wider text-[11px]">NextFlight 2.0</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-600">The Modern Standard for Flight Discovery</span>
          </div>

          {/* Precision Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-950 tracking-tight leading-[1.08]">
            Fly anywhere. <br className="hidden sm:block" />
            <span className="text-blue-600">
              Book in seconds.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Direct airline GDS inventory, verified seat availability, transparent baggage policies, and zero hidden checkout fees.
          </p>
        </div>

        {/* Search Engine Card */}
        <HeroSearchWidget />

        {/* Trust & Performance Proof Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-zinc-200 shadow-card-clean">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Direct GDS Feed</div>
              <div className="text-[10px] text-zinc-500">Live sub-second rates</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-zinc-200 shadow-card-clean">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Locked Pricing</div>
              <div className="text-[10px] text-zinc-500">Zero price jumps</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-zinc-200 shadow-card-clean">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold">
              <Plane className="w-4 h-4 -rotate-45 text-zinc-800" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Live 3D Seat Maps</div>
              <div className="text-[10px] text-zinc-500">Verified seat pitch</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-zinc-200 shadow-card-clean">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">AI Concierge</div>
              <div className="text-[10px] text-zinc-500">24/7 Smart assistance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
