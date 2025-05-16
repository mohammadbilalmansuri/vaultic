"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { Accordion } from "@/components/ui";

const faqs = [
  {
    question: "Do I need a browser extension to use Vaultic?",
    answer:
      "No. Vaultic is 100% browser-based — no extensions or installs needed. Just open the app, and you're ready to create, import, or manage wallets instantly.",
  },
  {
    question: "Can I import an existing wallet using a seed phrase?",
    answer:
      "Yes. Vaultic supports standard 12-word and 24-word BIP-39 seed phrases. You can restore compatible wallets from other apps like Phantom or MetaMask.",
  },
  {
    question: "How does Vaultic handle multiple accounts and blockchains?",
    answer:
      "With one recovery phrase, you can generate many accounts — each one works across all supported blockchains. For example, Account 0 includes both an Ethereum and a Solana wallet. Add more accounts by simply increasing the derivation index.",
  },
  {
    question: "Can I access my Vaultic wallet on other devices?",
    answer:
      "Yes. Your wallet is fully portable. Just use your recovery phrase to import it on any device, anywhere — no cloud sync or backup required.",
  },
  {
    question: "What's the difference between Testnet and Mainnet?",
    answer:
      "Testnet is a safe environment to experiment with fake tokens. Mainnet is the live network with real assets. Vaultic lets you switch instantly — no RPC setup, no friction.",
  },
  {
    question: "How do I get test tokens?",
    answer:
      "Vaultic includes a built-in faucet for Solana Devnet and links to trusted Sepolia faucets for Ethereum. You can claim free tokens directly in the app for safe testing.",
  },
  {
    question: "Where is my wallet stored, and how secure is it?",
    answer:
      "Your wallet is encrypted in your browser using AES-GCM and saved to IndexedDB. Nothing is ever sent to a server. Your password is hashed and never stored in plain text.",
  },
  {
    question: "What if I forget my password?",
    answer:
      "For safety reasons we keep you recovery phrase with you plain text password so we can not reset your password, you can reset vaultic with the mnemonic and setupo new password and can generate accounts. Visit our Help page for a full guide.",
  },
  {
    question: "Is Vaultic open source?",
    answer:
      "Yes. The entire Vaultic codebase is open source and available on GitHub. You’re welcome to audit, fork, or contribute anytime.",
  },
];

const FaqSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="w-full flex flex-col items-center gap-8">
      <motion.h2 className="h2" {...fadeUpAnimation({ inView: isInView })}>
        Frequently Asked. Clearly Answered.
      </motion.h2>

      <div className="w-full flex flex-col gap-4">
        {faqs.map(({ question, answer }, index) => (
          <motion.div
            key={index}
            {...fadeUpAnimation({
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
