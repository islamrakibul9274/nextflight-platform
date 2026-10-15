"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock, AlertCircle, Copy, Check } from "lucide-react";
import { getStripePromise, DEMO_TEST_CARD } from "@/lib/stripe-client";

interface PaymentFormProps {
  totalAmount: number;
  contactEmail: string;
  onPaymentSuccess: (paymentId?: string) => void;
  isProcessing: boolean;
}

const CARD_STYLE = {
  style: {
    base: {
      fontSize: "14px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontWeight: "500",
      color: "#0f172a",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#e11d48" },
  },
};

function CheckoutInner({ totalAmount, contactEmail, onPaymentSuccess, isProcessing }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [localError, setLocalError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const [copied, setCopied] = useState(false);

  const busy = isProcessing || preparing;

  const copyTestCard = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_TEST_CARD.replace(/ /g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — card number is visible above
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!termsAccepted) {
      setLocalError("Accept the Conditions of Carriage to continue.");
      return;
    }
    if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      setLocalError("Enter a valid contact email before paying.");
      return;
    }
    if (!stripe || !elements) {
      setLocalError("Payment form is still loading. Wait a moment and retry.");
      return;
    }

    setPreparing(true);
    try {
      // 1. Create intent server-side (authoritative amount)
      const intentRes = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, customerEmail: contactEmail }),
      });
      const intent = await intentRes.json();
      if (!intentRes.ok) {
        setLocalError(intent.error || "Could not start payment. You can reserve instead.");
        return;
      }
      if (intent.mock || !intent.clientSecret) {
        // Dev without Stripe keys — reserve as PENDING instead of fake-charging
        onPaymentSuccess(undefined);
        return;
      }

      // 2. Confirm with the card entered in the Stripe-hosted field
      const card = elements.getElement(CardElement);
      if (!card) {
        setLocalError("Card field not ready. Retry.");
        return;
      }
      const { error, paymentIntent } = await stripe.confirmCardPayment(intent.clientSecret, {
        payment_method: { card, billing_details: { email: contactEmail } },
      });
      if (error) {
        setLocalError(error.message || "Card declined. Try the demo test card below.");
        return;
      }
      if (paymentIntent?.status !== "succeeded") {
        setLocalError(`Payment status: ${paymentIntent?.status || "unknown"}. Try again.`);
        return;
      }

      // 3. Server verifies the intent before marking PAID
      onPaymentSuccess(intent.paymentIntentId as string);
    } catch {
      setLocalError("Network error during payment. Try reserving instead.");
    } finally {
      setPreparing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Card payment</h3>
          <span className="font-mono text-[11px] font-bold text-slate-400">Secured by Stripe</span>
        </div>

        {localError && (
          <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
            <span>{localError}</span>
          </div>
        )}

        {/* Demo test-card hint — first-time-user friendly */}
        <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 text-xs text-slate-700">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="font-bold text-sky-900">Demo? Use the Stripe test card — no real charge.</p>
            <button
              type="button"
              onClick={copyTestCard}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-sky-200 text-sky-700 text-[11px] font-bold hover:bg-sky-100"
            >
              {copied ? <Check className="w-3.5 h-3.5" aria-hidden /> : <Copy className="w-3.5 h-3.5" aria-hidden />}
              <span>{copied ? "Copied" : "Copy card"}</span>
            </button>
          </div>
          <p className="mt-2 font-mono font-bold tracking-wide text-slate-900">
            {DEMO_TEST_CARD} <span className="text-slate-500 font-sans font-semibold">· 12/34 · 123</span>
          </p>
        </div>

        <div>
          <label htmlFor="stripe-card" className="text-xs font-bold text-slate-700 block mb-1.5">
            Card details
          </label>
          <div
            id="stripe-card"
            className="px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200 transition-all"
          >
            <CardElement options={CARD_STYLE} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
            <Lock className="w-3 h-3" aria-hidden /> Card entry is hosted by Stripe — we never see the number.
          </p>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="accent-sky-600 rounded w-4 h-4 mt-0.5"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="underline font-semibold text-slate-900">Conditions of Carriage</Link> and{" "}
            <Link href="/privacy" className="underline font-semibold text-slate-900">Privacy Policy</Link>.
          </span>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className="w-full py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lock className="w-4 h-4" aria-hidden />
          <span>{busy ? "Processing..." : `Pay $${totalAmount} USD`}</span>
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            if (!termsAccepted) {
              setLocalError("Accept the Conditions of Carriage to continue.");
              return;
            }
            onPaymentSuccess(undefined);
          }}
          className="w-full py-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all disabled:opacity-50"
        >
          Reserve now, pay later
        </button>
      </div>
    </form>
  );
}

export function StripePaymentForm(props: PaymentFormProps) {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    // No publishable key (e.g. fresh clone): reserve-only mode, still demoable
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Card payment unavailable</h3>
          <p className="text-xs text-slate-600">
            Stripe keys aren&apos;t configured, so checkout runs in reserve mode. Your booking will be created as PENDING.
          </p>
          <button
            type="button"
            disabled={props.isProcessing}
            onClick={() => props.onPaymentSuccess(undefined)}
            className="w-full py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm disabled:opacity-50"
          >
            {props.isProcessing ? "Processing..." : "Reserve booking"}
          </button>
        </div>
      </div>
    );
  }
  return (
    <Elements stripe={getStripePromise()}>
      <CheckoutInner {...props} />
    </Elements>
  );
}
