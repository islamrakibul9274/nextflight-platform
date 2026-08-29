"use client";

import React, { useState, useEffect } from "react";
import { ScrollFlightCanvas } from "./ScrollFlightCanvas";
import { HeroSearchWidget } from "./HeroSearchWidget";
import { ShieldCheck, Sparkles, Zap, Award, Compass, Plane } from "lucide-react";

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
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-16 overflow-hidden bg-mesh-canvas">
      {/* 3D Atmospheric Flight Trajectory Canvas */}
      <ScrollFlightCanvas scrollProgress={scrollProgress} />

      {/* Decorative Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-200/30 to-indigo-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        {/* Editorial Headline & Telemetry Strip */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-blue-600 font-extrabold uppercase tracking-wide">NextFlight 2.0</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">The New Standard in Aviation Booking</span>
          </div>

          {/* Majestic Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
            Fly anywhere. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Book in seconds.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ultra-fast flight discovery, transparent airline fares, interactive 3D seat selection, and 24/7 AI concierge intelligence designed for modern travelers.
          </p>
        </div>

        {/* Search Engine Card */}
        <HeroSearchWidget />

        {/* Trust & Performance Proof Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Direct GDS Inventory</div>
              <div className="text-[10px] text-slate-500">Sub-second live pricing</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Guaranteed Rates</div>
              <div className="text-[10px] text-slate-500">Zero hidden fees</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Plane className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Live 3D Cabin Maps</div>
              <div className="text-[10px] text-slate-500">Real seat pitch specs</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">AI Concierge</div>
              <div className="text-[10px] text-slate-500">24/7 Smart assistance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
