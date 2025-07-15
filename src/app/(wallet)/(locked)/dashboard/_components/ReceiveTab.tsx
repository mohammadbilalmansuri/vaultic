"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { NETWORKS } from "@/config";
import type { Network } from "@/types";
import { useAccountsStore } from "@/stores";
import { generateQRCode } from "@/services/qr";
import { fadeUpAnimation } from "@/utils/animations";
import { useClipboard, useFileActions } from "@/hooks";
import { Download, Error, Share } from "@/components/icons";
import { Tooltip, CopyToggle } from "@/components/ui";

const qrCache = new Map<string, string>();

interface QRCodeData {
  network: Network;
  address: string;
  qrCode: string;
}

const ReceiveTab = () => {
  const activeAccount = useAccountsStore((state) => state.getActiveAccount());
  const activeAccountIndex = useAccountsStore(
    (state) => state.activeAccountIndex
  );

  const [qrDataList, setQrDataList] = useState<QRCodeData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const { downloadFile, shareFile } = useFileActions();
  const copyToClipboard = useClipboard();

  useEffect(() => {
    (async () => {
      try {
        const entries = await Promise.all(
          Object.entries(activeAccount).map(
            async ([networkKey, { address }]) => {
              const network = networkKey as Network;

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
      <div className="box p-8 gap-6">
        <Error className="text-rose-500 icon-lg" strokeWidth={1.5} />
        <p>{error}</p>
      </div>
    );
  }

  if (!qrDataList) return null;

  return (
    <div className="w-full flex flex-col items-center gap-8 text-center">
      <div className="w-full grid grid-cols-2 gap-7.5">
        {qrDataList.map(({ network, address, qrCode }, index) => {
          const networkName = NETWORKS[network].name;
          return (
            <motion.div
              key={`${network}-address-card`}
              className="w-full flex flex-col items-center border-1.5 rounded-3xl"
              {...fadeUpAnimation({ delay: 0.1 * index })}
            >
              <div className="w-full flex items-center justify-between border-b-1.5 px-4 py-3">
                <h4 className="text-lg font-medium heading-color">
                  {networkName} Address
                </h4>

                <div className="flex items-center gap-5">
                  <Tooltip content="Download QR Code">
                    <button
                      className="icon-btn"
                      onClick={({ currentTarget }) => {
                        downloadFile({
                          file: qrCode,
                          fileName: `${network}-${address}-qr-code.png`,
                          successMessage: `${networkName} QR code downloaded successfully`,
                        });
                        currentTarget.blur();
                      }}
                    >
                      <Download />
                    </button>
                  </Tooltip>

                  <Tooltip content="Share QR Code">
                    <button
                      className="icon-btn"
                      onClick={async ({ currentTarget }) => {
                        await shareFile({
                          file: qrCode,
                          fileName: `${network}-${address}-qr-code.png`,
                          title: `${networkName} QR Code`,
                          text: `Use this QR code to send funds to my ${networkName} wallet.`,
                        });
                        currentTarget.blur();
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
                  alt={`${networkName} QR Code`}
                  width={200}
                  height={200}
                  className="size-40 rounded-lg"
                  loading="lazy"
                />

                <div className="w-full bg-input border rounded-2xl">
                  <p className="heading-color pt-4 pb-3 px-8 break-all">
                    {address}
                  </p>

                  <CopyToggle
                    className="w-full justify-center border-t p-3"
                    labels={{ copied: "Copied!", copy: "Copy Address" }}
                    hasCopied={copiedAddress === network}
                    onClick={() =>
                      copyToClipboard(
                        address,
                        copiedAddress === network,
                        (copied) => setCopiedAddress(copied ? address : null)
                      )
                    }
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.p {...fadeUpAnimation({ delay: qrDataList.length * 0.1 })}>
        Use these QR codes or addresses to receive tokens on each supported
        network.
      </motion.p>
    </div>
  );
};

export default ReceiveTab;
