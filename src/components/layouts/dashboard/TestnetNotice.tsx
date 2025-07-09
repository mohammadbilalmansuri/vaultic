"use client";
import { Tooltip } from "@/components/ui";
import { useWalletStore } from "@/stores";

const TestnetNotice = () => {
  const networkMode = useWalletStore((state) => state.networkMode);

  if (networkMode !== "testnet") return null;

  return (
    <Tooltip content="You are currently in testnet mode." position="bottom">
      <div className="bg-yellow-500/10 text-yellow-800 dark:text-yellow-500 border border-yellow-500/30 dark:border-yellow-500/10 uppercase text-sm font-medium leading-none p-2 rounded-lg select-none cursor-default">
        Testnet Mode
      </div>
    </Tooltip>
  );
};

export default TestnetNotice;
