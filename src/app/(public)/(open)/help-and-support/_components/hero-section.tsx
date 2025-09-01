"use client";
import { motion } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { useMotionInView } from "@/hooks";
import { ExternalLink } from "@/components/icons";
import { Button } from "@/components/ui";

const HeroSection = () => {
  const { ref, inView } = useMotionInView();

  return (
    <motion.section
      ref={ref}
      role="region"
      aria-label="Hero Section"
      className="hero"
      {...fadeUpAnimation({ inView })}
    >
      <h1 className="h1 -mt-2">Help & Support</h1>
      <p className="md:text-lg sm:text-md text-base md:max-w-3xl sm:-mt-2 -mt-1.5 mb-1">
        This page has guides and FAQs to help you make the most of Vaultic. If
        you have a unique issue, open a GitHub issue for public tracking or
        contact the admin via email on their GitHub profile for urgent matters.
      </p>
      <Button
        as="link"
        href="https://github.com/mohammadbilalmansuri/vaultic/issues"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open GitHub Issue"
        className="gap-2"
      >
        <ExternalLink className="w-4.5" />
        Open GitHub Issue
      </Button>
    </motion.section>
  );
};

export default HeroSection;
