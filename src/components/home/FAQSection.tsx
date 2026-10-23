"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
const questions = [
  {
    question: "How do I find the right flight?",
    answer:
      "Choose your departure and arrival airports, travel date, and cabin. You can then compare available flights, sort by price or duration, and filter by airline, departure time, or refundability.",
  },
  {
    question: "Where can I see baggage allowances?",
    answer:
      "Each flight card shows its checked-baggage allowance. Expand the flight details to see cabin and checked bags together, then review any additional baggage charges during booking.",
  },
  {
    question: "Can I choose my seat?",
    answer:
      "Yes. The seat-selection step shows the cabin layout and available seats. Seat fees and any membership benefits are shown before you confirm your selection.",
  },
  {
    question: "How do cancellations and refunds work?",
    answer:
      "Refund eligibility depends on your fare and booking conditions. Review these before paying. You can find your reservation and available cancellation options in My Trips.",
  },
  {
    question: "Do I need a membership to book?",
    answer:
      "No paid membership is required. You can book with a free account, or compare the Stratosphere Club plans if you would like additional benefits.",
  },
];
export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section className="landing-section border-t border-slate-200/70 bg-[#f8fafb]">
      <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="section-kicker">A FEW GOOD ANSWERS</p>
          <h2 className="section-heading">
            Before you
            <br className="hidden lg:block" /> take off.
          </h2>
          <p className="section-description max-w-xs">
            A little clarity makes the journey easier.
          </p>
          <Link href="/help" className="text-link mt-6">
            Talk to our travel concierge{" "}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="divide-y divide-slate-200">
          {questions.map((item, index) => (
            <div key={item.question}>
              <h3>
                <button
                  id={`${id}-question-${index}`}
                  type="button"
                  aria-expanded={open === index}
                  aria-controls={`${id}-answer-${index}`}
                  onClick={() => setOpen(open === index ? null : index)}
                  className="flex w-full items-center justify-between gap-5 py-5 text-left text-sm font-semibold leading-relaxed text-slate-800"
                >
                  <span>{item.question}</span>
                  <Plus
                    size={17}
                    className={`shrink-0 text-slate-400 transition-transform ${open === index ? "rotate-45" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <div
                id={`${id}-answer-${index}`}
                role="region"
                aria-labelledby={`${id}-question-${index}`}
                hidden={open !== index}
                className="pb-6 pr-8 text-sm leading-7 text-slate-500"
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
