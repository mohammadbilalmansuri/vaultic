"use client";
import { useState } from "react";
import { NETWORKS } from "@/config";
import { Network, NetworkAccount } from "@/types";
import { useClipboardActions, useCopiedId, useNetworkMode } from "@/stores";
import getShortAddress from "@/utils/getShortAddress";
import parseBalance from "@/utils/parseBalance";
import { Key } from "../icons";
import { CopyToggle, Modal, NetworkLogo, Tooltip, Button } from "../ui";

interface NetworkCardProps extends NetworkAccount {
  network: Network;
  isFor?: "dashboard" | "accounts";
  refreshingBalance?: boolean;
}

const NetworkCard = ({
  network,
  isFor = "dashboard",
  address,
  privateKey,
  balance,
  refreshingBalance = false,
}: NetworkCardProps) => {
  const copiedId = useCopiedId();
  const networkMode = useNetworkMode();
  const { copyToClipboard } = useClipboardActions();

  const [showingPrivateKey, setShowingPrivateKey] = useState(false);

  const { name, testnetName, token } = NETWORKS[network];
  const displayName =
    isFor === "dashboard" && networkMode === "testnet"
      ? `${name} ${testnetName}`
      : name;

  const shortAddress = getShortAddress(address, network);
  const privateKeyId = `${network}-private-key`;

  const renderDashboardBalance = () => {
    if (isFor !== "dashboard") return null;

    const { wasRounded, display, original } = parseBalance(balance, network);

    return (
      <Tooltip
        content={wasRounded ? `${original} ${token}` : undefined}
        position="left"
        delay={0}
      >
        <p className="font-medium leading-none cursor-default break-all text-right">
          {refreshingBalance ? (
            <span className="h-5 w-20 rounded bg-secondary animate-shimmer" />
          ) : (
            `${display} ${token}`
          )}
        </p>
      </Tooltip>
    );
  };

  const renderPrivateKeyButton = () => {
    if (isFor !== "accounts") return null;

    return (
      <Tooltip content="Show Private Key" position="left">
        <button
          type="button"
          className="icon-btn-bg -mr-1.5"
          onClick={() => setShowingPrivateKey(true)}
          aria-label="Show Private Key"
        >
          <Key />
        </button>
      </Tooltip>
    );
  };

  const renderPrivateKeyModal = () => {
    if (isFor !== "accounts" || !privateKey) return null;

    return (
      <Modal
        isOpen={showingPrivateKey}
        onClose={() => setShowingPrivateKey(false)}
        className="gap-4"
      >
        <h2 className="text-primary text-lg font-medium">
          Private Key • {name}
        </h2>
        <p className="highlight-yellow border rounded-2xl p-3">
          Never share your private key. Anyone with access to it can control
          your funds.
        </p>
        <div className="bg-input border rounded-2xl">
          <p className="text-primary p-4 pb-3.5 break-all">{privateKey}</p>
          <CopyToggle
            className="w-full justify-center p-3 border-t"
            labels={{ copied: "Copied", copy: "Copy" }}
            hasCopied={copiedId === privateKeyId}
            onClick={() => copyToClipboard(privateKey, privateKeyId)}
          />
        </div>
        <Button
          variant="zinc"
          className="w-full"
          onClick={() => setShowingPrivateKey(false)}
        >
          Close
        </Button>
      </Modal>
    );
  };

  return (
    <div
      className="w-full relative flex items-center justify-between gap-4 rounded-2xl bg-primary sm:p-4 p-3"
      aria-label={`${name} Card`}
    >
      <div className="flex items-center gap-2.5 py-1">
        <NetworkLogo network={network} size="sm" />
        <div className="flex flex-col items-start gap-1">
          <h4 className="font-medium text-primary leading-none text-nowrap">
            {displayName}
          </h4>
          <Tooltip
            content={copiedId === address ? "Copied!" : "Copy Address"}
            position="bottom"
          >
            <div
              className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors duration-200 sm:text-base text-15"
              onClick={() => copyToClipboard(address)}
              role="button"
              tabIndex={0}
              aria-label={`Copy ${network} address`}
            >
              <p className="leading-none">{shortAddress}</p>
              <CopyToggle
                hasCopied={copiedId === address}
                className="text-current"
                iconProps={{ className: "w-4" }}
              />
            </div>
          </Tooltip>
        </div>
      </div>

      {isFor === "accounts" ? (
        <>
          {renderPrivateKeyButton()}
          {renderPrivateKeyModal()}
        </>
      ) : (
        renderDashboardBalance()
      )}
    </div>
  );
};

export default NetworkCard;
