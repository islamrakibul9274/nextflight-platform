import Link from "next/link";
import { ArrowUpRight, Plane } from "lucide-react";

const routes = [
  {
    from: "JFK",
    origin: "New York",
    to: "LHR",
    destination: "London",
    description: "Across the Atlantic",
  },
  {
    from: "SFO",
    origin: "San Francisco",
    to: "HND",
    destination: "Tokyo",
    description: "A Pacific perspective",
  },
  {
    from: "DXB",
    origin: "Dubai",
    to: "SIN",
    destination: "Singapore",
    description: "Two cities. Endless possibilities.",
  },
  {
    from: "LAX",
    origin: "Los Angeles",
    to: "SYD",
    destination: "Sydney",
    description: "Your next southern escape",
  },
];

export function FeaturedRoutes() {
  return (
    <section className="landing-section border-y border-slate-200/70 bg-[#f6f8fa]">
      <div className="page-container">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">ON YOUR RADAR</p>
            <h2 className="section-heading">Big plans. Great connections.</h2>
            <p className="section-description">
              A few routes to get your next adventure started.
            </p>
          </div>
          <Link href="/search" className="text-link">
            Compare flights <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {routes.map((route) => (
            <Link
              key={route.to}
              href={`/search?from=${route.from}&to=${route.to}`}
              className="route-card group"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
                <div className="min-w-0">
                  <span className="text-lg font-semibold tracking-tight text-slate-900">
                    {route.from}
                  </span>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {route.origin}
                  </p>
                </div>
                <div className="route-connector">
                  <Plane size={15} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <span className="text-lg font-semibold tracking-tight text-slate-900">
                    {route.to}
                  </span>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {route.destination}
                  </p>
                </div>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors group-hover:border-sky-200 group-hover:bg-sky-50 group-hover:text-sky-700">
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-slate-500">
          Choose your dates to see available flights and current fares.
        </p>
      </div>
    </section>
  );
}
