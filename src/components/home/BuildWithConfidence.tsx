"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Button } from "@/components/ui";
import { fadeUpAnimation } from "@/utils/animations";
import { Airdrop, Code } from "@/components/ui/icons";

const BuildWithConfidence = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section
      ref={ref}
      className="w-full relative flex flex-col items-center gap-8"
    >
      <motion.h2 className="h2" {...fadeUpAnimation({ inView: isInView })}>
        Build Confidently. Trust Transparently.
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          className="w-full relative overflow-hidden flex flex-col items-start gap-4 p-8 border-1.5 border-color rounded-3xl"
          {...fadeUpAnimation({ inView: isInView, delay: 0.15 })}
        >
          <h3 className="h3 -mt-1">Test Before You Transact</h3>
          <p>
            Vaultic’s Testnet Mode offers a full-featured environment to safely
            simulate transactions and test features without risking real funds.
            Instantly toggle between Solana Devnet and Ethereum Sepolia — no
            extensions or RPC setup required.
          </p>
          <p>
            With built-in faucet access, you can claim test SOL and ETH directly
            from the interface. Ideal for contract prototyping, integration
            testing, or simply learning without the pressure.
          </p>
          <Button as="link" href="/faucet" className="mt-2" variant="zinc">
            Check Faucets
          </Button>
          <span className="absolute right-0 bottom-0 size-24 rounded-tl-full flex items-end justify-end pr-4 pb-4 bg-primary">
            <Airdrop className="w-10 text-zinc-500" />
          </span>
        </motion.div>

        <motion.div
          className="w-full relative overflow-hidden flex flex-col items-start gap-4 p-8 border-1.5 border-color rounded-3xl"
          {...fadeUpAnimation({ inView: isInView, delay: 0.3 })}
        >
          <h3 className="h3 -mt-1">100% Open Source & Auditable</h3>
          <p>
            Vaultic is fully transparent — from encryption to data storage.
            Everything is open source, publicly available, and built to be
            reviewed.
          </p>
          <p>
            Developers, auditors, and contributors are encouraged to explore the
            codebase. There are no black boxes — just trust built through
            clarity.
          </p>
          <Button
            as="link"
            href="https://github.com/mohammadbilalmansuri/vaultic"
            target="_blank"
            className="mt-2"
            variant="zinc"
          >
            Explore the Code
          </Button>
          <span className="absolute right-0 bottom-0 size-24 rounded-tl-full flex items-end justify-end pr-4 pb-4 bg-primary">
            <Code className="w-10 text-zinc-500" />
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default BuildWithConfidence;
