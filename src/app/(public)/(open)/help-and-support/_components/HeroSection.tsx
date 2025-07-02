"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { Button } from "@/components/ui";
import { ExternalLink } from "@/components/ui/icons";

const HeroSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.section ref={ref} className="hero" {...fadeUpAnimation({ inView })}>
      <motion.h1 className="h1" {...fadeUpAnimation({ delay: 0.1, inView })}>
        Help & Support
      </motion.h1>

      <motion.p
        className="hero-paragraph"
        {...fadeUpAnimation({ delay: 0.2, inView })}
      >
        This page has guides and FAQs to help you make the most of Vaultic. If
        you have a unique issue, open a GitHub issue for public tracking or
        contact the admin via email on their GitHub profile for urgent matters.
      </motion.p>

      <motion.div {...fadeUpAnimation({ delay: 0.3, inView })}>
        <Button as="link" href="/setup">
          <ExternalLink className="w-4.5" />
          Open GitHub Issue
        </Button>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
