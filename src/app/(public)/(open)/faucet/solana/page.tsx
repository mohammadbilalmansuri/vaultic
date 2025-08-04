import type { Metadata } from "next";
import { SolanaFaucetClient } from "./solana-faucet-client";

export const metadata: Metadata = {
  title: "Solana Devnet Faucet | Vaultic",
  description:
    "Get free SOL tokens on Solana Devnet for testing and development. Request up to 5 SOL every 8 hours per address. Fast and reliable faucet with backup options.",
  alternates: { canonical: "/faucet/solana" },
};

export default function SolanaFaucetPage() {
  return <SolanaFaucetClient />;
}
