"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plane,
  Building2,
  Ticket,
  Users,
  Crown,
  Tag,
  CreditCard,
  BarChart3,
  Settings,
  DollarSign,
  ArrowLeft,
  Shield,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Flight Inventory", href: "/admin/flights", icon: Plane },
    { name: "Airports & Hubs", href: "/admin/airports", icon: Building2 },
    { name: "Bookings & PNRs", href: "/admin/bookings", icon: Ticket },
    { name: "Travelers & Users", href: "/admin/users", icon: Users },
    { name: "Memberships & Tiers", href: "/admin/memberships", icon: Crown },
    { name: "Coupons & Promos", href: "/admin/coupons", icon: Tag },
    { name: "Dynamic Pricing", href: "/admin/pricing", icon: DollarSign },
    { name: "Payment Ledger", href: "/admin/payments", icon: CreditCard },
    { name: "Route Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Platform Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col justify-between shrink-0 border-r border-slate-800">
      <div className="space-y-6">
        {/* Brand */}
        <div className="px-3 pt-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-wider font-mono">
                AETHERIA ADMIN
              </div>
              <div className="text-[10px] text-sky-400 font-medium">Enterprise Console</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Back Link */}
      <div className="pt-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Traveler Site</span>
        </Link>
      </div>
    </aside>
  );
}
