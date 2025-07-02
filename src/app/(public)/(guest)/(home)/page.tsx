"use client";
import HeroSection from "./_components/HeroSection";
import FeaturesSection from "./_components/FeaturesSection";
import HowItWorksSection from "./_components/HowItWorksSection";
import TestnetSection from "./_components/TestnetSection";
import FAQSection from "./_components/FAQSection";

const HomePage = () => {
  return (
    <div className="w-full max-w-screen-lg relative flex-1 flex flex-col items-center gap-24 pt-8 pb-16">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestnetSection />
      <FAQSection />
    </div>
  );
};

export default HomePage;
