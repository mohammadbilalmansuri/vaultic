import { NETWORKS } from "@/constants";
import { TNetwork } from "@/types";
import cn from "@/utils/cn";

interface NetworkLogoProps {
  network: TNetwork;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "size-8 rounded-lg",
  md: "size-10 rounded-xl",
  lg: "size-12 rounded-2xl",
  xl: "size-14 rounded-3xl",
};

const paddingClasses = {
  default: {
    sm: "p-2",
    md: "p-2.5",
    lg: "p-3",
    xl: "p-3.5",
  },
  ethereum: {
    sm: "p-2.5",
    md: "p-3",
    lg: "p-3.5",
    xl: "p-4",
  },
};

const NetworkLogo = ({
  network,
  size = "md",
  className = "",
}: NetworkLogoProps) => {
  const networkConfig = NETWORKS[network];
  if (!networkConfig || !networkConfig.icon) return null;

  const NetworkIcon = networkConfig.icon;

  return (
    <div
      className={cn(
        "bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center",
        sizeClasses[size],
        network === "ethereum"
          ? paddingClasses.ethereum[size]
          : paddingClasses.default[size],
        className
      )}
    >
      <NetworkIcon />
    </div>
  );
};

export default NetworkLogo;
