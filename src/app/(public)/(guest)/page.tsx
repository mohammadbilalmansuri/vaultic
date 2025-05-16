"use client";
import {
  Hero,
  Features,
  HowItWorks,
  BuildWithConfidence,
  FAQ,
} from "@/components/home";

const HomePage = () => {
  return (
    <main className="w-full max-w-screen-lg relative flex-1 flex flex-col items-center gap-32 pt-8 pb-16">
      <Hero />
      <Features />
      <HowItWorks />
      <BuildWithConfidence />
      <FAQ />
    </main>
  );
};

export default HomePage;
