"use client";
import { useTransition } from "react";
import { useBlockchain } from "@/hooks";
import useNotificationStore from "@/stores/notificationStore";
import useUserStore from "@/stores/userStore";
import { TNetworkMode } from "@/types";
import { Switch } from "../ui";

const NetworkSettings = () => {
  const notify = useNotificationStore((s) => s.notify);
  const networkMode = useUserStore((s) => s.networkMode);
  const { switchNetworkMode } = useBlockchain();
  const [switching, startSwitching] = useTransition();

  const toggleNetworkMode = () => {
    startSwitching(async () => {
      try {
        await switchNetworkMode(
          networkMode === "mainnet" ? "devnet" : "mainnet"
        );
        notify({
          type: "success",
          message: `Switched to ${
            networkMode === "devnet" ? "Testnet" : "Devnet"
          }`,
        });
      } catch (_) {
        notify({
          type: "error",
          message: "We couldn't switch the network mode.",
        });
      }
    });
  };

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg heading-color">Testnet Mode</h3>
        <p>Applies to balances and app connections.</p>
      </div>

      <Switch
        state={networkMode === "devnet"}
        disabled={switching}
        onClick={toggleNetworkMode}
      />
    </div>
  );
};

export default NetworkSettings;
