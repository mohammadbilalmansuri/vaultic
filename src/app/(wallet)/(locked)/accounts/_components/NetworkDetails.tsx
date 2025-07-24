"use client";
import { useState } from "react";
import { NETWORKS } from "@/config";
import { Network, NetworkAccount } from "@/types";
import { useClipboardStore, useWalletStore } from "@/stores";
import parseBalance from "@/utils/parseBalance";
import { CopyToggle, NetworkLogo, Tooltip } from "@/components/ui";

interface NetworkDetailsProps extends NetworkAccount {
  network: Network;
}

const NetworkDetails = ({
  network,
  balance,
  address,
  privateKey,
}: NetworkDetailsProps) => {
  const networkMode = useWalletStore((state) => state.networkMode);
  const copiedId = useClipboardStore((state) => state.copiedId);
  const copyToClipboard = useClipboardStore((state) => state.copyToClipboard);

  const [showingPrivateKey, setShowingFullPrivateKey] = useState(false);

  const { name, testnetName, token } = NETWORKS[network];
  const parsedBalance = parseBalance(balance);

  return (
    <div className="w-full relative flex flex-col gap-4 p-4 bg-primary rounded-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <NetworkLogo network={network} size="sm" />
          <h3 className="text-lg font-medium text-primary">
            {name}
            {networkMode === "testnet" && ` ${testnetName}`}
          </h3>
        </div>

        <Tooltip
          content={
            parsedBalance.wasRounded
              ? `${parsedBalance.original} ${token}`
              : undefined
          }
          position="left"
        >
          <p className="text-md font-medium leading-none cursor-default">{`${parsedBalance.display} ${token}`}</p>
        </Tooltip>
      </div>

      <div className="flex flex-col items-start gap-1">
        <h4 className="text-lg font-medium text-primary leading-none">
          Address
        </h4>

        <Tooltip
          content={copiedId === address ? "Copied!" : "Copy Address"}
          position="bottom"
        >
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-primary transition-all duration-200 group"
            onClick={() => copyToClipboard(address)}
            role="button"
            tabIndex={0}
            aria-label="Copy Address"
          >
            <p className="break-all font-mono">{address}</p>
            <CopyToggle
              hasCopied={copiedId === address}
              className="text-teal-500 group-hover:text-current -mt-px"
              iconProps={{ className: "w-4.5" }}
            />
          </div>
        </Tooltip>
      </div>

      <div className="flex flex-col items-start gap-1">
        <h4 className="text-md font-medium text-primary leading-none">
          Private Key
        </h4>

        <div className="flex items-center gap-2 text-left">
          {showingPrivateKey ? (
            <Tooltip
              content={copiedId === privateKey ? "Copied!" : "Copy Private Key"}
              position="bottom"
            >
              <div
                className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-all duration-200"
                onClick={() => copyToClipboard(privateKey)}
                role="button"
                tabIndex={0}
                aria-label="Copy Private Key"
              >
                <p className="break-all">{privateKey}</p>
                <CopyToggle
                  hasCopied={copiedId === privateKey}
                  className="text-current"
                  iconProps={{ className: "w-4" }}
                />
              </div>
            </Tooltip>
          ) : (
            <p className="truncate max-w-52">
              {privateKey.slice(0, 25) + "..."}
            </p>
          )}

          <button
            type="button"
            className="link text-teal-500"
            onClick={() => setShowingFullPrivateKey((prev) => !prev)}
            aria-label={
              showingPrivateKey ? "Hide Private Key" : "Show Private Key"
            }
          >
            {showingPrivateKey ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkDetails;
