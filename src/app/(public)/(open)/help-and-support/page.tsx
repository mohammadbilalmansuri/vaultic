import type { Metadata } from "next";
import type { Guide } from "@/types";
import HeroSection from "./_components/hero-section";
import GuideSection from "./_components/guide-section";

export const metadata: Metadata = {
  title: "Help & Support • Vaultic",
  description:
    "Need help with Vaultic? Explore guides on wallet creation, recovery, testnets, security, and troubleshooting. Get support and learn how Vaultic works.",
  alternates: { canonical: "/help-and-support" },
};

const GUIDES: Guide[] = [
  {
    title: "Understanding Account Creation in Vaultic",
    content: (
      <>
        <p>
          When you create a Vaultic wallet, the app generates a 12-word recovery
          phrase based on the BIP-39 standard. This phrase is your master key -
          from it, Vaultic derives a series of accounts using hierarchical
          deterministic (HD) wallet architecture, similar to how
          professional-grade wallets work.
        </p>
        <p>
          Each account is assigned a unique numerical index. For example, your
          first account corresponds to index 0, the second to index 1, and so
          on. This structure allows unlimited accounts to be derived from a
          single phrase without needing additional backups.
        </p>
        <p>
          Every account supports multiple blockchain networks. For example,
          &quot;Account 1&quot; will have both an Ethereum address and a Solana
          address - each derived using the same index but through different
          derivation paths.
        </p>
        <p>
          This design ensures that your entire wallet - across all supported
          blockchains - remains recoverable and predictable using just your
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
          Vaultic is a fully client-side wallet, meaning all your sensitive data
          stays on your device. Nothing - including your recovery phrase,
          accounts, or transactions - is ever sent to a server.
        </p>
        <p>
          Your 12-word recovery phrase is encrypted using AES-GCM 256-bit
          encryption and securely stored in your browser’s IndexedDB. This
          encryption is only accessible with your password, keeping your wallet
          safe from unauthorized access.
        </p>
        <p>
          Your password is never stored in plain text. Instead, Vaultic stores a
          hashed version to verify you when you unlock your wallet. The original
          password is required solely to decrypt your recovery phrase.
        </p>
        <p>
          Private keys are not saved anywhere - they are derived on-demand from
          your encrypted recovery phrase. This keeps your storage lightweight
          and your keys secure.
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
          has it can access all of your funds and accounts - permanently.
        </p>
        <p>
          Never share this phrase. Never store it digitally or online. Write it
          down, store it offline, and protect it like you would a physical vault
          key.
        </p>
        <p>
          Vaultic cannot revoke, reset, or recover this phrase. It&apos;s the
          cornerstone of your wallet’s security and ownership.
        </p>
      </>
    ),
  },
  {
    title: "Recovering Your Wallet and Accounts",
    content: (
      <>
        <p>
          If you&apos;ve lost access to your device or cleared your browser
          storage, you can restore your Vaultic wallet using your 12-word
          recovery phrase. This phrase allows you to recover all your accounts
          and addresses.
        </p>
        <p>
          Vaultic will automatically restore your first account (index 0). If
          you had created more accounts previously, you can restore them by
          adding accounts manually in order - just like before.
        </p>
        <p className="italic">
          Tip: If you don’t see your expected balances, try adding more accounts
          using the same recovery phrase. Funds remain tied to their original
          index.
        </p>
      </>
    ),
  },
  {
    title: "Resetting Your Wallet Without a Password",
    content: (
      <>
        <p>
          If you forget your password, Vaultic cannot recover it - and for good
          reason. Your plain text password is the only way to decrypt your
          recovery phrase and unlock your accounts.
        </p>
        <p>
          To regain access, you&apos;ll need to reset your wallet. You can do
          this using the in-app reset option or by manually clearing your
          browser storage. After that, simply re-import your wallet using your
          12-word recovery phrase and set a new password.
        </p>
        <p>
          This process ensures that only someone with your recovery phrase - and
          a new password - can regain access. Even if someone gains access to
          your device, your accounts remain safe without your actual password.
        </p>
      </>
    ),
  },
  {
    title: "Account Deletion and Restoration in Vaultic",
    content: (
      <>
        <p>
          When you delete an account in Vaultic, it’s removed only from the
          interface - not the blockchain. The address still exists and may still
          hold funds.
        </p>
        <p>
          Vaultic does not reuse deleted indexes. For example, if you delete
          Account 3 (index 2), the next new account will be index 3 - not 2
          again.
        </p>
        <p>
          To recover a deleted account, reset your wallet and re-import it using
          your recovery phrase. Then recreate accounts in the same order until
          you reach the one you lost.
        </p>
      </>
    ),
  },
  {
    title: "How Active Accounts Work in Vaultic",
    content: (
      <>
        <p>
          In Vaultic, the &quot;active account&quot; is the one currently
          selected for performing actions like viewing balances, sending tokens,
          or listing transactions.
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
    title: "Exploring Testnet Mode and Faucets",
    content: (
      <>
        <p>
          Vaultic supports testnets for Ethereum (Sepolia) and Solana (Devnet),
          allowing you to explore features using free, fake tokens.
        </p>
        <p>
          You can request test ETH or SOL through Vaultic’s built-in faucet for
          Solana and a trusted faucet link for Ethereum - perfect for trying out
          transfers or smart contract interactions.
        </p>
        <p>
          These tokens have no real value and are safe for experimentation. Just
          switch to testnet mode in settings to begin.
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
          On Ethereum, this is called gas and is paid in ETH. On Solana,
          it&apos;s a small fee paid in SOL. These fees are typically very low
          (usually 0.0001 ETH or 0.00008 SOL).
        </p>
        <p>
          Vaultic doesn&apos;t charge anything extra - these fees go directly to
          the network and may vary depending on traffic.
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
          accounts) permanently alive. This is known as &quot;rent
          exemption.&quot;
        </p>
        <p>
          The threshold is typically around 0.00089088 SOL. If your balance
          falls below this, the account may eventually be purged.
        </p>
        <p>
          Ethereum does not use rent; it relies entirely on gas fees for
          transactions.
        </p>
      </>
    ),
  },
  {
    title: "Understanding Maximum Sendable Amount",
    content: (
      <>
        <p>
          When sending tokens, Vaultic calculates the maximum amount you can
          safely send by factoring in network fees and rent exemption rules (on
          Solana).
        </p>
        <p>
          On Ethereum, the app subtracts the estimated gas fee from your total
          balance, ensuring the transaction doesn’t fail due to insufficient
          funds.
        </p>
        <p>
          On Solana, Vaultic subtracts the network fee and any required
          rent-exempt minimum (especially when sending to new accounts).
        </p>
        <p>
          The Send form includes a “Max” button that automatically fills in the
          maximum safe amount - helping you send with confidence.
        </p>
      </>
    ),
  },
  {
    title: "Private Key Imports: What Vaultic Supports",
    content: (
      <>
        <p>
          Vaultic is built around recovery phrases (mnemonics). It does not
          support importing raw private keys or JSON keystore files like some
          other wallets.
        </p>
        <p>
          This design keeps your wallet structure simple, recoverable, and
          consistent across devices.
        </p>
        <p>
          If you only have a private key, you’ll need to use another wallet that
          supports key-based imports.
        </p>
      </>
    ),
  },
  {
    title: "Handling Private Keys Safely",
    content: (
      <>
        <p>
          Even though Vaultic doesn’t expose or store private keys directly,
          every blockchain address is ultimately controlled by one - derived
          from your recovery phrase.
        </p>
        <p>
          If you ever use wallets that reveal private keys, treat them like
          passwords. Anyone with access can take full control of your funds.
        </p>
        <p>
          Never share, store, or screenshot your private key. Always prefer
          using your recovery phrase for secure, long-term access.
        </p>
      </>
    ),
  },
];

export default function HelpAndSupportPage() {
  return (
    <div className="w-full max-w-screen-lg relative flex-1 flex flex-col items-center lg:gap-16 md:gap-14 gap-12 sm:pt-3 pt-2 lg:pb-8 md:pb-6 sm:pb-4 pb-6">
      <HeroSection />

      {GUIDES.map((guide, index) => (
        <GuideSection key={`guide-${index}`} {...guide} />
      ))}
    </div>
  );
}
