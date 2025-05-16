import React, { useState } from "react";
import { Solana, Ethereum, Trash, AngleDown } from "@/components/ui/icons";
import { CopyToggle, EyeToggle, Tooltip } from "@/components/ui";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";
import { NETWORK_TOKENS } from "@/constants";
import { TNetwork } from "@/types";

interface WalletProps {
  address: string;
  privateKey: string;
  index: number;
  balance: string;
  network: TNetwork;
  onDelete: (network: TNetwork, index: number, address: string) => void;
  copyToClipboard: (
    value: string,
    copied: boolean,
    setCopied: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<boolean>;
}

const Wallet = ({
  address,
  privateKey,
  index,
  balance,
  network,
  onDelete,
  copyToClipboard,
}: WalletProps) => {
  const [addressCopied, setAddressCopied] = useState(false);
  const [privateKeyCopied, setPrivateKeyCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [privateKeyHidden, setPrivateKeyHidden] = useState(true);

  return (
    <div className="w-full col-span-1 relative flex flex-col px-3 border-1.5 border-color rounded-3xl">
      <div className="w-full relative z-10 flex items-center justify-between gap-4 py-4 border-b-1.5 border-color px-2">
        <div className="flex items-center gap-3">
          {network === "solana" ? (
            <Solana className="h-5" />
          ) : network === "ethereum" ? (
            <Ethereum className="h-7" />
          ) : null}
          <h3 className="heading-color capitalize text-xl font-medium leading-none">{`${network} Wallet ${
            index + 1
          }`}</h3>
        </div>
        <p className="uppercase text-lg heading-color">{`${balance} ${NETWORK_TOKENS[network]}`}</p>
      </div>

      <div className="w-full relative flex flex-col gap-5 px-2 pt-4 pb-5">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-4">
            <h5 className="text-lg leading-none heading-color">Address</h5>
            <div className="flex items-center gap-4">
              <Tooltip content={addressCopied ? "Copied!" : "Copy address"}>
                <CopyToggle
                  copied={addressCopied}
                  onClick={() =>
                    copyToClipboard(address, addressCopied, setAddressCopied)
                  }
                />
              </Tooltip>
              {expanded && (
                <Tooltip content="Delete wallet">
                  <button
                    className="hover-icon"
                    onClick={() => onDelete(network, index, address)}
                  >
                    <Trash className="w-6" />
                  </button>
                </Tooltip>
              )}
              <Tooltip content={expanded ? "Collapse" : "Expand"}>
                <button
                  className="hover-icon"
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  <AngleDown
                    className={cn("w-6 transition-all duration-300", {
                      "rotate-180": expanded,
                    })}
                  />
                </button>
              </Tooltip>
            </div>
          </div>
          <p
            className={cn(
              "leading-none mt-px hover:heading-color transition-all duration-300 cursor-pointer",
              {
                "pointer-events-none": addressCopied,
              }
            )}
            onClick={() =>
              copyToClipboard(address, addressCopied, setAddressCopied)
            }
          >
            {getShortAddress(address, 10)}
          </p>
        </div>

        {expanded && (
          <div className="flex flex-col gap-2.5">
            <div className="w-full flex items-center justify-between">
              <h5 className="text-lg leading-none heading-color">
                Private Key
              </h5>
              <div className="flex items-center gap-4">
                <Tooltip
                  content={
                    privateKeyHidden ? "Show private key" : "Hide private key"
                  }
                >
                  <EyeToggle
                    hidden={privateKeyHidden}
                    onClick={() => setPrivateKeyHidden((prev) => !prev)}
                  />
                </Tooltip>
                <Tooltip
                  content={privateKeyCopied ? "Copied!" : "Copy private key"}
                >
                  <CopyToggle
                    copied={privateKeyCopied}
                    onClick={() =>
                      copyToClipboard(
                        privateKey,
                        privateKeyCopied,
                        setPrivateKeyCopied
                      )
                    }
                  />
                </Tooltip>
              </div>
            </div>
            <p
              className="hover:heading-color transition-all duration-300 cursor-pointer break-all"
              onClick={() =>
                copyToClipboard(
                  privateKey,
                  privateKeyCopied,
                  setPrivateKeyCopied
                )
              }
            >
              {privateKeyHidden
                ? Array(privateKey.length).fill("•").join("")
                : privateKey}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
