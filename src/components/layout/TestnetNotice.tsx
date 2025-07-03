"use client";
import { useWalletStore } from "@/stores";

const TestnetNotice = () => {
  const networkMode = useWalletStore((state) => state.networkMode);

  if (networkMode !== "testnet") return null;

  return (
    <div
      className="w-full bg-warning px-5 py-2 flex items-center justify-center"
      role="alert"
      aria-live="polite"
    >
      <p>You are currently in testnet mode.</p>
    </div>
  );
};

export default TestnetNotice;
