"use client";
import { motion } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { Button } from "@/components/ui";

const HelpPage = () => {
  return (
    <div className="w-full max-w-screen-md mx-auto py-16 px-4 space-y-12">
      <motion.h1 className="h1 text-center" {...fadeUpAnimation()}>
        Help & Support
      </motion.h1>

      {/* Section 1: Account Creation */}
      <motion.section {...fadeUpAnimation({ delay: 0.1 })}>
        <h2 className="h3 mb-2">🔐 How are accounts created?</h2>
        <p>
          When you create a Vaultic wallet, a single 12-word recovery phrase
          (mnemonic) is generated. From this, we derive a hierarchical set of
          accounts using industry-standard BIP-39 and BIP-44. Each account is
          indexed — meaning Account 1 is index 0, Account 2 is index 1, and so
          on. Each account supports multiple networks (e.g., Ethereum and
          Solana) with unique addresses per network.
        </p>
      </motion.section>

      {/* Section 2: Browser Storage */}
      <motion.section {...fadeUpAnimation({ delay: 0.2 })}>
        <h2 className="h3 mb-2">💾 How is my data stored?</h2>
        <p>
          Vaultic securely encrypts your recovery phrase using AES-GCM (256-bit)
          with a password you provide. The encrypted data is stored locally in
          your browser’s <strong>IndexedDB</strong>. Your password is never
          stored or sent to a server. Everything happens on your device — 100%
          client-side.
        </p>
      </motion.section>

      {/* Section 3: Wallet Import & Account Indexing */}
      <motion.section {...fadeUpAnimation({ delay: 0.3 })}>
        <h2 className="h3 mb-2">
          🔁 How do I re-import my wallet or access old accounts?
        </h2>
        <p>
          You can always import your Vaultic wallet using your 12-word recovery
          phrase. Each time you add a new account, Vaultic increments the index.
          For example, if you had funds in Account 5, you must derive up to
          index 4 to recover it. Vaultic lets you control this manually during
          onboarding or through the accounts page.
        </p>
        <p className="mt-2 italic text-sm text-muted-foreground">
          Tip: If you’re missing funds, try adding more accounts using the same
          recovery phrase.
        </p>
      </motion.section>

      {/* Section 4: Forgot Password */}
      <motion.section {...fadeUpAnimation({ delay: 0.4 })}>
        <h2 className="h3 mb-2">🔐 Forgot your wallet password?</h2>
        <p>
          Vaultic does not store or transmit your password. If you forget it, we
          cannot recover it for you — this is for your own security. Your
          recovery phrase is encrypted with that password, so without it, your
          vault cannot be unlocked.
        </p>
        <p className="mt-2">
          You can reset Vaultic by clearing browser data or using the in-app
          reset option. Then, re-import your wallet with your recovery phrase
          and choose a new password. Your accounts and funds will remain safe —
          no data is lost.
        </p>
      </motion.section>

      {/* Section 5: Importance of Recovery Phrase */}
      <motion.section {...fadeUpAnimation({ delay: 0.5 })}>
        <h2 className="h3 mb-2">⚠️ Why is my recovery phrase so important?</h2>
        <p>
          Your 12-word recovery phrase is your master key. Anyone with access to
          it can control your entire wallet. Keep it offline, private, and never
          share it with anyone.
        </p>
        <p className="mt-2">
          Your phrase permanently maps to all your accounts and balances across
          blockchains. Once generated, it will always restore the same accounts
          — even if Vaultic is reset or deleted.
        </p>
      </motion.section>

      {/* Section 6: Testnet Mode */}
      <motion.section {...fadeUpAnimation({ delay: 0.6 })}>
        <h2 className="h3 mb-2">🧪 What is Testnet Mode?</h2>
        <p>
          Vaultic offers full testnet support for Ethereum (Sepolia) and Solana
          (Devnet). You can toggle between testnet and mainnet to try things out
          safely using fake tokens. This is ideal for developers, learners, or
          anyone exploring blockchain tech.
        </p>
        <p className="mt-2">
          Built-in faucets let you claim test ETH and SOL right from the wallet.
        </p>
      </motion.section>

      {/* Section 7: Need More Help */}
      <motion.section {...fadeUpAnimation({ delay: 0.7 })}>
        <h2 className="h3 mb-2">❓ Still have questions?</h2>
        <p>You can open a support issue on GitHub and track it publicly:</p>
        <div className="mt-3">
          <Button
            as="link"
            href="https://github.com/mohammadbilalmansuri/vaultic/issues"
            target="_blank"
          >
            Open GitHub Issue
          </Button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          For urgent matters, you may also contact the admin through their
          GitHub profile.
        </p>
      </motion.section>
    </div>
  );
};

export default HelpPage;
//
