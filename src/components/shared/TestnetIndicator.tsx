"use client";
import { useWalletStore } from "@/stores";
import cn from "@/utils/cn";

const TestnetIndicator = ({ className = "" }: { className?: string }) => {
  const networkMode = useWalletStore((state) => state.networkMode);

  if (networkMode !== "testnet") return null;

  return (
    <div
      role="status"
      aria-label="Testnet Mode Indicator"
      className={cn(
        "bg-warning text-warning border border-warning uppercase text-sm font-medium text-center leading-none rounded-lg select-none cursor-default px-2 pt-2 pb-1.75",
        className
      )}
    >
      Testnet Mode
    </div>
  );
};

export default TestnetIndicator;
