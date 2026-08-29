"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Aetheria provide authoritative real-time pricing?",
      a: "Aetheria links directly to global airline GDS and NDC aeronautical telemetry APIs. When you search or reserve a seat on our platform, the fare is immediately locked and verified on the authoritative central ledger, eliminating price jumps during checkout.",
    },
    {
      q: "What is included with my ticket baggage allowance?",
      a: "All standard Economy tickets include 1x 8kg cabin bag and 1x 23kg checked bag. Premium Economy and Business Class tickets include 2x 23kg or 2x 32kg checked bags respectively. Stratosphere Club members receive +1 additional checked bag complimentary on every flight.",
    },
    {
      q: "How does the flexible cancellation and refund policy work?",
      a: "All Business Class, First Class, and tickets purchased with Travel Insurance are 100% refundable up to 2 hours before scheduled departure. Standard Economy tickets can be cancelled for an 85% automated instant refund with no voucher lock-in.",
    },
    {
      q: "How do I upgrade to the Stratosphere Club membership?",
      a: "You can upgrade directly via the Membership tab or during flight checkout. Stratosphere membership gives you an automatic 15% discount on all flights, unlimited VIP lounge access, and free seat selection.",
    },
    {
      q: "Can I choose my specific seat and view aircraft specs?",
      a: "Yes! During Step 3 of our booking engine, an interactive visual seat map displays exact cabin zones (Lie-flat suites, extra legroom, exit rows), aircraft model dimensions (Boeing 787-9 vs Airbus A350-1000), power outlets, and WiFi availability.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" /> Travel Knowledge Base
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Everything you need to know about our booking platform and flight policies.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base font-bold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-sky-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
