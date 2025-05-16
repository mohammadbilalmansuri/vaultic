"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Button } from "@/components/ui";
import { fadeUpAnimation } from "@/utils/animations";
import { Swap, WalletMoney } from "@/components/ui/icons";

const TestnetSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section
      ref={ref}
      className="w-full relative flex flex-col items-center gap-8"
    >
      <motion.h2 className="h2" {...fadeUpAnimation({ inView: isInView })}>
        Test Freely. Learn Safely.
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          className="w-full relative overflow-hidden flex flex-col items-start gap-4 p-8 border-1.5 border-color rounded-3xl"
          {...fadeUpAnimation({ inView: isInView, delay: 0.15 })}
        >
          <h3 className="h3 -mt-1">Testnet Mode</h3>
          <p>
            Explore Vaultic with full functionality — safely. Testnet Mode
            mirrors your real wallet using Solana Devnet and Ethereum Sepolia,
            so you can experiment without risking real tokens.
          </p>
          <p>
            Switch instantly with no extra setup. Perfect for learning, testing
            smart contracts, or debugging your flow before going live.
          </p>
          <Button as="link" href="/onboarding" className="mt-2" variant="zinc">
            Setup Wallet & Use Testnet
          </Button>
          <span className="absolute right-0 bottom-0 size-24 rounded-tl-full flex items-end justify-end pr-4 pb-4 bg-primary">
            <Swap className="w-10 text-zinc-500" />
          </span>
        </motion.div>

        <motion.div
          className="w-full relative overflow-hidden flex flex-col items-start gap-4 p-8 border-1.5 border-color rounded-3xl"
          {...fadeUpAnimation({ inView: isInView, delay: 0.3 })}
        >
          <h3 className="h3 -mt-1">Get Testnet Tokens</h3>
          <p>
            Get free SOL (Devnet) and ETH (Sepolia) to test your dApps, simulate
            transfers, or explore blockchain basics — no wallet setup required.
          </p>
          <p>
            Vaultic includes a built-in Solana faucet and a verified link to
            Ethereum Sepolia's official faucet. Open to everyone — developers,
            testers, and beginners alike.
          </p>
          <Button as="link" href="/faucet" className="mt-2" variant="zinc">
            Visit Faucet
          </Button>
          <span className="absolute right-0 bottom-0 size-24 rounded-tl-full flex items-end justify-end pr-4 pb-4 bg-primary">
            <WalletMoney className="w-10 text-zinc-500" />
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default TestnetSection;
