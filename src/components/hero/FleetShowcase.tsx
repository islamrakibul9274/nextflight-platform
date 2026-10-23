"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Pause,
  Play,
  Plane,
  Radio,
  Wifi,
} from "lucide-react";
import Link from "next/link";

const FlightCanvas = dynamic(
  () =>
    import("./ScrollFlightCanvas").then((module) => module.ScrollFlightCanvas),
  { ssr: false },
);

export function FleetShowcase() {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const isStill = paused || !!reduceMotion;

  return (
    <section
      id="fleet"
      ref={ref}
      className="fleet-showcase mt-12"
      aria-labelledby="fleet-heading"
      data-testid="fleet-showcase"
    >
      <div className="fleet-atmosphere" aria-hidden="true" />
      <div className="fleet-topline">
        <span className="fleet-eyebrow">
          <span className="fleet-dot" /> THE NEXTFLIGHT FLEET
        </span>
        <span className="fleet-edition">A NEW PERSPECTIVE / 01</span>
      </div>
      <div className="fleet-copy">
        <p className="fleet-kicker">THE ART OF GOING FURTHER</p>
        <h2 id="fleet-heading">
          A better view.
          <br />
          <span>From every seat.</span>
        </h2>
        <p>
          Above the everyday. Discover a quieter cabin, a little more room, and
          a world of possibility.
        </p>
        <Link href="/flights" className="fleet-link">
          Explore our flights <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div
        className="fleet-stage"
        role="img"
        aria-label="Interactive three-dimensional airliner with swept silver wings and a navy tail. Scroll the page to gently change its viewing angle."
      >
        {/* Always present underneath the canvas: no blank card during loading or context loss. */}
        <div className="fleet-fallback" aria-hidden="true" />
        <FlightCanvas progress={scrollYProgress} paused={isStill} />
      </div>
      <div className="fleet-aircraft-label" aria-hidden="true">
        <span className="fleet-label-line" />
        <span>
          NEXTFLIGHT
          <br />
          <strong>Long-haul collection</strong>
        </span>
      </div>

      <div className="fleet-scroll-cue">
        <ArrowDown size={14} aria-hidden="true" />
        <span>
          {reduceMotion
            ? "A moment above it all"
            : paused
              ? "Flight motion paused"
              : "Scroll to change your perspective"}
        </span>
        {!reduceMotion && (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={
              paused ? "Resume aircraft motion" : "Pause aircraft motion"
            }
            aria-pressed={paused}
            className="fleet-motion-toggle"
          >
            {paused ? (
              <Play size={13} aria-hidden="true" />
            ) : (
              <Pause size={13} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      <div className="fleet-bottomline">
        <div className="fleet-signature">
          <Plane size={22} strokeWidth={1.4} aria-hidden="true" />
          <div>
            <strong>Considered in every detail.</strong>
            <span>Your journey, elevated.</span>
          </div>
        </div>
        <div className="fleet-amenities">
          <span>
            <Wifi size={15} aria-hidden="true" /> Stay connected
          </span>
          <span>
            <Radio size={15} aria-hidden="true" /> Quieter cabins
          </span>
        </div>
        <span className="fleet-preview">FLEET PREVIEW</span>
      </div>
      <div className="fleet-progress" aria-hidden="true">
        <motion.div style={{ width: isStill ? "50%" : progressWidth }} />
      </div>
    </section>
  );
}
