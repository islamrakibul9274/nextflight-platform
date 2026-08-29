"use client";

import React, { useState, useEffect, useRef } from "react";
import { ScrollFlightCanvas } from "./ScrollFlightCanvas";
import { HeroSearchWidget } from "./HeroSearchWidget";
import { ShieldCheck, Compass, Sparkles, ChevronDown } from "lucide-react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.clientHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[260vh] bg-white">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between pt-20 pb-10">
        {/* Three.js Canvas Layer */}
        <ScrollFlightCanvas scrollProgress={scrollProgress} />

        {/* Ambient Subtle Gradient Tints */}
        <div className="absolute inset-0 bg-radial from-sky-100/40 via-transparent to-white/70 pointer-events-none z-1" />

        {/* Top Header Story & Telemetry */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col items-center text-center space-y-4 pt-4 sm:pt-8">
            {/* Live Telemetry Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/5 backdrop-blur-md border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              <span className="font-mono uppercase tracking-wider text-[11px]">
                {scrollProgress < 0.25
                  ? "Phase 01 // Tarmac Clearance & Pre-Flight"
                  : scrollProgress < 0.5
                  ? "Phase 02 // Rotation & High-Angle Climb"
                  : scrollProgress < 0.75
                  ? "Phase 03 // Stratospheric Cruise — FL380"
                  : "Phase 04 // Approach & Destination Landing"}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-sky-600 font-mono text-[11px]">
                Alt: {Math.round(2000 + scrollProgress * 36000).toLocaleString()} FT
              </span>
            </div>

            {/* Dynamic Scrolling Headlines with Opacity Transitions */}
            <div className="relative h-28 sm:h-32 w-full max-w-4xl flex items-center justify-center">
              {/* Phase 1 Overlay */}
              <div
                className={`absolute transition-all duration-500 transform ${
                  scrollProgress < 0.28
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
                }`}
              >
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight font-sans">
                  Your next journey,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
                    beautifully booked.
                  </span>
                </h1>
                <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal">
                  Ultra-fast flight intelligence, transparent airline pricing, and bespoke cabin comfort engineered for the discerning traveler.
                </p>
              </div>

              {/* Phase 2 Overlay */}
              <div
                className={`absolute transition-all duration-500 transform ${
                  scrollProgress >= 0.28 && scrollProgress < 0.55
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                }`}
              >
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Aviation Reimagined for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                    Pure Speed.
                  </span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                  Instant search across 180+ global airports, real-time seat pitch telemetry, and zero hidden baggage fees.
                </p>
              </div>

              {/* Phase 3 Overlay */}
              <div
                className={`absolute transition-all duration-500 transform ${
                  scrollProgress >= 0.55 && scrollProgress < 0.8
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                }`}
              >
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Stratospheric Luxury.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">
                    Direct Connections.
                  </span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                  Fly Boeing 787-9 Dreamliners and Airbus A350-1000s with private lie-flat sky suites and chef-curated dining.
                </p>
              </div>

              {/* Phase 4 Overlay */}
              <div
                className={`absolute transition-all duration-500 transform ${
                  scrollProgress >= 0.8
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                }`}
              >
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Destination Unlocked.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-slate-900">
                    Select Your Route.
                  </span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                  Book direct with instant confirmation, e-ticket issuance, and 24/7 dedicated AI concierge support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Flight Search Component Docked in Hero */}
        <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 mt-auto pb-4">
          <HeroSearchWidget />

          {/* Scroll Hint indicator */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              Scroll to explore flight trajectory
              <ChevronDown className="w-3.5 h-3.5 animate-bounce text-slate-400 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
