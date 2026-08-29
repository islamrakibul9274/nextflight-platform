import React from "react";
import Link from "next/link";
import { Plane, ShieldCheck, Globe, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-950">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-bold text-lg tracking-wider text-white">
                AETHERIA
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The next-generation aviation intelligence platform. Direct connectivity, transparent pricing, and effortless journeys across 180+ global hubs.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-xs font-mono text-slate-400">
                Global Flight Telemetry: 99.98% On-Time Network
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Flight Matrix & Search
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-white transition-colors">
                  Stratosphere Club
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Fare Classes & Pricing
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  AI Travel Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Popular Routes
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search?from=JFK&to=LHR" className="hover:text-white transition-colors flex items-center gap-1">
                  New York (JFK) → London (LHR) <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href="/search?from=SFO&to=HND" className="hover:text-white transition-colors flex items-center gap-1">
                  San Francisco (SFO) → Tokyo (HND) <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href="/search?from=DXB&to=SIN" className="hover:text-white transition-colors flex items-center gap-1">
                  Dubai (DXB) → Singapore (SIN) <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href="/search?from=LAX&to=SYD" className="hover:text-white transition-colors flex items-center gap-1">
                  Los Angeles (LAX) → Sydney (SYD) <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Trust & Standards
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>IATA & FAA Certified Inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Carbon Offset Eligible</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold text-slate-300">
                  256
                </span>
                <span>PCI-DSS Level 1 Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Aetheria Aero Systems Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/help" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/help" className="hover:text-slate-400">Terms of Carriage</Link>
            <Link href="/help" className="hover:text-slate-400">Passenger Rights</Link>
            <Link href="/admin/dashboard" className="text-slate-600 hover:text-slate-400">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
