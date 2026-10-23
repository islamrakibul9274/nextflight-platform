import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

const destinations = [
  {
    city: "Tokyo",
    country: "Japan",
    code: "HND",
    from: "SFO",
    theme: "A different kind of electric.",
    image: "photo-1503899036084-c55cdd92da26",
    wide: true,
  },
  {
    city: "London",
    country: "United Kingdom",
    code: "LHR",
    from: "JFK",
    theme: "Old soul. New discoveries.",
    image: "photo-1513635269975-59663e0ac1ad",
  },
  {
    city: "Paris",
    country: "France",
    code: "CDG",
    from: "JFK",
    theme: "Take the scenic route.",
    image: "photo-1502602898657-3e91760cbb34",
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    code: "DXB",
    from: "LHR",
    theme: "Where the horizon keeps moving.",
    image: "photo-1512453979798-5ea266f8880c",
  },
  {
    city: "Singapore",
    country: "Singapore",
    code: "SIN",
    from: "DXB",
    theme: "A little wonder around every corner.",
    image: "photo-1525625293386-3f8f99389edd",
  },
  {
    city: "Sydney",
    country: "Australia",
    code: "SYD",
    from: "LAX",
    theme: "Follow the sunshine a little further.",
    image: "photo-1506973035872-a4ec16b8e8d9",
    wide: true,
  },
];

export function PopularDestinations() {
  return (
    <section id="destinations" className="landing-section bg-white">
      <div className="page-container">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">LET CURIOSITY LEAD</p>
            <h2 className="section-heading">Somewhere worth going.</h2>
            <p className="section-description">
              The familiar favorites. The places you haven’t met yet.
            </p>
          </div>
          <Link href="/search" className="text-link">
            Find your destination <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {destinations.map((destination) => (
            <Link
              key={destination.code}
              href={`/search?from=${destination.from}&to=${destination.code}`}
              className={`destination-card group ${destination.wide ? "sm:col-span-2 lg:col-span-6" : "lg:col-span-3"}`}
              aria-label={`Explore flights to ${destination.city}, ${destination.country}`}
            >
              <ImageWithFallback
                src={`https://images.unsplash.com/${destination.image}?w=1000&q=85&fit=crop`}
                alt={`${destination.city}, ${destination.country}`}
                fill
                sizes={
                  destination.wide
                    ? "(max-width: 1024px) 100vw, 50vw"
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                }
                className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/5 to-slate-950/15"
                aria-hidden="true"
              />
              <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                <span className="rounded-full border border-white/30 bg-black/10 px-3 py-1 text-[10px] font-medium tracking-widest text-white backdrop-blur-sm">
                  {destination.code}
                </span>
                <span className="destination-arrow">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="mb-1 text-xs text-white/75">
                  {destination.country}
                </p>
                <h3
                  className={`font-medium tracking-[-0.045em] text-white ${destination.wide ? "text-4xl" : "text-3xl"}`}
                >
                  {destination.city}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/80">
                  {destination.theme}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
