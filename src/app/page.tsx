import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedRoutes } from "@/components/home/FeaturedRoutes";
import { PopularDestinations } from "@/components/home/PopularDestinations";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { MembershipPreview } from "@/components/home/MembershipPreview";
import { TrustTelemetry } from "@/components/home/TrustTelemetry";
import { FAQSection } from "@/components/home/FAQSection";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <div className="landing-page">
      <HeroSection />
      <PopularDestinations />
      <FeaturedRoutes />
      <PlatformFeatures />
      <TrustTelemetry />
      <MembershipPreview />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
