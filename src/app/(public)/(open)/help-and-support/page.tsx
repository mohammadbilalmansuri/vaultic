"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui";
import { fadeUpAnimation } from "@/utils/animations";

const guides = [
  {
    title: "How Are Accounts Created?",
    content: (
      <>
        <p>
          Vaultic generates a 12-word recovery phrase (mnemonic) during wallet
          creation. From this, a hierarchical set of accounts is derived using
          BIP-39 standards.
        </p>
        <p>
          Each account has a unique index (Account 1 is index 0, Account 2 is
          index 1, etc.), and supports multiple networks like Ethereum and
          Solana with unique addresses per network.
        </p>
      </>
    ),
  },
  {
    title: "How Is My Data Stored?",
    content: (
      <>
        <p>
          Vaultic uses AES-GCM (256-bit) encryption to protect your recovery
          phrase, which is stored locally in your browser’s IndexedDB. Your
          password is never stored or transmitted — everything happens 100%
          client-side for maximum privacy.
        </p>
      </>
    ),
  },
  {
    title: "How Do I Re-Import My Wallet or Access Old Accounts?",
    content: (
      <>
        <p>
          You can re-import your Vaultic wallet anytime using your 12-word
          recovery phrase. To recover old accounts (e.g., Account 5), make sure
          you derive up to index 4 by adding more accounts in the app.
        </p>
        <p className="italic">
          Tip: If you’re missing funds, try adding more accounts using the same
          recovery phrase.
        </p>
      </>
    ),
  },
  {
    title: "Forgot Your Wallet Password?",
    content: (
      <>
        <p>
          Vaultic doesn’t store your password, so if you forget it, it cannot be
          recovered. This ensures only you can unlock your wallet.
        </p>
        <p>
          To reset, clear your browser data or use the in-app reset option, then
          re-import your wallet with your recovery phrase and set a new
          password.
        </p>
      </>
    ),
  },
  {
    title: "Why Is My Recovery Phrase So Important?",
    content: (
      <>
        <p>
          Your 12-word recovery phrase is your master key. Anyone with access to
          it can control your entire wallet.
        </p>
        <p>
          Keep it offline, private, and never share it. Your phrase permanently
          maps to all your accounts and balances across blockchains.
        </p>
      </>
    ),
  },
  {
    title: "What Is Testnet Mode?",
    content: (
      <>
        <p>
          Vaultic supports Ethereum (Sepolia) and Solana (Devnet) testnets, so
          you can safely test features using fake tokens.
        </p>
        <p>
          Built-in faucets let you claim test ETH and SOL directly within the
          wallet — ideal for developers and learners.
        </p>
      </>
    ),
  },
  {
    title: "Need More Help?",
    content: (
      <>
        <p>
          If you’ve checked all these guides and still have questions or run
          into unique issues, open a GitHub issue for public tracking. For
          urgent matters, reach out to the admin via the email listed on their
          GitHub profile.
        </p>
      </>
    ),
  },
];

const HelpAndSupportPage = () => {
  return (
    <div className="w-full max-w-screen-lg relative flex-1 flex flex-col items-center gap-16 pt-8 pb-16">
      <motion.section
        className="w-full flex flex-col text-center gap-8 items-center bg-primary p-16 rounded-4xl relative overflow-hidden before:content-[''] before:absolute before:top-0 before:right-0 before:size-32 before:bg-teal-500/10 before:rounded-bl-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:size-48 after:bg-teal-500/5 after:rounded-tr-full"
        {...fadeUpAnimation()}
      >
        <motion.h5
          className="bg-teal-500/20 px-3 py-2 rounded-full text-teal-800 dark:text-teal-200 font-medium text-sm leading-none"
          {...fadeUpAnimation({ delay: 0.1 })}
        >
          Your Vaultic Knowledge Base
        </motion.h5>

        <motion.h1 className="h1" {...fadeUpAnimation({ delay: 0.2 })}>
          Help & Support
        </motion.h1>

        <motion.p
          className="text-lg max-w-3xl -mt-2"
          {...fadeUpAnimation({ delay: 0.3 })}
        >
          This page has guides and FAQs to help you make the most of Vaultic. If
          you have a unique issue, open a GitHub issue for public tracking or
          contact the admin via email on their GitHub profile for urgent
          matters.
        </motion.p>

        <motion.div {...fadeUpAnimation({ delay: 0.4 })}>
          <Button
            as="link"
            href="https://github.com/mohammadbilalmansuri/vaultic/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open GitHub Issue
          </Button>
        </motion.div>
      </motion.section>

      {guides.map((guide, index) => (
        <motion.section
          key={index}
          className="w-full flex flex-col gap-4"
          {...fadeUpAnimation({ delay: 0.3 * (index + 1) })}
        >
          <h2 className="h2">{guide.title}</h2>
          <div className="text-base text-foreground/80">{guide.content}</div>
        </motion.section>
      ))}
    </div>
  );
};

export default HelpAndSupportPage;
