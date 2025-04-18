"use client";
import { useState } from "react";
import useNotificationStore from "@/stores/notificationStore";

export default function NetworkSettings() {
  const [network, setNetwork] = useState<"mainnet" | "devnet">("mainnet");
  const notify = useNotificationStore((s) => s.notify);

  const switchNetwork = (value: "mainnet" | "devnet") => {
    setNetwork(value);
    notify({ type: "success", message: `Switched to ${value}` });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg heading-color">Select Network</p>
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            name="network"
            value="mainnet"
            checked={network === "mainnet"}
            onChange={() => switchNetwork("mainnet")}
          />
          Mainnet
        </label>
        <label>
          <input
            type="radio"
            name="network"
            value="devnet"
            checked={network === "devnet"}
            onChange={() => switchNetwork("devnet")}
          />
          Devnet
        </label>
      </div>
    </div>
  );
}
