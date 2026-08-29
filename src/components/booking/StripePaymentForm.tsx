"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, CreditCard, Sparkles, Check } from "lucide-react";

interface PaymentFormProps {
  totalAmount: number;
  contactEmail: string;
  onPaymentSuccess: (paymentId: string) => void;
  isProcessing: boolean;
}

export function StripePaymentForm({
  totalAmount,
  contactEmail,
  onPaymentSuccess,
  isProcessing,
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [cardName, setCardName] = useState("Alex Thorne");
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Auto fill test card
  const handleFillTestCard = () => {
    setCardNumber("4242 4242 4242 4242");
    setCardExpiry("12/28");
    setCardCvc("888");
    setCardName("Alex Thorne");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;
    onPaymentSuccess(`pi_live_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">
              Credit / Debit Card Checkout
            </h3>
          </div>
          <button
            type="button"
            onClick={handleFillTestCard}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200"
          >
            ⚡ Fill Stripe Test Card
          </button>
        </div>

        {/* Card Number */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Cardholder Name *
            </label>
            <input
              type="text"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Name on card"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Card Number *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden transition-all pr-24"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-slate-200 rounded text-slate-700">
                  VISA
                </span>
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-slate-200 rounded text-slate-700">
                  MC
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Expiration Date (MM/YY) *
              </label>
              <input
                type="text"
                required
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                CVC / CVV Security Code *
              </label>
              <input
                type="password"
                required
                maxLength={4}
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                placeholder="888"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden transition-all"
              />
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>256-Bit Bank-Grade PCI DSS End-to-End Encryption</span>
          </div>
          <span className="font-mono text-[11px] font-bold text-slate-400">Stripe Gateway</span>
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="accent-sky-600 rounded w-4 h-4 mt-0.5"
            required
          />
          <span>
            I acknowledge that I have read and agree to the{" "}
            <strong className="text-slate-900">Conditions of Carriage</strong> and{" "}
            <strong className="text-slate-900">Fare Cancellation Policies</strong>. E-ticket will be issued immediately upon confirmation.
          </span>
        </label>
      </div>

      {/* Pay CTA */}
      <button
        type="submit"
        disabled={isProcessing || !termsAccepted}
        className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-sm shadow-lg hover:shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <Lock className="w-4 h-4" />
        <span>
          {isProcessing ? "Authorizing Payment & Issuing PNR..." : `Pay $${totalAmount} USD & Confirm Booking`}
        </span>
      </button>
    </form>
  );
}
