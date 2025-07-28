"use client";
import { useState } from "react";
import { NETWORKS } from "@/config";
import { useClipboardActions, useCopiedId, useNetworkMode } from "@/stores";
import { Network, NetworkAccount } from "@/types";
import { CopyToggle, Modal, NetworkLogo, Tooltip, Button } from "../ui";
import { Key } from "../icons";
import getShortAddress from "@/utils/getShortAddress";
import parseBalance from "@/utils/parseBalance";

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
  refreshingBalance,
}: NetworkCardProps) => {
  const copiedId = useCopiedId();
  const networkMode = useNetworkMode();
  const { copyToClipboard } = useClipboardActions();

  const [showingPrivateKey, setShowingPrivateKey] = useState(false);

  const { name, testnetName, token } = NETWORKS[network];
  const networkDisplayName =
    isFor === "accounts"
      ? name
      : `${name}${networkMode === "testnet" ? ` ${testnetName}` : ""}`;

  const privateKeyId = `${network}-private-key`;

  const renderDashboardBalance = () => {
    const { wasRounded, display, original } = parseBalance(balance, network);

    return (
      <Tooltip
        content={wasRounded ? `${original} ${token}` : undefined}
        position="left"
        delay={0}
      >
        <p className="text-md font-semibold leading-none cursor-default">
          {refreshingBalance ? (
            <span className="h-5 w-20 rounded bg-secondary animate-shimmer" />
          ) : (
            `${display} ${token}`
          )}
        </p>
      </Tooltip>
    );
  };

  const renderAccountsButton = () => (
    <Tooltip content="Show Private Key" position="left">
      <button
        type="button"
        className="icon-btn-bg"
        onClick={() => setShowingPrivateKey(true)}
        aria-label="Show Private Key"
      >
        <Key />
      </button>
    </Tooltip>
  );

  return (
    <div
      key={`${network}-card`}
      className="w-full relative flex items-center justify-between rounded-3xl bg-primary px-5 py-6"
      aria-label={`${networkDisplayName} Card`}
    >
      <div className="flex items-center gap-2.5">
        <span aria-hidden="true" className="shrink-0">
          <NetworkLogo network={network} size="md" />
        </span>

        <div className="flex flex-col items-start sm:gap-1">
          <h4 className="font-medium text-primary">{networkDisplayName}</h4>

          <Tooltip
            content={copiedId === address ? "Copied!" : "Copy Address"}
            position="bottom"
          >
            <div
              className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-all duration-200"
              onClick={() => copyToClipboard(address)}
              role="button"
              tabIndex={0}
              aria-label={`Copy ${network} address`}
            >
              <p className="leading-none">
                {getShortAddress(address, network)}
              </p>
              <CopyToggle
                hasCopied={copiedId === address}
                className="text-current"
                iconProps={{ className: "w-4" }}
              />
            </div>
          </Tooltip>
        </div>
      </div>

      {isFor === "dashboard"
        ? renderDashboardBalance()
        : renderAccountsButton()}

      {isFor === "accounts" && (
        <Modal
          isOpen={showingPrivateKey}
          onClose={() => setShowingPrivateKey(false)}
          className="gap-4"
        >
          <h2 className="text-primary text-lg font-medium">
            Private Key &bull; {name}
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
      )}
    </div>
  );
};

export default NetworkCard;
