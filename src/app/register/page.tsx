"use client";

import React, { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Plane, Lock, Mail, User, Phone, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";

function getSafeNext(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

function passwordScore(pw: string): { score: number; label: string } {
  if (pw.length < 4) return { score: 0, label: "Too short" };
  if (pw.length < 6) return { score: 1, label: "Basic" };
  let score = 2;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score += 1;
  if (score <= 2) return { score, label: "OK for demo" };
  if (score === 3) return { score, label: "Good" };
  return { score: Math.min(score, 5), label: "Strong" };
}

function RegisterContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeNext(searchParams.get("next"));

  const strength = useMemo(() => passwordScore(password), [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Enter your full legal name (at least 2 characters).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(name.trim(), email.trim(), password, phone.trim() || undefined);
      if (res.success) {
        router.push(next || "/my-trips");
      } else {
        setError(res.error || "Failed to register account");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex items-center justify-center pt-20 pb-16 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-bold">
              <Plane className="w-5 h-5 -rotate-45" aria-hidden />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Next<span className="text-blue-600">Flight</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Your NextFlight Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Unlock direct booking rates, saved travelers, and automatic e-ticket synchronization.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 space-y-6">
          {error && (
            <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reg-name" className="text-xs font-bold text-slate-700 block mb-1.5">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden />
                <input
                  id="reg-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Alex Thorne"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-none focus:ring-2 focus:ring-sky-200 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="text-xs font-bold text-slate-700 block mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden />
                <input
                  id="reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-none focus:ring-2 focus:ring-sky-200 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-phone" className="text-xs font-bold text-slate-700 block mb-1.5">
                Mobile Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden />
                <input
                  id="reg-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-none focus:ring-2 focus:ring-sky-200 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="text-xs font-bold text-slate-700 block mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="At least 4 characters (e.g. 1234)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby="password-strength"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-none focus:ring-2 focus:ring-sky-200 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div id="password-strength" className="mt-2" aria-live="polite">
                  <div className="flex gap-1" aria-hidden>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${i <= strength.score ? (strength.score <= 2 ? "bg-rose-500" : strength.score === 3 ? "bg-amber-500" : "bg-emerald-500") : "bg-slate-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">
                    Strength: {strength.label} — 4+ characters is enough for this demo.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full py-3.5 bg-slate-900 hover:bg-sky-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Creating Account..." : "Create NextFlight Account"}</span>
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{" "}
          <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="font-bold text-slate-900 hover:text-sky-600">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Loading registration...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
