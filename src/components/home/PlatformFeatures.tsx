import Link from "next/link";
import { Search, Armchair, Ticket, ArrowUpRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Find your kind of flight.",
    text: "Compare dates, cabins, and airlines. Narrow it down to the journey that works for you.",
  },
  {
    icon: Armchair,
    number: "02",
    title: "Make yourself comfortable.",
    text: "Review your fare, choose your seat, and add the extras you need before checkout.",
  },
  {
    icon: Ticket,
    number: "03",
    title: "Keep your plans together.",
    text: "Your booking details and tickets, all in My Trips. Ready whenever you need them.",
  },
];

export function PlatformFeatures() {
  return (
    <section className="landing-section bg-white">
      <div className="page-container">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">LESS PLANNING. MORE POSSIBILITY.</p>
            <h2 className="section-heading">From “what if” to wheels up.</h2>
          </div>
          <Link href="/help" className="text-link">
            A little help along the way{" "}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map((step) => (
            <article key={step.number} className="journey-step">
              <div className="mb-7 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-[#f5f8fa] text-[#376477]">
                  <step.icon size={23} strokeWidth={1.4} aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-slate-400">
                  / {step.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
