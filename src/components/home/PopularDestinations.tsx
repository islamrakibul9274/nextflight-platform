import React from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Star, MapPin } from "lucide-react";

export function PopularDestinations() {
  const destinations = [
    {
      city: "Tokyo",
      country: "Japan",
      code: "HND",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
      price: 820,
      duration: "10h 30m",
      rating: "4.95",
      tag: "Best for Autumn",
    },
    {
      city: "London",
      country: "United Kingdom",
      code: "LHR",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
      price: 580,
      duration: "7h 00m",
      rating: "4.92",
      tag: "Direct Daily",
    },
    {
      city: "Paris",
      country: "France",
      code: "CDG",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
      price: 540,
      duration: "7h 30m",
      rating: "4.89",
      tag: "Romantic Getaway",
    },
    {
      city: "Dubai",
      country: "United Arab Emirates",
      code: "DXB",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
      price: 620,
      duration: "12h 45m",
      rating: "4.97",
      tag: "Ultra Luxury",
    },
    {
      city: "Singapore",
      country: "Singapore",
      code: "SIN",
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
      price: 790,
      duration: "15h 20m",
      rating: "4.98",
      tag: "Gateway to Asia",
    },
    {
      city: "Sydney",
      country: "Australia",
      code: "SYD",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
      price: 1180,
      duration: "14h 50m",
      rating: "4.91",
      tag: "Harbor & Sun",
    },
  ];

  return (
    <section id="destinations" className="py-24 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold uppercase tracking-wider mb-3">
              <MapPin className="w-3.5 h-3.5" /> Curated Gateways
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Popular Global Destinations
            </h2>
            <p className="mt-2 text-slate-600 max-w-xl text-sm sm:text-base">
              Nonstop transoceanic corridors operated with state-of-the-art aircraft fleets.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline"
          >
            <span>Explore all 180+ routes</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.code}
              href={`/search?to=${dest.code}`}
              className="group relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white hover:border-sky-500/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Badge Tag */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-900 border border-white/50">
                  {dest.tag}
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-300 flex items-center gap-1 border border-white/10">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>{dest.rating}</span>
                </div>

                {/* City & Airport Info on Image */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <div className="text-xs text-slate-300 font-medium">{dest.country}</div>
                    <div className="text-2xl font-bold tracking-tight">{dest.city}</div>
                  </div>
                  <span className="font-mono text-sm font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
                    {dest.code}
                  </span>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-4 flex items-center justify-between border-t border-slate-100 bg-white">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{dest.duration} avg</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">from </span>
                  <span className="text-base font-extrabold text-slate-900">
                    ${dest.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
