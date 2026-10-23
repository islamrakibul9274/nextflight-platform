import Link from "next/link";
import { ArrowUpRight, Plane } from "lucide-react";
const groups = [
  {
    title: "Explore",
    links: [
      { label: "Find a flight", href: "/search" },
      { label: "Destinations", href: "/#destinations" },
      { label: "Our fleet", href: "/#fleet" },
      { label: "Compare fares", href: "/pricing" },
    ],
  },
  {
    title: "Your journey",
    links: [
      { label: "My trips", href: "/my-trips" },
      { label: "Account & travelers", href: "/profile" },
      { label: "Stratosphere Club", href: "/membership" },
      { label: "Travel concierge", href: "/help" },
    ],
  },
];
export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white">
      <div className="page-container">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.2fr] lg:py-16">
          <div>
            <Link
              href="/"
              aria-label="NextFlight home"
              className="inline-flex items-center gap-2.5"
            >
              <span className="brand-symbol">
                <Plane
                  size={20}
                  strokeWidth={1.7}
                  className="-rotate-45"
                  aria-hidden="true"
                />
              </span>
              <span className="text-xl font-semibold tracking-[-0.06em] text-slate-900">
                nextflight<span className="text-sky-600">.</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-500">
              For the places you dream of.
              <br />
              And the people who make the trip worth it.
            </p>
            <span className="mt-5 block text-[10px] font-medium tracking-[0.15em] text-slate-400">
              A LITTLE CLOSER TO EVERYWHERE
            </span>
          </div>
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="mb-5 text-xs font-semibold text-slate-900">
                {group.title}
              </h2>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-500 transition-colors hover:text-sky-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="self-start rounded-2xl border border-slate-200/70 bg-[#f6f8fa] p-5">
            <p className="text-sm font-semibold tracking-tight text-slate-800">
              A little help along the way.
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              Questions about baggage, cabins, or your next journey?
            </p>
            <Link href="/help" className="text-link mt-4 !text-xs">
              Ask the concierge <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-200/70 py-6 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NextFlight. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-sky-700">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-sky-700">
              Terms & conditions
            </Link>
            <Link href="/security" className="hover:text-sky-700">
              Security
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
