import { NETWORKS } from "@/config";
import type { Network } from "@/types";
import cn from "@/utils/cn";

interface NetworkLogoProps {
  network: Network;
  size?: "sm" | "lg";
  className?: string;
}

const NetworkLogo = ({
  network,
  size = "sm",
  className = "",
}: NetworkLogoProps) => {
  const { name, icon: Icon } = NETWORKS[network];

  return (
    <div
      className={cn(
        "bg-white dark:bg-black flex items-center justify-center shrink-0 border dark:border-0",
        {
          "sm:size-10 size-8 sm:rounded-xl rounded-lg": size === "sm",
          "sm:size-14 size-12 sm:rounded-2xl rounded-xl": size === "lg",
        },
        className
      )}
      role="img"
      aria-label={`${name} network logo`}
    >
      <Icon className={cn(network === "ethereum" ? "h-3/5" : "h-2/5")} />
    </div>
  );
};

export default NetworkLogo;
