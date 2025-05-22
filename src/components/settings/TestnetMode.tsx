"use client";
import { useTransition } from "react";
import Link from "next/link";
import useNotificationStore from "@/stores/notificationStore";
import { useWalletStore } from "@/stores";
import { useBlockchain } from "@/hooks";
import { Switch } from "@/components/ui";

const TestnetMode = () => {
  const notify = useNotificationStore((s) => s.notify);
  const networkMode = useWalletStore((s) => s.networkMode);
  const { switchNetworkMode } = useBlockchain();
  const [switching, startSwitching] = useTransition();

  const toggleNetworkMode = () => {
    startSwitching(async () => {
      try {
        const enableTestnet = networkMode !== "devnet";
        await switchNetworkMode(enableTestnet ? "devnet" : "mainnet");
        notify({
          type: "success",
          message: enableTestnet
            ? "Switched to Testnet Mode."
            : "Switched to Mainnet Mode.",
          duration: 3000,
        });
      } catch {
        notify({
          type: "error",
          message: "Failed to switch network. Please try again.",
        });
      }
    });
  };

  return (
    <div className="w-full flex gap-6">
      <div className="flex flex-col gap-3 w-[90%]">
        <p>
          <span className="heading-color font-medium">Testnet Mode</span> lets
          you explore Vaultic in a safe environment without risking real assets.
          While it’s enabled, your wallet connects to Solana Devnet and Ethereum
          Sepolia — public test networks designed for experimentation.
        </p>
        <p>
          You’ll interact with test tokens and simulated balances, allowing you
          to learn the wallet flow, try transactions, or test integration
          behavior — ideal for first-time users and developers.
        </p>
        <p>
          Need test tokens?{" "}
          <Link
            href="/faucet"
            className="heading-color border-b border-transparent hover:border-current transition-colors duration-300"
          >
            Check available faucets
          </Link>
          .
        </p>
      </div>

      <div className="min-w-fit w-[10%] flex justify-end">
        <Switch
          state={networkMode === "devnet"}
          disabled={switching}
          onClick={toggleNetworkMode}
        />
      </div>
    </div>
  );
};

export default TestnetMode;
