"use client";
import { useState } from "react";
import { NETWORKS } from "@/constants";
import { TNetwork, TNetworkMode } from "@/types";
import getShortAddress from "@/utils/getShortAddress";
import parseBalance from "@/utils/parseBalance";
import { useClipboard } from "@/hooks";
import { CopyToggle, Tooltip, NetworkLogo } from "@/components/ui";

interface NetworkCardProps {
  network: TNetwork;
  address: string;
  balance: string;
  networkMode: TNetworkMode;
}

const NetworkCard = ({
  network,
  address,
  balance,
  networkMode,
}: NetworkCardProps) => {
  const { name: networkName, token: networkToken } = NETWORKS[network];
  const copyToClipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const { original, display, wasRounded } = parseBalance(balance);

  return (
    <div
      key={network}
      className="w-full relative flex items-center justify-between rounded-3xl bg-primary px-5 py-6"
    >
      <div className="flex items-center gap-3">
        <NetworkLogo network={network} size="md" />

        <div className="flex flex-col items-start gap-1">
          <h4 className="font-medium heading-color">
            {`${networkName}${
              networkMode === "devnet"
                ? ` • ${NETWORKS[network].testnetName}`
                : ""
            }`}
          </h4>

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

      {wasRounded ? (
        <Tooltip content={`${original} ${networkToken}`}>
          <p className="text-md font-semibold leading-none cursor-default">
            {display} {networkToken}
          </p>
        </Tooltip>
      ) : (
        <p className="text-md font-semibold leading-none">
          {display} {networkToken}
        </p>
      )}
    </div>
  );
};

export default NetworkCard;
