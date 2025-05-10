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
            Vaultic's Testnet Mode gives you a full-featured testing environment
            without ever touching mainnet funds. Instantly switch between Solana
            Devnet and Ethereum Sepolia — no extensions, no RPC configuration.
          </p>
          <p>
            Built-in faucet integration lets you claim test SOL and ETH directly
            inside the interface. Perfect for prototyping smart contracts,
            simulating transactions, or debugging without real-world risk.
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
            Every line of code is public and verifiable — from AES-GCM
            encryption to how wallets are stored using IndexedDB. No black
            boxes. No surprises.
          </p>
          <p>
            Developers and security experts are welcome to review, fork, and
            contribute. Vaultic is built on trust, and trust is built with
            transparency.
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
