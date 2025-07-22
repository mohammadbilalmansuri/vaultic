import { NETWORKS } from "@/config";
import type { Network } from "@/types";
import cn from "@/utils/cn";

interface NetworkLogoProps {
  network: Network;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const NetworkLogo = ({
  network,
  size = "md",
  className = "",
}: NetworkLogoProps) => {
  const { name, icon: Icon } = NETWORKS[network];

  return (
    <div
      className={cn(
        "bg-white dark:bg-black flex items-center justify-center shrink-0",
        {
          "sm:size-8 size-7 rounded-lg": size === "sm",
          "sm:size-10 size-9 rounded-xl": size === "md",
          "sm:size-14 size-12 rounded-2xl": size === "lg",
        },
        className
      )}
      role="img"
      aria-label={`${name} network logo`}
    >
      <Icon className={cn(network === "ethereum" ? "h-[65%]" : "h-[45%]")} />
    </div>
  );
};

export default NetworkLogo;
