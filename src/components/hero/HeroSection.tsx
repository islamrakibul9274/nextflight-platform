"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSearchWidget } from "./HeroSearchWidget";
import {
  ShieldCheck,
  Zap,
  Plane,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Globe2,
  Clock,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-16 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Editorial Headline & Telemetry Strip */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 shadow-2xs text-xs font-semibold text-zinc-800">
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span className="text-zinc-950 font-bold uppercase tracking-wider text-[10px]">
              NextFlight Search
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-600">Direct Global Airline Inventory</span>
          </div>

          {/* Clean Google Flights Style Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-950 tracking-tight leading-[1.1]">
            Compare and book flights <br className="hidden sm:block" />
            <span className="text-blue-600">with confidence.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Search hundreds of global airline routes in milliseconds. Direct GDS live pricing, transparent baggage rules, and zero hidden fees.
          </p>
        </div>

        {/* Unified Search Engine Capsule */}
        <HeroSearchWidget />

        {/* Photorealistic Aircraft Hero Banner Card */}
        <div className="mt-12 relative rounded-3xl overflow-hidden border border-zinc-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] group">
          <div className="relative h-72 sm:h-96 w-full overflow-hidden">
            <Image
              src="/images/hero-airplane.jpg"
              alt="NextFlight Modern Aircraft in Stratospheric Flight"
              fill
              priority
              className="object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
            />
            {/* Subtle Gradient Overlay for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

            {/* Float Badges on Image */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 text-white max-w-lg space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-[11px] font-bold tracking-wide uppercase">
                <Plane className="w-3.5 h-3.5 -rotate-45" /> Next-Gen Fleet Comfort
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                Boeing 787-9 & Airbus A350-1000 Transoceanic Fleet
              </h3>
              <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed">
                Experience quiet cabins, Starlink in-flight WiFi, 180° lie-flat suites, and chef-curated dining across 180+ global gateways.
              </p>
            </div>

            {/* Telemetry Indicator Top Right */}
            <div className="absolute top-6 right-6 hidden sm:flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-300">Live Status:</span>
                <span className="font-bold text-white">FL380 Cruise</span>
              </div>
              <span className="text-zinc-600">|</span>
              <div className="text-zinc-300">
                Speed: <span className="font-bold text-white">560 kts</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center font-bold text-blue-600 shadow-2xs shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Direct GDS Live Rates</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Sub-second airline inventory</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center font-bold text-emerald-600 shadow-2xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Authoritative Price Lock</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Zero unexpected checkout fees</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center font-bold text-zinc-800 shadow-2xs shrink-0">
              <Plane className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Interactive Seat Maps</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Exact pitch & cabin layout</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center font-bold text-blue-600 shadow-2xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">24/7 AI Concierge</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Baggage, visa & flight intel</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
