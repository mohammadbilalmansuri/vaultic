"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { NETWORKS } from "@/config";
import type { Network } from "@/types";
import {
  useAccountActions,
  useActiveAccountIndex,
  useCopiedId,
  useClipboardActions,
} from "@/stores";
import { generateQRCode } from "@/services/qr";
import { fadeUpAnimation } from "@/utils/animations";
import { useFileActions } from "@/hooks";
import { Download, Error, Share } from "@/components/icons";
import { Tooltip, CopyToggle } from "@/components/ui";

const qrCache = new Map<string, string>();

interface QRCodeData {
  network: Network;
  address: string;
  qrCode: string;
}

const ReceiveTabPanel = () => {
  const activeAccount = useAccountActions().getActiveAccount();
  const activeAccountIndex = useActiveAccountIndex();
  const copiedId = useCopiedId();
  const { copyToClipboard } = useClipboardActions();

  const { downloadFile, shareFile } = useFileActions();

  const [qrDataList, setQrDataList] = useState<QRCodeData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const entries = await Promise.all(
          Object.entries(activeAccount).map(
            async ([networkKey, { address }]) => {
              const network = networkKey as Network;
              const { svgUrlForQR } = NETWORKS[network];

              let qrCode = qrCache.get(address);
              if (!qrCode) {
                qrCode = await generateQRCode(address, svgUrlForQR);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccountIndex]);

  if (error) {
    return (
      <motion.div
        {...fadeUpAnimation()}
        className="box p-8 xs:gap-6 gap-5"
        aria-live="polite"
        role="alert"
      >
        <Error
          className="text-rose-500 icon-lg"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <p>{error}</p>
      </motion.div>
    );
  }

  return (
    <div
      className="w-full flex flex-col items-center md:gap-7 gap-6 text-center"
      role="region"
    >
      <div
        className="w-full grid sm:grid-cols-2 md:gap-6 gap-5"
        aria-label="Wallet addresses and QR codes"
      >
        {qrDataList
          ? qrDataList.map(({ network, address, qrCode }, index) => {
              const networkName = NETWORKS[network].name;

              return (
                <motion.div
                  key={`${network}-address-card`}
                  className="w-full sm:max-w-full max-w-md mx-auto rounded-3xl border-1.5"
                  {...fadeUpAnimation({ delay: index * 0.05 })}
                >
                  <div className="w-full flex items-center justify-between border-b-1.5 p-2.5 pl-4">
                    <h4 className="sm:text-lg text-md font-medium text-primary leading-none text-left">
                      {networkName} Address
                    </h4>

                    <div
                      className="flex items-center gap-2"
                      aria-label="QR code actions"
                    >
                      <Tooltip content="Download QR Code" position="left">
                        <button
                          type="button"
                          className="icon-btn-bg-sm"
                          onClick={async () =>
                            await downloadFile({
                              file: qrCode,
                              fileName: `${network}-${address}-qr-code.png`,
                              successMessage: `${networkName} QR code downloaded successfully`,
                            })
                          }
                          aria-label={`Download ${network} QR code`}
                        >
                          <Download />
                        </button>
                      </Tooltip>

                      <Tooltip content="Share QR Code" position="left">
                        <button
                          type="button"
                          className="icon-btn-bg-sm"
                          onClick={async () =>
                            await shareFile({
                              file: qrCode,
                              fileName: `${network}-${address}-qr-code.png`,
                              title: `${networkName} QR Code`,
                              text: `Use this QR code to send funds to my ${networkName} wallet.`,
                            })
                          }
                          aria-label={`Share ${network} QR code`}
                        >
                          <Share />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-center md:gap-6 gap-5 md:p-6 p-5">
                    <Image
                      src={qrCode}
                      width={200}
                      height={200}
                      className="size-40 rounded-lg mt-px"
                      loading="lazy"
                      alt={`QR code for ${network} address`}
                    />

                    <div className="w-full bg-input border rounded-2xl text-center">
                      <p className="text-primary pt-4 pb-3.5 lg:px-8 md:px-6 px-4 break-all">
                        {address}
                      </p>

                      <CopyToggle
                        className="w-full justify-center border-t p-3"
                        labels={{ copied: "Copied!", copy: "Copy Address" }}
                        hasCopied={copiedId === address}
                        onClick={() => copyToClipboard(address)}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })
          : Array.from({ length: 2 }).map((_, index) => (
              <div
                key={`qr-placeholder-${index}`}
                className="h-100 rounded-3xl bg-primary animate-shimmer"
                aria-hidden={true}
              />
            ))}
      </div>

      {qrDataList ? (
        <motion.p {...fadeUpAnimation({ delay: 0.1 })}>
          Use these QR codes or addresses to receive tokens on each supported
          network.
        </motion.p>
      ) : (
        <div
          className="w-3/4 h-5 animate-shimmer bg-primary rounded-md"
          aria-hidden={true}
        />
      )}
    </div>
  );
};

export default ReceiveTabPanel;
