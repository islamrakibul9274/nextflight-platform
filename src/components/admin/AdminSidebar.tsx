"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();

  const links = [
    {
      name: "Overview Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
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
    <>
      <div className="border-b border-slate-200 bg-white p-4 lg:hidden">
        <label
          htmlFor="admin-navigation"
          className="mb-2 block text-xs font-semibold text-slate-500"
        >
          Operations navigation
        </label>
        <select
          id="admin-navigation"
          value={pathname}
          onChange={(event) => router.push(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800"
        >
          {links.map((link) => (
            <option key={link.href} value={link.href}>
              {link.name}
            </option>
          ))}
        </select>
      </div>
      <aside className="sticky top-[76px] hidden h-[calc(100dvh-76px)] w-60 shrink-0 flex-col justify-between overflow-y-auto border-r border-slate-200 bg-white p-4 text-slate-600 lg:flex">
        <div className="space-y-6">
          {/* Brand */}
          <div className="px-3 pt-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
                <Shield className="w-4 h-4" aria-hidden />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 tracking-wider font-mono">
                  NEXTFLIGHT ADMIN
                </div>
                <div className="text-[10px] text-sky-600 font-medium">
                  Operations Console
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav aria-label="Admin" className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-sky-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-sky-50"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Back Link */}
        <div className="pt-4 border-t border-slate-200">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            <span>Exit to Traveler Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
