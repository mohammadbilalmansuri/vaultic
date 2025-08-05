import type { Metadata } from "next";
import { FaucetClient } from "./client";

export const metadata: Metadata = {
  title: "Vaultic Faucet – Free Ethereum & Solana Testnet Tokens",
  description:
    "Access free Ethereum Sepolia and Solana Devnet tokens for development, testing, and experimentation. Perfect for blockchain developers.",
  alternates: { canonical: "/faucet" },
};

export default function FaucetPage() {
  return <FaucetClient />;
}
