"use client";

import { useState } from "react";
import { NETWORKS_METADATA } from "@/constants";
import { TNetwork, TNetworkMode } from "@/types";
import { useClipboard } from "@/hooks";
import { CopyToggle, Tooltip } from "@/components/ui";
import getShortAddress from "@/utils/getShortAddress";
import parseBalance from "@/utils/parseBalance";
import cn from "@/utils/cn";

interface NetworkCardProps {
  network: TNetwork;
  address: string;
  balance: string;
  networkMode?: TNetworkMode;
}

const NetworkCard = ({
  network,
  address,
  balance,
  networkMode,
}: NetworkCardProps) => {
  const { name, token, icon: Icon } = NETWORKS_METADATA[network];
  const copyToClipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const { original, fixed, isFixed } = parseBalance(balance);

  return (
    <div
      key={network}
      className="w-full relative flex items-center justify-between rounded-3xl border border-color px-5 py-6 bg-primary"
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "size-10 bg-zinc-50 dark:bg-zinc-950 rounded-xl flex items-center justify-center p-2.5",
            { "p-3": network === "ethereum" }
          )}
        >
          <Icon />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium heading-color leading-none">
            {name}
          </h3>

          <Tooltip
            content={copied ? "Copied!" : "Copy address"}
            position="bottom"
          >
            <div
              className="flex items-center gap-1.5 cursor-pointer hover:heading-color transition-all duration-300"
              onClick={() => copyToClipboard(address, copied, setCopied)}
            >
              <p className="leading-none">
                {getShortAddress(address, network)}
              </p>
              <CopyToggle
                hasCopied={copied}
                className="text-current"
                iconProps={{ className: "w-4" }}
              />
            </div>
          </Tooltip>
        </div>
      </div>

      {isFixed ? (
        <p className="text-lg font-semibold leading-none">
          {fixed} {token}
        </p>
      ) : (
        <Tooltip content={`${original} ${token}`}>
          <p className="text-md leading-none cursor-default">
            {fixed} {token}
          </p>
        </Tooltip>
      )}
    </div>
  );
};

export default NetworkCard;
