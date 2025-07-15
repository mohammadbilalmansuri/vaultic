"use client";
import { useWalletStore } from "@/stores";

const TestnetNotice = () => {
  const networkMode = useWalletStore((state) => state.networkMode);

  if (networkMode !== "testnet") return null;

  return (
    <div
      role="status"
      aria-label="Testnet Mode Indicator"
      className="bg-warning text-warning border border-warning uppercase text-sm font-medium text-center leading-none p-2 rounded-lg select-none cursor-default"
    >
      Testnet Mode
    </div>
  );
};

export default TestnetNotice;
