"use client";
import { motion } from "motion/react";
import { Address, PrivateKey } from "@/components/common";
import useWalletStore from "@/stores/walletStore";
import { Solana, Ethereum, Trash, AngleDown } from "@/components/ui/icons";
import { NETWORK_TOKENS } from "@/constants";
import { Button } from "@/components/ui";
import { useState } from "react";
import { useClipboard } from "@/hooks";
import { CopyToggle, EyeToggle } from "@/components/ui";
import cn from "@/utils/cn";
import getShortAddress from "@/utils/getShortAddress";

const Wallets = () => {
  const wallets = useWalletStore((state) => state.wallets);
  const copyToClipboard = useClipboard();
  const [addressCopied, setAddressCopied] = useState(false);
  const [privateKeyCopied, setPrivateKeyCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [privateKeyHidden, setPrivateKeyHidden] = useState(true);

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center flex-1 gap-5 py-5">
      <div className="w-full flex items-center justify-between gap-5">
        <h2 className="text-2xl font-medium heading-color">Your Wallets</h2>
        <Button size="sm">Add new wallet</Button>
      </div>
      <div className="w-full grid grid-cols-2 gap-5">
        {[...wallets.values()].map(
          ({ address, privateKey, index, balance, network }) => (
            <div
              key={address}
              className="w-full col-span-1 relative flex flex-col gap-4 py-5 px-3 border-1.5 border-color rounded-3xl"
            >
              <div className="w-full relative z-10 flex items-center justify-between gap-4 pb-4 border-b-1.5 border-color px-2">
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

              <div className="w-full relative flex flex-col gap-5 px-2">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-4">
                    <h5 className="text-lg leading-none heading-color">
                      Address
                    </h5>
                    <div className="flex items-center gap-4">
                      <CopyToggle
                        copied={addressCopied}
                        onClick={() =>
                          copyToClipboard(
                            address,
                            addressCopied,
                            setAddressCopied
                          )
                        }
                      />
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
                        <EyeToggle
                          hidden={privateKeyHidden}
                          onClick={() => setPrivateKeyHidden((prev) => !prev)}
                        />
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
          )
        )}
      </div>
    </div>
  );
};

export default Wallets;
