"use client";
import { motion } from "motion/react";
import { fadeUpAnimation } from "@/utils/animations";
import { Button } from "@/components/ui";
import { ExternalLink } from "@/components/ui/icons";

const guides = [
  {
    title: "Understanding Account Creation in Vaultic",
    content: (
      <>
        <p>
          When you create a Vaultic wallet, the app generates a 12-word recovery
          phrase based on the BIP-39 standard. This phrase is your master key —
          from it, Vaultic derives a series of accounts using hierarchical
          deterministic (HD) wallet architecture, similar to how
          professional-grade wallets work.
        </p>
        <p>
          Each account is assigned a unique numerical index. For example, your
          first account corresponds to index 0, the second to index 1, and so
          on. This structure allows unlimited accounts to be derived from a
          single mnemonic without creating new seed phrases.
        </p>
        <p>
          Every account supports multiple blockchain networks. For example,
          "Account 1" will have its own Ethereum address and its own Solana
          address — both derived using the same index but from different
          derivation paths.
        </p>
        <p>
          This design ensures that your entire wallet — across all supported
          blockchains — remains recoverable and predictable using just your
          12-word phrase.
        </p>
      </>
    ),
  },
  {
    title: "How Vaultic Stores and Protects Your Data",
    content: (
      <>
        <p>
          Vaultic is a fully client-side wallet, which means none of your
          sensitive information is ever sent to a server. Your 12-word recovery
          phrase is encrypted using AES-GCM 256-bit encryption and stored
          securely in your browser's IndexedDB.
        </p>
        <p>
          The encryption key is derived from your password, which is never
          stored or transmitted. Even if someone accesses your device, they
          cannot unlock your wallet without your password.
        </p>
        <p>
          Private keys are not persistently stored — they are derived on-demand
          from your mnemonic. This keeps your local storage minimal and your
          security strong.
        </p>
      </>
    ),
  },
  {
    title: "Recovering Your Wallet and Accounts",
    content: (
      <>
        <p>
          If you've lost access to your device or cleared your browser storage,
          you can recover your Vaultic wallet using your 12-word recovery
          phrase. This phrase allows you to re-derive all your accounts and
          addresses.
        </p>
        <p>
          By default, Vaultic restores your first account (index 0). If you had
          additional accounts, you'll need to add them manually through the app.
          For example, to recover Account 5, add accounts until you reach index
          4.
        </p>
        <p className="italic">
          Tip: If you don't see expected funds, try adding more accounts using
          the same recovery phrase.
        </p>
      </>
    ),
  },
  {
    title: "Resetting Your Wallet Without a Password",
    content: (
      <>
        <p>
          Vaultic doesn't store your password — it's used to encrypt your
          recovery phrase locally. If you forget your password, it cannot be
          recovered.
        </p>
        <p>
          To regain access, you must reset your wallet using the in-app option
          or by clearing your browser data. Then, simply re-import your wallet
          using your 12-word phrase and choose a new password.
        </p>
        <p>
          This ensures that only you can unlock your wallet, even if someone
          accesses your device.
        </p>
      </>
    ),
  },
  {
    title: "The Importance of Your Recovery Phrase",
    content: (
      <>
        <p>
          Your recovery phrase is your ultimate key to the wallet. Anyone who
          has it can access all of your funds and accounts — permanently.
        </p>
        <p>
          Never share this phrase. Never store it digitally or online. Write it
          down, store it offline, and protect it as you would a bank vault key.
        </p>
        <p>
          Vaultic cannot revoke, reset, or recover this phrase. It's the
          cornerstone of your wallet's security and ownership.
        </p>
      </>
    ),
  },
  {
    title: "Exploring Testnet Mode and Faucets",
    content: (
      <>
        <p>
          Vaultic supports testnets for both Ethereum (Sepolia) and Solana
          (Devnet), which allow you to experiment with blockchain features using
          fake tokens.
        </p>
        <p>
          You can claim test ETH or SOL using Vaultic's built-in faucets for
          Solana and referred link for Ethereum — ideal for learning and testing
          transactions without risking real assets.
        </p>
        <p>
          Simply switch to testnet mode from settings and claim the tokens to
          begin.
        </p>
      </>
    ),
  },
  {
    title: "Account Deletion and Restoration in Vaultic",
    content: (
      <>
        <p>
          When you delete an account in Vaultic, it is removed only from the
          local interface. The underlying blockchain address remains valid and
          can still hold funds.
        </p>
        <p>
          Deleted indexes are not reused. If you delete Account 3 (index 2), and
          create a new account, it will be index 3 — not index 2 again.
        </p>
        <p>
          If you accidentally delete an account and want it back, you'll need to
          reset your wallet and re-import it from your recovery phrase. Then,
          recreate accounts in order until you reach the one you lost.
        </p>
      </>
    ),
  },
  {
    title: "How Active Accounts Work in Vaultic",
    content: (
      <>
        <p>
          In Vaultic, the "active account" is the one currently selected for
          performing actions like viewing balances, sending tokens, or listing
          transactions.
        </p>
        <p>
          You can switch between accounts at any time. This helps manage
          multiple identities or wallets within the same recovery phrase.
        </p>
        <p>
          Each account has its own unique address per network, but only one can
          be active at a time for usage.
        </p>
      </>
    ),
  },
  {
    title: "What Are Faucets and How to Use Them",
    content: (
      <>
        <p>
          A faucet is a tool that distributes free testnet tokens to users for
          development and experimentation purposes.
        </p>
        <p>
          Vaultic includes a built-in faucet for Solana Devnet, and refers you
          to a trusted faucet link for Ethereum Sepolia. You can request ETH or
          SOL for testing purposes.
        </p>
        <p>
          These tokens have no real value and can be used freely in test
          environments.
        </p>
      </>
    ),
  },
  {
    title: "Understanding Network Fees in Vaultic",
    content: (
      <>
        <p>
          Network fees are small charges paid to blockchain validators for
          processing your transactions. They ensure that your transaction is
          included in the next block.
        </p>
        <p>
          On Ethereum, this is called gas and is paid in ETH (usually less than
          0.0001 ETH). On Solana, it's a small fee (usually less than 0.00008
          SOL) paid in SOL.
        </p>
        <p>
          Vaultic doesn't charge extra — these fees go directly to the network
          and vary depending on traffic.
        </p>
      </>
    ),
  },
  {
    title: "Rent Exemption Explained for Solana Users",
    content: (
      <>
        <p>
          Solana requires a minimum balance to keep certain accounts (like token
          accounts) permanently alive. This is known as "rent exemption."
        </p>
        <p>
          The threshold is usually around 0.00089088 SOL. If the balance drops
          below this, the account may be purged over time.
        </p>
        <p>Ethereum does not have rent; it uses a different gas-based model.</p>
      </>
    ),
  },
  {
    title: "Understanding Maximum Sendable Amount",
    content: (
      <>
        <p>
          When sending tokens in Vaultic, the maximum amount you can send is
          carefully calculated to ensure the transaction does not fail due to
          insufficient balance. This calculation takes into account both the
          network fee and, in the case of Solana, any required rent exemption.
        </p>
        <p>
          For Ethereum, the app subtracts the estimated gas fee (0.0001 ETH)
          from your total ETH balance. This ensures you don't attempt to send
          more ETH than allowed, leaving enough to cover transaction costs.
        </p>
        <p>
          For Solana, Vaultic subtracts both the network fee (about 0.00008 SOL)
          and, when necessary, the rent-exempt minimum (about 0.00089088 SOL)
          required to keep certain accounts alive on-chain. This is especially
          important when sending to a new token address that hasn't been created
          yet.
        </p>
        <p>
          Vaultic calculates this maximum automatically in the Send form and
          offers a "Max" button that populates the sendable amount based on your
          current balance, ensuring a smooth and error-free experience.
        </p>
      </>
    ),
  },
  {
    title: "Private Key Imports: What Vaultic Supports",
    content: (
      <>
        <p>
          Vaultic is designed around recovery phrases (mnemonics). It does not
          support importing raw private keys or JSON keystore files like some
          other wallets.
        </p>
        <p>
          This choice ensures that your wallet structure stays consistent,
          recoverable, and compatible across devices.
        </p>
        <p>
          If you only have a private key, you'll need to use another wallet that
          supports key import.
        </p>
      </>
    ),
  },
  {
    title: "Handling Private Keys Safely",
    content: (
      <>
        <p>
          Even though Vaultic does not expose or store private keys directly,
          it's important to understand their role. Every blockchain address is
          controlled by a private key derived from your recovery phrase.
        </p>
        <p>
          If you ever use wallets that expose private keys, treat them as
          extremely sensitive data. Anyone with access to your key can control
          your funds.
        </p>
        <p>
          Never share, store, or screenshot your private key. Always prefer
          recovery phrases over individual keys for long-term security.
        </p>
      </>
    ),
  },
];

const HelpAndSupportPage = () => {
  return (
    <div className="w-full max-w-screen-lg relative flex-1 flex flex-col items-center gap-16 pt-8 pb-13">
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
          matters. control.
        </motion.p>

        <motion.div {...fadeUpAnimation({ delay: 0.4 })}>
          <Button as="link" href="/setup">
            <ExternalLink className="w-4.5" />
            Open GitHub Issue
          </Button>
        </motion.div>
      </motion.section>

      <div className="w-full relative flex flex-col gap-16 px-1">
        {guides.map(({ title, content }, index) => (
          <motion.div
            key={index}
            id={title.toLowerCase().replace(" ", "-")}
            className="w-full relative flex flex-col gap-3"
            {...fadeUpAnimation({ delay: 0.4 + index * 0.1 })}
          >
            <h3 className="text-2xl font-semibold heading-color leading-tight">
              {title}
            </h3>
            <div className="flex flex-col gap-2">{content}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HelpAndSupportPage;
