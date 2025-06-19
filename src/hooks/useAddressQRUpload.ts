"use client";
import { useRef, ChangeEvent } from "react";
import { TNetwork } from "@/types";
import { useNotificationStore } from "@/stores";
import { scanQRCode } from "@/services/qr";

type AddressQRUploadConfig = {
  network: TNetwork;
  onAddressScanned: (address: string) => void;
  validateAddress: (network: TNetwork, address: string) => boolean;
};

const useAddressQRUpload = ({
  network,
  onAddressScanned,
  validateAddress,
}: AddressQRUploadConfig) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notify = useNotificationStore((state) => state.notify);

  const triggerUpload = () => fileInputRef.current?.click();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const address = await scanQRCode(file);
      const isValid = validateAddress(network, address);

      if (isValid) {
        onAddressScanned(address);
        notify({
          type: "success",
          message: "Address scanned successfully from QR code!",
          duration: 3000,
        });
      } else {
        notify({
          type: "error",
          message: `Invalid ${network} address found in QR code`,
        });
      }
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to scan QR code",
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return { fileInputRef, triggerUpload, handleFileChange };
};

export default useAddressQRUpload;
