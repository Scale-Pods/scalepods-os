import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { ProductPreview } from "@/components/landing/product-preview";
import { PodsSection } from "@/components/landing/pods-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CaseStudies } from "@/components/landing/case-studies";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { Faq } from "@/components/landing/faq";
import { ClosingCta } from "@/components/landing/closing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <div className="flex-1">
      <LandingNav />
      <main>
        <Hero />
        <ProductPreview />
        <section id="platform" />
        <PodsSection />
        <HowItWorks />
        <CaseStudies />
        <PricingTeaser />
        <Faq />
        <ClosingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
