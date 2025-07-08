"use client";
import { useWalletStore } from "@/stores";

const TestnetNotice = () => {
  const networkMode = useWalletStore((state) => state.networkMode);

  if (networkMode !== "testnet") return null;

  return (
    <div
      className="w-full bg-warning sm:px-5 px-4 py-2 flex items-center justify-center text-center"
      role="alert"
      aria-live="polite"
      aria-label="Testnet Mode Notice"
    >
      <p>You are currently in testnet mode.</p>
    </div>
  );
};

export default TestnetNotice;
