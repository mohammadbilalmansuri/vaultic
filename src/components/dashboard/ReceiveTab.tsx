"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { NETWORKS } from "@/constants";
import { TNetwork } from "@/types";
import { useAccountsStore } from "@/stores";
import { generateQRCode } from "@/services/qr";
import { fadeUpAnimation } from "@/utils/animations";
import { useClipboard, useFileActions } from "@/hooks";
import { Tooltip, CopyToggle } from "../ui";
import { Download, Share, Warning } from "../ui/icons";
import getShortAddress from "@/utils/getShortAddress";

const qrCache = new Map<string, string>();

interface IQRCodeData {
  network: TNetwork;
  address: string;
  qrCode: string;
}

const ReceiveTab = () => {
  const activeAccount = useAccountsStore((s) => s.getActiveAccount());
  const activeAccountIndex = useAccountsStore((s) => s.activeAccountIndex);

  const [qrDataList, setQrDataList] = useState<IQRCodeData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedNetwork, setCopiedNetwork] = useState<TNetwork | null>(null);

  const { downloadFile, shareFile } = useFileActions();
  const copyToClipboard = useClipboard();

  useEffect(() => {
    (async () => {
      try {
        const entries = await Promise.all(
          Object.entries(activeAccount).map(
            async ([networkKey, { address }]) => {
              const network = networkKey as TNetwork;

              let qrCode = qrCache.get(address);
              if (!qrCode) {
                qrCode = await generateQRCode(
                  address,
                  NETWORKS[network].svgUrlForQR
                );
                qrCache.set(address, qrCode);
              }

              return { network, address, qrCode };
            }
          )
        );

        setQrDataList(entries);
      } catch {
        setError(
          "We couldn’t generate your QR codes right now. Please refresh the page or contact support if the issue continues."
        );
      }
    })();
  }, [activeAccountIndex]);

  if (error) {
    return (
      <div className="box p-12">
        <Warning className="text-yellow-500 w-15" />
        <p>{error}</p>
      </div>
    );
  }

  if (!qrDataList) return null;

  return (
    <div className="w-full flex flex-col items-center gap-8 text-center">
      <div className="w-full grid grid-cols-2 gap-7">
        <AnimatePresence>
          {qrDataList.map(({ network, address, qrCode }, index) => (
            <motion.div
              key={network}
              className="w-full flex flex-col items-center border-1.5 border-color rounded-3xl"
              {...fadeUpAnimation({ delay: 0.1 * (index + 1) })}
            >
              <div className="w-full flex items-center justify-between border-b-1.5 border-color px-4 py-3.5">
                <h4 className="text-lg font-medium heading-color">
                  {NETWORKS[network].name} Address
                </h4>
                <div className="flex items-center gap-5">
                  <Tooltip content="Download QR Code">
                    <button
                      className="icon-btn"
                      onClick={() =>
                        downloadFile({
                          file: qrCode,
                          fileName: `${network}-${address}-qr-code.png`,
                          successMessage: `${NETWORKS[network].name} QR code downloaded successfully`,
                        })
                      }
                    >
                      <Download />
                    </button>
                  </Tooltip>

                  <Tooltip content="Share QR Code">
                    <button
                      className="icon-btn"
                      onClick={async (e) => {
                        await shareFile({
                          file: qrCode,
                          fileName: `${network}-${getShortAddress(
                            address
                          )}-qr-code.png`,
                          title: `${NETWORKS[network].name} QR Code`,
                          text: `Use this QR code to send funds to my ${NETWORKS[network].name} wallet.`,
                        });
                        e.currentTarget.blur();
                      }}
                    >
                      <Share />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 p-6">
                <Image
                  src={qrCode}
                  alt={`${NETWORKS[network].name} QR Code`}
                  width={200}
                  height={200}
                  className="size-40 rounded-lg"
                  loading="lazy"
                />
                <div className="w-full bg-input border border-color rounded-2xl">
                  <p className="heading-color pt-4 pb-3 px-8 break-all">
                    {address}
                  </p>
                  <CopyToggle
                    className="w-full justify-center border-t border-color p-3"
                    labels={{
                      copied: "Copied!",
                      copy: "Copy Address",
                    }}
                    hasCopied={copiedNetwork === network}
                    onClick={() =>
                      copyToClipboard(
                        address,
                        copiedNetwork === network,
                        (copied) => setCopiedNetwork(copied ? network : null)
                      )
                    }
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.p {...fadeUpAnimation({ delay: qrDataList.length * 0.1 + 0.1 })}>
        Use these QR codes or addresses to receive tokens on each supported
        network.
      </motion.p>
    </div>
  );
};

export default ReceiveTab;
