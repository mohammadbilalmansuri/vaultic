import type { Metadata } from "next";
import HeroSection from "./_components/hero-section";
import FeaturesSection from "./_components/features-sction";
import HowItWorksSection from "./_components/how-it-works-section";
import TestnetSection from "./_components/testnet-section";
import FAQSection from "./_components/faq-section";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div
      className="w-full max-w-screen-lg relative flex-1 flex flex-col items-center lg:gap-24 md:gap-20 gap-16 lg:pb-16 md:pb-12 sm:pb-8 pb-10"
      aria-label="Home Page Content"
    >
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestnetSection />
      <FAQSection />
    </div>
  );
}
