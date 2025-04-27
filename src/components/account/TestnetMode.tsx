"use client";
import { useTransition } from "react";
import motion from "framer-motion";
import { useBlockchain } from "@/hooks";
import useNotificationStore from "@/stores/notificationStore";
import useUserStore from "@/stores/userStore";
import { Switch } from "@/components/ui";
import Link from "next/link";

const TestnetMode = () => {
  const notify = useNotificationStore((s) => s.notify);
  const networkMode = useUserStore((s) => s.networkMode);
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
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex gap-5">
        <p className="w-[83%]">
          Testnet Mode lets you explore safely without real assets. Balances,
          app connections, and transactions will happen on test networks like
          Solana Devnet and Ethereum Sepolia. Claim free test tokens from
          faucets, try out Vaultic (our secure wallet), and get comfortable
          before operating with real assets.
        </p>

        <div className="w-[17%] flex flex-col items-end">
          <Switch
            state={networkMode === "devnet"}
            disabled={switching}
            onClick={toggleNetworkMode}
          />
        </div>
      </div>

      {networkMode === "devnet" && (
        <p>
          Need test tokens?{" "}
          <Link
            href="/faucets"
            className="heading-color hover:underline"
            target="_blank"
          >
            Get them from available faucets
          </Link>
          .
        </p>
      )}
    </div>
  );
};

export default TestnetMode;
