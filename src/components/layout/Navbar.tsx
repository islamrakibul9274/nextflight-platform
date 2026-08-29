"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Plane,
  Compass,
  Crown,
  HelpCircle,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Ticket,
  Sparkles,
  Shield,
} from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Flights", href: "/search", icon: Plane },
    { name: "Explore", href: "/#destinations", icon: Compass },
    { name: "Membership", href: "/membership", icon: Crown },
    { name: "Pricing", href: "/pricing", icon: Sparkles },
    { name: "AI Concierge", href: "/help", icon: HelpCircle },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3.5"
          : "bg-white/60 backdrop-blur-xs border-b border-slate-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-sky-600 transition-colors">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider text-slate-900 font-sans">
                AETHERIA
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-sky-600 -mt-1">
                Aviation Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "text-sky-600 bg-sky-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Profile Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-sky-600 font-medium">
                      {user.membershipTier}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        {user.membershipTier} Tier
                      </span>
                    </div>

                    <Link
                      href="/my-trips"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Ticket className="w-4 h-4 text-slate-400" />
                      My Trips & E-Tickets
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Profile & Travelers
                    </Link>

                    <Link
                      href="/membership"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Crown className="w-4 h-4 text-amber-500" />
                      Membership Perks
                    </Link>

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50/50 hover:bg-purple-50"
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        Admin Portal
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Icon className="w-4 h-4 text-sky-600" />
                {link.name}
              </Link>
            );
          })}

          <div className="border-t border-slate-100 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-xs text-slate-500">Logged in as</p>
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                </div>
                <Link
                  href="/my-trips"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <Ticket className="w-4 h-4" /> My Trips
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <UserIcon className="w-4 h-4" /> Profile & Saved Travelers
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
