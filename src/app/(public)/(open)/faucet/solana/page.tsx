import type { Metadata } from "next";
import { APP_METADATA_KEYWORDS } from "@/constants";
import { SolanaFaucetClient } from "./client";

export const metadata: Metadata = {
  title: "Solana Devnet Faucet | Vaultic",
  description:
    "Get free SOL tokens on Solana Devnet for testing and development. Request up to 5 SOL every 8 hours per address. Fast and reliable faucet with backup options.",
  alternates: { canonical: "/faucet/solana" },
  keywords: [
    "solana faucet",
    "solana devnet faucet",
    "free solana devnet tokens",
    "solana airdrop",
    "solana devnet",
    "free solana tokens",
    "crypto faucet",
    "solana development",
    "request solana tokens",
    "solana airdrop request",
    "vaultic solana faucet",
    ...APP_METADATA_KEYWORDS,
  ],
};

export default function SolanaFaucetPage() {
  return <SolanaFaucetClient />;
}
