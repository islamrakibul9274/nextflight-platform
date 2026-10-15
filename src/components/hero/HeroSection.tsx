"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { HeroSearchWidget } from "./HeroSearchWidget";
import {
  ShieldCheck,
  Zap,
  Plane,
  Sparkles,
  TrendingDown,
  Clock,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const, delay: i * 0.09 },
  }),
};

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative pt-28 pb-16 overflow-hidden bg-white">
      {/* Atmospheric backdrop: route arcs + glow + dot grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-clean-grid opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[420px] bg-slate-200/50 blur-[120px] rounded-full" />
        <div className="absolute top-24 -left-32 w-96 h-96 bg-slate-100/80 blur-[100px] rounded-full" />
        <svg
          className="absolute top-16 left-0 w-full h-72 text-slate-300/70"
          viewBox="0 0 1200 280"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-20 250 C 250 250, 300 60, 600 60 S 950 250, 1220 180"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 8"
            strokeLinecap="round"
            className="route-dash"
          />
          <path
            d="M-20 270 C 300 270, 420 120, 700 120 S 1000 260, 1220 230"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 10"
            strokeLinecap="round"
            className="route-dash route-dash-slow opacity-60"
          />
          <circle cx="600" cy="60" r="5" fill="currentColor" opacity="0.9" />
          <circle cx="600" cy="60" r="10" fill="currentColor" opacity="0.25" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Editorial Headline & Telemetry Strip */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-4">
          <motion.div
            variants={fadeUp}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-sky-200/80 shadow-sm text-xs font-semibold text-slate-700"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-600" />
            </span>
            <span className="text-slate-900 font-bold uppercase tracking-wider text-[10px]">
              NextFlight Search
            </span>
            <span className="text-slate-300" aria-hidden>•</span>
            <span>Direct Global Airline Inventory</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            custom={1}
            className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.08]"
          >
            Compare and book flights <br className="hidden sm:block" />
            <span className="text-slate-950">with confidence.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            custom={2}
            className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Search hundreds of global airline routes in milliseconds. Direct GDS live pricing, transparent baggage rules, and zero hidden fees.
          </motion.p>
        </div>

        {/* Unified Search Engine Capsule */}
        <motion.div
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          custom={3}
          className="relative"
        >
          <div aria-hidden className="absolute -inset-3 bg-slate-950/[0.04] blur-2xl rounded-[2rem]" />
          <div className="relative">
            <HeroSearchWidget />
          </div>
        </motion.div>

        {/* Photorealistic Aircraft Hero Banner Card */}
        <motion.div
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          custom={4}
          className="mt-12 relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_24px_60px_-16px_rgba(2,132,199,0.25)] group"
        >
          <div className="relative h-72 sm:h-96 w-full overflow-hidden">
            <Image
              src="/images/hero-airplane.jpg"
              alt="Airliner wing above clouds at sunset"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            {/* Floating live cards */}
            <div className="absolute top-5 left-5 sm:top-8 sm:left-8 float-soft rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" aria-hidden />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">JFK → LHR today</div>
                <div className="text-sm font-extrabold text-slate-900">$420 <span className="text-emerald-600 font-bold">−12%</span></div>
              </div>
            </div>

            <div className="absolute bottom-24 right-5 sm:bottom-8 sm:right-8 float-soft float-delayed rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Clock className="w-4 h-4" aria-hidden />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">On-time arrivals</div>
                <div className="text-sm font-extrabold text-slate-900">96.4%</div>
              </div>
            </div>

            {/* Float Badges on Image */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 text-white max-w-lg space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-[11px] font-bold tracking-wide uppercase">
                <Plane className="w-3.5 h-3.5 -rotate-45" aria-hidden /> Next-Gen Fleet Comfort
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                Boeing 787-9 & Airbus A350-1000 Transoceanic Fleet
              </h3>
              <p className="hidden sm:block text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                Experience quiet cabins, Starlink in-flight WiFi, 180° lie-flat suites, and chef-curated dining across 180+ global gateways.
              </p>
            </div>

            {/* Telemetry Indicator Top Right */}
            <div className="absolute top-6 right-6 hidden sm:flex items-center gap-3 bg-slate-950/70 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">Live Status:</span>
                <span className="font-bold text-white">FL380 Cruise</span>
              </div>
              <span className="text-slate-500" aria-hidden>|</span>
              <div className="text-slate-300">
                Speed: <span className="font-bold text-white">560 kts</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Feature Highlights Grid */}
        <motion.div
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          custom={5}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { icon: Zap, tint: "text-blue-600 bg-blue-50", title: "Direct GDS Live Rates", sub: "Sub-second airline inventory" },
            { icon: ShieldCheck, tint: "text-emerald-600 bg-emerald-50", title: "Authoritative Price Lock", sub: "Zero unexpected checkout fees" },
            { icon: Plane, tint: "text-sky-600 bg-sky-50", title: "Interactive Seat Maps", sub: "Exact pitch & cabin layout" },
            { icon: Sparkles, tint: "text-violet-600 bg-violet-50", title: "24/7 AI Concierge", sub: "Baggage, visa & flight intel" },
          ].map((f) => (
            <div
              key={f.title}
              className="p-4 rounded-2xl bg-white/80 backdrop-blur border border-slate-200/80 flex items-start gap-3 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold shadow-2xs shrink-0 ${f.tint.split(" ")[0]}`}>
                <f.icon className="w-4 h-4" aria-hidden />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{f.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{f.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
