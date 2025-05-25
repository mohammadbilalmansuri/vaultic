"use client";
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  TestnetSection,
  FAQSection,
} from "@/components/home";

const HomePage = () => {
  return (
    <div className="w-full max-w-screen-lg relative flex-1 flex flex-col items-center gap-32 pt-8 pb-16">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestnetSection />
      <FAQSection />
    </div>
  );
};

export default HomePage;
