"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Dialog } from "@/components/ui/Dialog";
import { TierBadge } from "@/components/ui/TierBadge";
import {
  Plane,
  User,
  LogOut,
  Ticket,
  Compass,
  Crown,
  Shield,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  CircleHelp,
} from "lucide-react";

const links = [
  { name: "Flights", href: "/search", icon: Plane },
  { name: "Destinations", href: "/#destinations", icon: Compass },
  { name: "Membership", href: "/membership", icon: Crown },
  { name: "Travel help", href: "/help", icon: CircleHelp },
  { name: "My trips", href: "/my-trips", icon: Ticket },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { notify } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    // Route changes close both navigation surfaces, including browser back/forward.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!profileOpen) return;
    const onClick = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node))
        setProfileOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logout();
      setProfileOpen(false);
      setMobileOpen(false);
    } catch {
      notify(
        "We couldn't sign you out. Check your connection and try again.",
        "error",
      );
    } finally {
      setSigningOut(false);
    }
  };
  const isActive = (href: string) =>
    pathname === href ||
    (href === "/search" &&
      (pathname === "/flights" || pathname.startsWith("/flight/")));
  return (
    <header className="site-header">
      <div className="page-container flex h-[76px] items-center justify-between gap-5">
        <Link
          href="/"
          aria-label="NextFlight home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="brand-symbol">
            <Plane
              size={20}
              strokeWidth={1.7}
              className="-rotate-45"
              aria-hidden="true"
            />
          </span>
          <span className="text-xl font-semibold tracking-[-0.06em] text-slate-900">
            nextflight<span className="text-sky-600">.</span>
          </span>
        </Link>
        <nav aria-label="Main" className="hidden xl:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`nav-link ${isActive(link.href) ? "is-active" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="hidden xl:flex items-center gap-2">
          {loading ? (
            <div
              className="h-10 w-40 animate-pulse rounded-xl bg-slate-100"
              aria-label="Loading account"
            />
          ) : user ? (
            <>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  aria-label="Admin console"
                  title="Admin console"
                  className="rounded-xl p-3 text-slate-500 hover:bg-slate-100"
                >
                  <Shield size={17} aria-hidden="true" />
                </Link>
              )}
              <div
                ref={profileRef}
                className="relative"
                onBlur={(event) => {
                  if (
                    !event.currentTarget.contains(
                      event.relatedTarget as Node | null,
                    )
                  )
                    setProfileOpen(false);
                }}
              >
                <button
                  ref={profileButtonRef}
                  type="button"
                  aria-expanded={profileOpen}
                  aria-controls="account-panel"
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-sm text-slate-700"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white"
                    aria-hidden="true"
                  >
                    {(user.name || user.email || "N").charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-24 truncate">
                    {user.name || "My account"}
                  </span>
                  <ChevronDown size={13} aria-hidden="true" />
                </button>
                {profileOpen && (
                  <div
                    id="account-panel"
                    className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                  >
                    <div className="mb-1 border-b border-slate-100 px-3 py-3">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-slate-900">
                          {user.name}
                        </span>
                        <TierBadge tier={user.membershipTier} />
                      </div>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                    <Link href="/profile" className="account-link">
                      <User size={16} aria-hidden="true" />
                      Account & travelers
                    </Link>
                    <Link href="/my-trips" className="account-link">
                      <Ticket size={16} aria-hidden="true" />
                      My trips & tickets
                    </Link>
                    <Link href="/membership" className="account-link">
                      <Crown size={16} aria-hidden="true" />
                      Membership
                    </Link>
                    <button
                      type="button"
                      disabled={signingOut}
                      onClick={signOut}
                      className="account-link w-full text-rose-600"
                    >
                      <LogOut size={16} aria-hidden="true" />
                      {signingOut ? "Signing out…" : "Sign out"}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">
                Sign in
              </Link>
              <Link href="/register" className="button-primary text-xs">
                Get started <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 xl:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>
      {mobileOpen && (
        <Dialog
          title="Navigation"
          onClose={() => setMobileOpen(false)}
          className="self-start mt-3 max-w-lg"
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="text-lg font-semibold tracking-tight">
              Where to next?
            </span>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <nav id="mobile-nav" aria-label="Mobile" className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`account-link min-h-12 ${isActive(link.href) ? "bg-sky-50 text-sky-700" : ""}`}
              >
                <link.icon size={18} aria-hidden="true" />
                {link.name}
                <ArrowUpRight
                  size={14}
                  className="ml-auto text-slate-400"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>
          <div className="mt-5 border-t border-slate-100 pt-4">
            {user ? (
              <div className="space-y-1">
                <Link href="/profile" className="account-link">
                  <User size={17} aria-hidden="true" />
                  Account & travelers
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin/dashboard" className="account-link">
                    <Shield size={17} aria-hidden="true" />
                    Admin console
                  </Link>
                )}
                <button
                  type="button"
                  onClick={signOut}
                  disabled={signingOut}
                  className="account-link w-full text-rose-600"
                >
                  <LogOut size={17} aria-hidden="true" />
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" className="button-secondary justify-center">
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="button-primary justify-center"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </header>
  );
}
