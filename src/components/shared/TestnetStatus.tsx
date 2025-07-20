"use client";
import { useWalletStore } from "@/stores";
import cn from "@/utils/cn";

interface TestnetStatusProps {
  variant?: "indicator" | "notice";
  className?: string;
}

const TestnetStatus = ({
  variant = "indicator",
  className = "",
}: TestnetStatusProps) => {
  const networkMode = useWalletStore((state) => state.networkMode);

  if (networkMode !== "testnet") return null;

  return (
    <div
      className={cn(
        "highlight-yellow select-none cursor-default text-center p-2",
        {
          "uppercase text-sm font-medium leading-none border rounded-lg pb-1.75":
            variant === "indicator",
        },
        className
      )}
      role="status"
      aria-label={`Testnet mode ${variant}`}
      aria-live="polite"
    >
      {variant === "indicator"
        ? "Testnet Mode"
        : "You are currently in Testnet Mode"}
    </div>
  );
};

export default TestnetStatus;
