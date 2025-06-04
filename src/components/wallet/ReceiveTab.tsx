"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { TNetwork } from "@/types";
import cn from "@/utils/cn";
import { Button, Loader } from "@/components/ui";
import {
  QR,
  Ethereum,
  Solana,
  Copy,
  CopyCheck,
  Download,
  Share,
} from "@/components/ui/icons";

interface ReceiveTabProps {
  activeAccount: any;
}

const ReceiveTab = ({ activeAccount }: ReceiveTabProps) => {
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [loadingQRs, setLoadingQRs] = useState<Record<string, boolean>>({});

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case "ethereum":
        return Ethereum;
      case "solana":
        return Solana;
      default:
        return QR;
    }
  };

  const generateQRCode = async (address: string, network: TNetwork) => {
    setLoadingQRs((prev) => ({ ...prev, [address]: true }));
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(address, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodes((prev) => ({ ...prev, [address]: qrCodeDataUrl }));
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    } finally {
      setLoadingQRs((prev) => ({ ...prev, [address]: false }));
    }
  };

  useEffect(() => {
    if (activeAccount) {
      generateQRCode(activeAccount.ethereum.address, "ethereum");
      generateQRCode(activeAccount.solana.address, "solana");
    }
  }, [activeAccount]);

  return (
    <div className="w-full">
      <div className="border border-color rounded-2xl p-6 bg-primary/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(["ethereum", "solana"] as TNetwork[]).map((network) => {
            const networkAccount = activeAccount[network];
            const Icon = getNetworkIcon(network);
            const copiedKey = `${networkAccount.address}-${network}`;

            return (
              <div
                key={network}
                className="border border-color rounded-xl p-6 bg-primary/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-8 h-8" />
                  <div>
                    <h4 className="font-semibold heading-color capitalize text-lg">
                      {network}
                    </h4>
                    <p className="text-sm text-color">
                      {network === "ethereum" ? "ETH" : "SOL"} Address
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center gap-2">
                    {loadingQRs[networkAccount.address] ? (
                      <div className="w-[200px] h-[200px] flex items-center justify-center">
                        <Loader />
                      </div>
                    ) : qrCodes[networkAccount.address] ? (
                      <>
                        <img
                          src={qrCodes[networkAccount.address]}
                          alt={`${network} address QR code`}
                          className="w-[200px] h-[200px]"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            className="icon-btn-bg"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = qrCodes[networkAccount.address];
                              link.download = `${network}-address-qr.png`;
                              link.click();
                            }}
                          >
                            <Download />
                          </button>
                          <button
                            className="icon-btn-bg"
                            onClick={async () => {
                              if (navigator.share) {
                                await navigator.share({
                                  title: `${network} Address QR`,
                                  files: [
                                    await fetch(qrCodes[networkAccount.address])
                                      .then((res) => res.blob())
                                      .then(
                                        (blob) =>
                                          new File(
                                            [blob],
                                            `${network}-address-qr.png`,
                                            { type: blob.type }
                                          )
                                      ),
                                  ],
                                });
                              } else {
                                alert(
                                  "Sharing is not supported on this device/browser."
                                );
                              }
                            }}
                          >
                            <Share />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded">
                        <QR className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Full Address */}
                  <div className="w-full space-y-3">
                    <div className="p-4 bg-input rounded-xl border">
                      <p className="text-xs text-color mb-2 uppercase tracking-wide font-medium">
                        Full Address
                      </p>
                      <p className="text-sm font-mono break-all heading-color leading-relaxed">
                        {networkAccount.address}
                      </p>
                    </div>

                    <Button
                      // onClick={() =>
                      //   onCopyAddress(networkAccount.address, network)
                      // }
                      variant="zinc"
                      className="w-full"
                    >
                      {false ? (
                        <>
                          <CopyCheck className="w-4 h-4 text-teal-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Address
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-xl">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            <p className="text-sm text-color">
              Share your address or QR code to receive tokens
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveTab;
