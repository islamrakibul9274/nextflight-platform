"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plane, Mail, ArrowRight, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send reset link.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Try again.");
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset Password</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your email address and we will dispatch a secure password reset link.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 space-y-6">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-base font-bold text-slate-900">Reset Email Dispatched</h3>
              <p className="text-xs text-slate-500">
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly. The link expires in 15 minutes.
              </p>
              <Link href="/login" className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label htmlFor="forgot-email" className="text-xs font-bold text-slate-700 block mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden />
                  <input
                    id="forgot-email"
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

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full py-3.5 bg-slate-900 hover:bg-sky-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? "Sending..." : "Send Reset Link"}</span>
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </form>
          )}

          <div className="border-t border-slate-100 pt-4 text-center">
            <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
