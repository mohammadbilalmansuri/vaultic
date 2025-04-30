"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui";

const Home = () => {
  return (
    <div className="w-full max-w-screen-lg flex flex-col relative">
      <section className="text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold"
        >
          Your Crypto, <span className="text-teal-500">Fortified</span>
        </motion.h1>
        <p className="mt-4 text-lg">
          One mnemonic. Two chains. Zero compromises.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button className="bg-teal-500 hover:bg-teal-600 text-white">
            Launch Wallet
          </Button>
          <Button variant="zinc">Try in Testnet Mode</Button>
        </div>
      </section>
      {/* Features */}
      <section className="grid md:grid-cols-2 gap-6 py-16">
        {[
          {
            title: "Dual Network Support",
            desc: "Use ETH & SOL. Mainnet & testnet ready.",
            icon: "🌐",
          },
          {
            title: "One Seed, Multiple Wallets",
            desc: "Indexed HD architecture. Recoverable.",
            icon: "🔑",
          },
          {
            title: "Built-in Testnet Mode",
            desc: "Switch easily between devnet/mainnet.",
            icon: "🧪",
          },
          {
            title: "Devnet Airdrop Faucet",
            desc: "Get SOL instantly on devnet.",
            icon: "💧",
          },
          {
            title: "Fully Encrypted Local Storage",
            desc: "Stored in IndexedDB using AES.",
            icon: "🔐",
          },
          {
            title: "No Backend, 100% Open-source",
            desc: "Privacy first. Own your keys.",
            icon: "🧱",
          },
        ].map(({ title, desc, icon }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-primary rounded-2xl shadow"
          >
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
          </motion.div>
        ))}
      </section>
      {/* How it works */}
      <section className="py-16">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            "Create or Import",
            "Choose Network",
            "Send & Receive",
            "Encrypt & Store",
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-primary p-4 rounded-xl shadow"
            >
              <h4 className="font-semibold mb-1">Step {i + 1}</h4>
              <p>{step}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* FAQ */}
      <section className="py-16">
        <h2 className="text-2xl font-bold mb-6 text-center">FAQ</h2>
        <div className="space-y-4">
          {[
            {
              q: "Is Vaultic secure?",
              a: "Yes. All data is encrypted locally and never leaves your device.",
            },
            {
              q: "Can I use it on mainnet?",
              a: "Yes. Both Ethereum and Solana mainnets are supported.",
            },
            {
              q: "Do you store my seed phrase?",
              a: "Never. Only you control your keys.",
            },
            {
              q: "Can developers use this for testing?",
              a: "Yes. It’s built for devs with full testnet support.",
            },
          ].map(({ q, a }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <details className="bg-primary rounded-xl p-4 shadow">
                <summary className="font-semibold cursor-pointer">{q}</summary>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {a}
                </p>
              </details>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
