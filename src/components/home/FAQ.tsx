"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import getFadeUpAnimation from "@/utils/getFadeUpAnimation";
import { Accordion } from "@/components/ui";

const faqs = [
  {
    question: "Do I need a browser extension to use Vaultic?",
    answer:
      "No. Vaultic is a fully browser-native experience. There are no extensions or downloads required — just open, onboard, and start transacting instantly from your browser.",
  },
  {
    question: "Can I import an existing wallet using a seed phrase?",
    answer:
      "Yes. Vaultic supports both 12-word and 24-word BIP-39 compatible mnemonic phrases, so you can easily import existing Solana or Ethereum wallets.",
  },
  {
    question: "What's the difference between Testnet and Mainnet?",
    answer:
      "Testnet lets you safely experiment with fake tokens in an isolated environment, while Mainnet is the live blockchain with real assets. Vaultic allows you to switch instantly between them — no network config or extensions needed.",
  },
  {
    question: "How do I get test tokens?",
    answer:
      "Vaultic includes a built-in faucet for Solana Devnet, so you can claim test SOL instantly inside the app. For Ethereum Sepolia, we provide a direct link to a trusted and free external faucet.",
  },
  {
    question: "Where is my wallet stored, and how secure is it?",
    answer:
      "Your wallet is securely encrypted in your browser using AES-GCM (256-bit) and stored via IndexedDB. Additionally, your login password is hashed before storage — never saved in plain text or sent to any server.",
  },
  {
    question: "Is Vaultic open source?",
    answer:
      "Yes — the entire Vaultic codebase is 100% open source and publicly available on GitHub. You can inspect the logic, audit encryption, contribute improvements, or fork it freely.",
  },
  {
    question: "What happens if I forget my password?",
    answer:
      "You can reset your Vaultic password using your mnemonic phrase. If that doesn't work, you can clear your browser’s site data, re-import your wallet using the same seed phrase, and set a new password. For full instructions, visit our Help & Support page.",
  },
];

const FaqSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="w-full flex flex-col items-center gap-8">
      <motion.h2 className="h2" {...getFadeUpAnimation({ inView: isInView })}>
        Frequently Asked. Clearly Answered.
      </motion.h2>

      <div className="w-full flex flex-col gap-4">
        {faqs.map(({ question, answer }, index) => (
          <motion.div
            key={index}
            {...getFadeUpAnimation({
              inView: isInView,
              delay: 0.1 + index * 0.1,
            })}
          >
            <Accordion
              isOpen={openIndex === index}
              toggleAccordion={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              question={question}
              answer={answer}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
