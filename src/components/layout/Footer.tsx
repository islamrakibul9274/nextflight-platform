"use client";

import React from "react";
import Link from "next/link";
import { Plane, ShieldCheck, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-200">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white">
                <Plane className="w-5 h-5 -rotate-45" aria-hidden />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Next<span className="text-sky-600">Flight</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              The next-generation flight search and booking infrastructure. Direct GDS feeds, real-time seat availability, transparent baggage rules, and automated e-ticket issuance.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden />
                <span>IATA Certified Partner</span>
              </div>
              <span aria-hidden>•</span>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-sky-600" aria-hidden />
                <span>Global NDC Network</span>
              </div>
            </div>
          </div>

          {/* Sitemaps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Flight Discovery
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
              <li>
                <Link href="/search?from=JFK&to=LHR" className="hover:text-sky-600 transition-colors">
                  New York → London
                </Link>
              </li>
              <li>
                <Link href="/search?from=SFO&to=HND" className="hover:text-sky-600 transition-colors">
                  San Francisco → Tokyo
                </Link>
              </li>
              <li>
                <Link href="/search?from=DXB&to=SIN" className="hover:text-sky-600 transition-colors">
                  Dubai → Singapore
                </Link>
              </li>
              <li>
                <Link href="/search?from=LAX&to=SYD" className="hover:text-sky-600 transition-colors">
                  Los Angeles → Sydney
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Privileges & Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
              <li>
                <Link href="/membership" className="hover:text-sky-600 transition-colors">
                  Stratosphere Club
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-sky-600 transition-colors">
                  Fare Class Comparison
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-sky-600 transition-colors">
                  AI Travel Concierge
                </Link>
              </li>
              <li>
                <Link href="/my-trips" className="hover:text-sky-600 transition-colors">
                  Boarding Pass & Manifest
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Corporate
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
              <li>
                <Link href="/help" className="hover:text-sky-600 transition-colors">
                  Help & Concierge
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-sky-600 transition-colors">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/my-trips" className="hover:text-sky-600 transition-colors">
                  Manage My Trips
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} NextFlight Aviation Technologies Inc. All rights reserved.
          </div>
          <nav aria-label="Legal" className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-sky-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-sky-600 transition-colors">Conditions of Carriage</Link>
            <Link href="/security" className="hover:text-sky-600 transition-colors">Security Standards</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
