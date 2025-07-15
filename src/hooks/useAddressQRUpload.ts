"use client";
import { useRef, ChangeEvent } from "react";
import { Network } from "@/types";
import { useNotificationStore } from "@/stores";
import { scanQRCode } from "@/services/qr";

type AddressQRUploadConfig = {
  network: Network;
  onAddressScanned: (address: string) => void;
  validateAddress: (network: Network, address: string) => boolean;
};

/**
 * Hook for scanning wallet addresses from uploaded QR code images.
 * Handles file input, QR code scanning, address validation, and user feedback.
 * @param network - Target blockchain network for address validation
 * @param onAddressScanned - Callback executed when valid address is found
 * @param validateAddress - Function to validate scanned address format
 * @returns Object with fileInputRef for hidden input, triggerUpload to open file dialog, and handleFileChange for processing uploads
 */
const useAddressQRUpload = ({
  network,
  onAddressScanned,
  validateAddress,
}: AddressQRUploadConfig) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { notify } = useNotificationStore.getState();

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
