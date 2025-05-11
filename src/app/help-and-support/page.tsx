import Link from "next/link";

const HelpAndSupport = () => {
  return (
    <div className="w-full max-w-screen-lg relative flex flex-col gap-4 pb-8 pt-3">
      <h1 className="h2">Help & Support</h1>

      {/* Section 1: Get Support */}
      <section className="mt-6">
        <h2 className="section-heading">Get Support</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted">
          <li>
            <strong>FAQs:</strong> Common questions around setup, security, and
            usage.
          </li>
          <li>
            <strong>Live Support:</strong> Use our{" "}
            <Link href="/contact" className="link">
              contact form
            </Link>{" "}
            to get in touch.
          </li>
          <li>
            <strong>Report a Bug:</strong> Found an issue? Let us know on{" "}
            <Link
              href="https://github.com/vaultic-app/vaultic/issues"
              target="_blank"
              className="link"
            >
              GitHub Issues
            </Link>
            .
          </li>
          <li>
            <strong>Feature Requests:</strong> We’re always listening. Share
            your ideas!
          </li>
        </ul>
      </section>

      {/* Section 2: Guides & User Education */}
      <section className="mt-8">
        <h2 className="section-heading">Guides & User Education</h2>

        <div className="mt-4 space-y-5 text-muted">
          {/* Creating & Importing Accounts */}
          <div>
            <h3 className="text-base font-semibold">
              🔐 Creating & Importing Accounts
            </h3>
            <p>
              Vaultic uses HD Wallets (Hierarchical Deterministic) based on your
              single mnemonic phrase. This means all your accounts are
              mathematically derived from a root key and a position/index (e.g.,{" "}
              <code>m/44'/60'/0'/0/n</code>). You can re-import any account from
              the same seed by selecting its index during onboarding.
            </p>
          </div>

          {/* Recovering Your Account */}
          <div>
            <h3 className="text-base font-semibold">
              🔁 Recovering Your Account
            </h3>
            <p>
              If you forget your password or clear your browser data, we cannot
              access your wallet. The safest recovery method is to re-import
              your mnemonic phrase on the onboarding screen. Vaultic doesn’t
              store your seed or password — it's encrypted in your browser.
            </p>
          </div>

          {/* Importance of Mnemonic */}
          <div>
            <h3 className="text-base font-semibold">
              🧠 Why the Mnemonic Phrase Matters
            </h3>
            <p>
              Your mnemonic seed phrase is your only backup. It allows you to
              restore access to all your accounts. Store it offline, never share
              it, and treat it like a master key. Vaultic encrypts this locally
              — we never transmit or store it.
            </p>
          </div>

          {/* Network Switching */}
          <div>
            <h3 className="text-base font-semibold">
              🌐 Switching Between Testnet & Mainnet
            </h3>
            <p>
              Vaultic supports Ethereum and Solana testnets and mainnets. While
              your wallets are consistent, each network has separate balances,
              transaction history, and token behavior. Switching networks may
              show a zero balance until you interact or import assets for that
              network.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="mt-8">
        <h2 className="section-heading">Other Resources</h2>
        <div className="space-y-4 text-muted">
          {/* Security */}
          <div>
            <h3 className="text-base font-semibold">✅ Security Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use a strong, unique password.</li>
              <li>Keep your mnemonic phrase private and offline.</li>
              <li>Never enter your seed phrase on unknown websites.</li>
            </ul>
          </div>

          {/* Local Storage */}
          <div>
            <h3 className="text-base font-semibold">
              📦 How Vaultic Stores Your Data
            </h3>
            <p>
              All sensitive data is stored locally in your browser using secure
              encryption. If you reset your browser or clear site storage, the
              app will no longer have access to your wallets.
            </p>
          </div>

          {/* Faucet Tool */}
          <div>
            <h3 className="text-base font-semibold">
              🧪 Using the Solana Faucet
            </h3>
            <p>
              On testnet, you can request free SOL using our built-in faucet.
              These tokens have no real value and are only for testing. Mainnet
              balances are unaffected.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpAndSupport;
