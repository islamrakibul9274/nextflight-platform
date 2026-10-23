"use client";

import { ArrowUpRight, Check, Compass } from "lucide-react";
import { FleetShowcase } from "./FleetShowcase";
import { HeroSearchWidget } from "./HeroSearchWidget";

export function HeroSection() {
  return (
    <section className="landing-hero">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="page-container relative">
        <div className="hero-intro">
          <a href="#destinations" className="hero-eyebrow">
            <Compass size={14} strokeWidth={1.6} aria-hidden="true" />
            <span>A LITTLE CLOSER TO EVERYWHERE</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <h1>
            Good journeys start
            <br />
            with a <span>great flight.</span>
          </h1>
          <p>
            Somewhere new. Someone you miss. Whatever takes you there,
            <br className="hidden sm:block" /> find a flight that feels right.
          </p>
        </div>
        <div className="relative z-10">
          <HeroSearchWidget />
        </div>
        <ul className="hero-reassurance" aria-label="Booking features">
          {[
            "Compare cabin options",
            "See baggage before booking",
            "Manage your trips in one place",
          ].map((text) => (
            <li key={text}>
              <Check size={14} aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
        <FleetShowcase />
      </div>
    </section>
  );
}
