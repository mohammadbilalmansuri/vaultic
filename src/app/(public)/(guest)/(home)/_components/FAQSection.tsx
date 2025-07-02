"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { Accordion } from "@/components/ui";

const faqs = [
  {
    question: "What happens if I forget my password?",
    answer:
      "If you forget your password, you can reset Vaultic by re-entering your recovery phrase and setting a new password. For your security, we never store passwords or keys online.",
  },
  {
    question: "Will I lose my wallet if I clear browser data?",
    answer:
      "Clearing browser data will delete your local Vaultic storage. However, you can restore your wallet anytime using the recovery phrase. That’s why backing it up is essential.",
  },
  {
    question: "Do I need to back up anything other than the recovery phrase?",
    answer:
      "No. Your 12-word recovery phrase is all you need. Vaultic derives everything from it — no extra backup, no cloud sync, no server storage.",
  },
  {
    question: "Can I recover accounts I deleted or removed?",
    answer:
      "Yes. Vaultic uses a deterministic index system. As long as you have your recovery phrase, you can re-derive any account — even if it was removed from the interface.",
  },
  {
    question: "Can I use Vaultic on different browsers or devices?",
    answer:
      "Yes. Your wallet is fully portable. Just open Vaultic and import your recovery phrase on any browser or device — no installs or syncs required.",
  },
  {
    question: "Is Vaultic compatible with MetaMask or Phantom wallets?",
    answer:
      "Yes. Vaultic uses BIP-39 recovery phrases, making it compatible with wallets like MetaMask (Ethereum) and Phantom (Solana). You can import and export between them freely.",
  },
  {
    question: "Can I use Vaultic alongside MetaMask or Phantom?",
    answer:
      "Absolutely. Vaultic is browser-based and runs independently. You can use it alongside MetaMask, Phantom, or any other wallet without conflict.",
  },
  {
    question: "What happens when I switch between testnet and mainnet?",
    answer:
      "Vaultic seamlessly switches networks in-app. Each network (testnet/mainnet) has separate balances and transactions, and no manual RPC setup is needed.",
  },
  {
    question: "Can developers or testers use Vaultic without using real funds?",
    answer:
      "Yes. Just set up a wallet, switch to Testnet Mode, and use the built-in Solana Devnet faucet or the Ethereum Sepolia faucet link to get free test tokens.",
  },
  {
    question: "Does Vaultic support smart contract interaction?",
    answer:
      "Not yet. Vaultic currently focuses on secure account management and transfers. Smart contract features are planned for future updates.",
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="w-full flex flex-col items-center gap-8">
      <motion.h2 className="h2" {...fadeUpAnimation({ inView })}>
        Frequently Asked. Clearly Answered.
      </motion.h2>

      <div className="w-full flex flex-col gap-4">
        {faqs.map(({ question, answer }, index) => (
          <motion.div
            key={index}
            {...fadeUpAnimation({ inView, delay: index * 0.05 + 0.05 })}
          >
            <Accordion
              isOpen={openIndex === index}
              toggleAccordion={() => toggleAccordion(index)}
              question={question}
              answer={answer}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
