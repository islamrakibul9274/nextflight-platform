import { ShieldCheck, Luggage, Armchair, Ticket } from "lucide-react";
const assurances = [
  {
    icon: ShieldCheck,
    title: "Secure payment",
    detail: "Checkout powered by Stripe",
  },
  {
    icon: Luggage,
    title: "Baggage made clear",
    detail: "Review allowances before booking",
  },
  {
    icon: Armchair,
    title: "Your seat, your choice",
    detail: "Explore the cabin before you fly",
  },
  {
    icon: Ticket,
    title: "Everything together",
    detail: "Bookings and tickets in My Trips",
  },
];
export function TrustTelemetry() {
  return (
    <section
      aria-label="Travel with confidence"
      className="border-y border-slate-200/70 bg-[#f6f8fa]"
    >
      <div className="page-container grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {assurances.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <item.icon
              size={20}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-[#527c8a]"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-semibold text-slate-800">
                {item.title}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
