import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedRoutes } from "@/components/home/FeaturedRoutes";
import { PopularDestinations } from "@/components/home/PopularDestinations";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { MembershipPreview } from "@/components/home/MembershipPreview";
import { TrustTelemetry } from "@/components/home/TrustTelemetry";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero with Scroll-Driven Three.js Experience & Docked Search Widget */}
      <HeroSection />

      {/* 2. Featured Direct Routes & Live Matrix */}
      <FeaturedRoutes />

      {/* 3. Popular Global Destinations */}
      <PopularDestinations />

      {/* 4. Platform Engineering & Travel Features */}
      <PlatformFeatures />

      {/* 5. Stratosphere Membership Club Showcase */}
      <MembershipPreview />

      {/* 6. Live Telemetry & Trust Metrics */}
      <TrustTelemetry />

      {/* 7. Verified Traveler Reviews */}
      <TestimonialsSection />

      {/* 8. Frequently Asked Questions */}
      <FAQSection />

      {/* 9. Final Booking Call to Action */}
      <FinalCTA />
    </div>
  );
}
