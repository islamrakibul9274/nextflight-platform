"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { TierBadge } from "@/components/ui/TierBadge";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getStripePromise, DEMO_TEST_CARD } from "@/lib/stripe-client";
import {
  Crown,
  Check,
  ArrowRight,
  AlertCircle,
  X,
} from "lucide-react";

type TierId = "VOYAGER" | "STRATOSPHERE" | "APEX";

function CheckoutDialog({
  tier,
  tierName,
  amount,
  billing,
  onClose,
  onDone,
}: {
  tier: TierId;
  tierName: string;
  amount: number;
  billing: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!stripe || !elements) {
      setError("Payment form is still loading. Wait a moment and retry.");
      return;
    }
    setPaying(true);
    try {
      const checkoutRes = await fetch("/api/memberships/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, billing }),
      });
      const checkout = await checkoutRes.json();
      if (!checkoutRes.ok) {
        setError(checkout.error || "Could not start checkout.");
        return;
      }
      if (checkout.mock || !checkout.clientSecret) {
        setError("Stripe is not configured for memberships yet. Try again later.");
        return;
      }
      const card = elements.getElement(CardElement);
      if (!card) {
        setError("Card field not ready. Retry.");
        return;
      }
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        checkout.clientSecret,
        { payment_method: { card } }
      );
      if (stripeError) {
        setError(stripeError.message || "Card declined. Try the demo test card.");
        return;
      }
      if (paymentIntent?.status !== "succeeded") {
        setError(`Payment status: ${paymentIntent?.status || "unknown"}.`);
        return;
      }
      const confirmRes = await fetch("/api/memberships/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, billing, paymentIntentId: checkout.paymentIntentId }),
      });
      const confirmed = await confirmRes.json();
      if (!confirmRes.ok) {
        setError(confirmed.error || "Payment succeeded but activation failed. Contact support.");
        return;
      }
      onDone();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-checkout-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/40"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 sm:p-8 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 id="member-checkout-title" className="text-lg font-extrabold text-slate-900">
              Upgrade to {tierName}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              ${amount} {billing === "yearly" ? "per year" : "per month"} · test mode, no real charge
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3.5 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-sky-900">Demo card</span>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(DEMO_TEST_CARD.replace(/ /g, ""));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch { /* noop */ }
              }}
              className="px-2 py-1 rounded-lg bg-white border border-sky-200 text-sky-700 text-[11px] font-bold"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-1 font-mono font-bold text-slate-900">{DEMO_TEST_CARD} · 12/34 · 123</p>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Card details</label>
            <div className="px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
              <CardElement
                options={{
                  style: {
                    base: { fontSize: "14px", color: "#0f172a", "::placeholder": { color: "#94a3b8" } },
                    invalid: { color: "#e11d48" },
                  },
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={paying}
            aria-busy={paying}
            className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paying ? "Processing..." : `Pay $${amount} & activate`}
          </button>
        </form>
      </div>
    </div>
  );
}

function MembershipContent() {
  const { user, refreshUser } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [annualBilling, setAnnualBilling] = useState(true);
  const [checkoutTier, setCheckoutTier] = useState<TierId | null>(null);
  const [working, setWorking] = useState(false);
  const billing = annualBilling ? "yearly" : "monthly";

  const tiers = [
    {
      id: "VOYAGER" as TierId,
      name: "Silver Voyager",
      tagline: "Essential privileges for occasional global travelers.",
      priceMonth: 0,
      priceYear: 0,
      discount: "0%",
      perks: [
        "Real-time flight tracking",
        "Standard seat selection at check-in",
        "1x 8kg cabin + 1x 23kg checked bag",
        "Digital e-ticket sync",
        "Standard 24h change window",
      ],
      current: user?.membershipTier === "VOYAGER",
      cta: "Downgrade to Voyager",
    },
    {
      id: "STRATOSPHERE" as TierId,
      name: "Gold Stratosphere",
      tagline: "Flexibility, lounge passes, and guaranteed flight savings.",
      priceMonth: 19,
      priceYear: 190,
      discount: "15% Off All Flights",
      badge: "Most Popular",
      perks: [
        "15% automatic discount on every route",
        "Free seat selection on every booking",
        "Unlimited airport lounge passes",
        "+1 extra 23kg checked bag",
        "Priority security lane clearance",
        "Free date changes, 100% cash refunds",
      ],
      current: user?.membershipTier === "STRATOSPHERE",
      cta: "Upgrade to Stratosphere",
      highlight: true,
    },
    {
      id: "APEX" as TierId,
      name: "Apex Black",
      tagline: "The pinnacle of bespoke global luxury.",
      priceMonth: 49,
      priceYear: 490,
      discount: "20% Off All Flights",
      perks: [
        "20% automatic discount on every route",
        "Free seat selection on every booking",
        "Lounges worldwide with +2 guests",
        "Chauffeur airport transfer (40 mi)",
        "Zero cancellation fees, 100% instant refund",
        "Private charter fleet invitations",
      ],
      current: user?.membershipTier === "APEX",
      cta: "Upgrade to Apex Black",
    },
  ];

  const handleCta = async (tierId: TierId) => {
    if (!user) {
      router.push("/login?next=/membership");
      return;
    }
    if (tierId === "VOYAGER") {
      setWorking(true);
      try {
        const res = await fetch("/api/memberships/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier: "VOYAGER" }),
        });
        const data = await res.json();
        if (!res.ok) {
          notify(data.error || "Downgrade failed.", "error");
          return;
        }
        await refreshUser();
        notify("Downgraded to Silver Voyager.", "success");
      } catch {
        notify("Network error.", "error");
      } finally {
        setWorking(false);
      }
      return;
    }
    setCheckoutTier(tierId);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-500" aria-hidden /> Stratosphere Club Tiers
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Elevate Every Stage of Your Voyage
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Guaranteed flight savings, free seat selection, lounge access, and 100% refunds for members.
            {user && (
              <span className="ml-2">
                Your tier: <TierBadge tier={user.membershipTier} />
              </span>
            )}
          </p>

          <div className="mt-8 inline-flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs" role="group" aria-label="Billing period">
            <button
              onClick={() => setAnnualBilling(false)}
              aria-pressed={!annualBilling}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                !annualBilling ? "bg-sky-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              aria-pressed={annualBilling}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                annualBilling ? "bg-sky-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950">
                Save ~17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {tiers.map((t) => {
            const price = annualBilling ? t.priceYear : t.priceMonth;
            return (
              <div
                key={t.id}
                className={`relative rounded-3xl p-8 transition-all flex flex-col justify-between bg-white text-slate-900 border shadow-2xs ${
                  t.highlight ? "border-sky-500 ring-2 ring-sky-500 shadow-lg lg:-translate-y-2" : "border-slate-200"
                }`}
              >
                {t.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-sky-600 text-white font-bold text-[11px] uppercase tracking-wide shadow-sm">
                    {t.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold">{t.name}</h3>
                    <Crown className="w-5 h-5 text-amber-500" aria-hidden />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{t.tagline}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono">${annualBilling ? Math.round(price / 12) : price}</span>
                    <span className="text-xs text-slate-500">
                      / month {annualBilling && price > 0 ? `(billed $${price}/yr)` : ""}
                    </span>
                  </div>

                  <div className="border-t my-6 border-slate-100" />

                  <ul className="space-y-3">
                    {t.perks.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-sky-600" aria-hidden />
                        <span className="text-slate-700">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    disabled={t.current || working}
                    onClick={() => handleCta(t.id)}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                      t.current
                        ? "bg-slate-100 text-slate-400 border border-slate-200"
                        : t.highlight
                          ? "bg-sky-600 hover:bg-sky-700 text-white shadow-md"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <span>{t.current ? "Active Tier ✓" : t.cta}</span>
                    {!t.current && <ArrowRight className="w-4 h-4" aria-hidden />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-2xs overflow-x-auto">
          <h3 className="text-lg font-bold text-slate-900 mb-6">What members actually get (enforced in code)</h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase">
                <th className="py-3 font-semibold">Privilege</th>
                <th className="py-3 font-semibold">Silver Voyager</th>
                <th className="py-3 font-semibold text-sky-600">Gold Stratosphere</th>
                <th className="py-3 font-semibold text-indigo-600">Apex Black</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr>
                <td className="py-3 font-bold text-slate-900">Flight fare discount</td>
                <td className="py-3">Standard fares</td>
                <td className="py-3 text-sky-600 font-bold">15% off, automatic</td>
                <td className="py-3 text-indigo-600 font-bold">20% off, automatic</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Seat selection fee</td>
                <td className="py-3">Paid</td>
                <td className="py-3 text-emerald-600 font-bold">Free</td>
                <td className="py-3 text-emerald-600 font-bold">Free</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Cancellation refund</td>
                <td className="py-3">85% (minus $50 fee)</td>
                <td className="py-3 text-emerald-600 font-bold">100%</td>
                <td className="py-3 text-emerald-600 font-bold">100% instant</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Verified tier badge</td>
                <td className="py-3">—</td>
                <td className="py-3 text-emerald-600 font-bold">Gold check ✓</td>
                <td className="py-3 text-emerald-600 font-bold">Apex check ✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {checkoutTier && (
        <Elements stripe={getStripePromise()}>
          <CheckoutDialog
            tier={checkoutTier}
            tierName={checkoutTier === "STRATOSPHERE" ? "Gold Stratosphere" : "Apex Black"}
            amount={checkoutTier === "STRATOSPHERE" ? (annualBilling ? 190 : 19) : annualBilling ? 490 : 49}
            billing={billing}
            onClose={() => setCheckoutTier(null)}
            onDone={async () => {
              setCheckoutTier(null);
              await refreshUser();
            }}
          />
        </Elements>
      )}
    </div>
  );
}

export default function MembershipPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Loading memberships...</div>}>
      <MembershipContent />
    </Suspense>
  );
}
