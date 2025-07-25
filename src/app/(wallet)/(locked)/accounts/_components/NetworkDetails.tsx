"use client";
import { useEffect, useState } from "react";
import { NETWORKS } from "@/config";
import { Network, NetworkAccount } from "@/types";
import { useClipboardStore, useWalletStore } from "@/stores";
import parseBalance from "@/utils/parseBalance";
import { CopyToggle, EyeToggle, NetworkLogo, Tooltip } from "@/components/ui";

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

  const [showingPrivateKey, setShowingPrivateKey] = useState(false);

  useEffect(() => setShowingPrivateKey(false), [network]);

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
          delay={0}
        >
          <p className="text-md font-medium leading-none cursor-default">{`${parsedBalance.display} ${token}`}</p>
        </Tooltip>
      </div>

      <div className="flex flex-col items-start gap-1">
        <div className="w-full flex items-center justify-between gap-3">
          <h4 className="text-lg font-medium text-primary leading-none">
            Address
          </h4>
          <Tooltip
            content={copiedId === address ? "Copied!" : "Copy Address"}
            position="left"
          >
            <CopyToggle
              hasCopied={copiedId === address}
              className="text-current"
              onClick={() => copyToClipboard(address)}
            />
          </Tooltip>
        </div>

        <p className="break-all">{address}</p>
      </div>

      <div className="flex flex-col items-start gap-1">
        <div className="w-full flex items-center justify-between gap-3">
          <h4 className="text-md font-medium text-primary leading-none">
            Private Key
          </h4>
          <div className="flex items-center gap-4">
            <EyeToggle
              isVisible={showingPrivateKey}
              className="text-current"
              onClick={() => setShowingPrivateKey((prev) => !prev)}
            />
            <CopyToggle
              hasCopied={copiedId === privateKey}
              className="text-current"
              onClick={() => copyToClipboard(privateKey)}
            />
          </div>
        </div>

        <p className="break-all">
          {showingPrivateKey
            ? privateKey
            : Array.from({ length: privateKey.length }).fill("•").join("")}
        </p>
      </div>
    </div>
  );
};

export default NetworkDetails;
