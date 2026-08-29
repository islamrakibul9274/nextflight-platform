"use client";

import React from "react";
import Link from "next/link";
import { Plane, ShieldCheck, Globe, Heart, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-900">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Next<span className="text-blue-400">Flight</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The next-generation flight search and booking infrastructure. Direct GDS feeds, real-time seat availability, transparent baggage rules, and automated e-ticket issuance.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>IATA Certified Partner</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Global NDC Network</span>
              </div>
            </div>
          </div>

          {/* Sitemaps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Flight Discovery
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/search?from=JFK&to=LHR" className="hover:text-white transition-colors">
                  New York → London
                </Link>
              </li>
              <li>
                <Link href="/search?from=SFO&to=HND" className="hover:text-white transition-colors">
                  San Francisco → Tokyo
                </Link>
              </li>
              <li>
                <Link href="/search?from=DXB&to=SIN" className="hover:text-white transition-colors">
                  Dubai → Singapore
                </Link>
              </li>
              <li>
                <Link href="/search?from=LAX&to=SYD" className="hover:text-white transition-colors">
                  Los Angeles → Sydney
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Privileges & Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/membership" className="hover:text-white transition-colors">
                  Stratosphere Club
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Fare Class Comparison
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  AI Travel Concierge
                </Link>
              </li>
              <li>
                <Link href="/my-trips" className="hover:text-white transition-colors">
                  Boarding Pass & Manifest
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Corporate & Operations
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                  Enterprise Admin Console
                </Link>
              </li>
              <li>
                <Link href="/admin/flights" className="hover:text-white transition-colors">
                  Flight Schedule Manager
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className="hover:text-white transition-colors">
                  API Gateway & Adapters
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} NextFlight Aviation Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Conditions of Carriage</span>
            <span className="hover:text-white cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
