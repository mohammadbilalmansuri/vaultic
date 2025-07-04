"use client";
import HeroSection from "./_components/HeroSection";
import FeaturesSection from "./_components/FeaturesSection";
import HowItWorksSection from "./_components/HowItWorksSection";
import TestnetSection from "./_components/TestnetSection";
import FAQSection from "./_components/FAQSection";

const HomePage = () => {
  return (
    <div
      className="w-full max-w-screen-lg relative flex-1 flex flex-col items-center lg:gap-24 md:gap-20 gap-16 sm:pt-3 pt-2 lg:pb-16 md:pb-12 pb-8"
      aria-label="Home Page Content"
    >
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestnetSection />
      <FAQSection />
    </div>
  );
};

export default HomePage;
