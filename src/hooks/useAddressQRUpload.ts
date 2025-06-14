"use client";
import { useRef, ChangeEvent } from "react";
import jsQR from "jsqr";
import { TNetwork } from "@/types";
import { useNotificationStore } from "@/stores";

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          const address = code.data.trim();
          const isValid = validateAddress(network, address);

          if (isValid) {
            onAddressScanned(address);
            notify({
              type: "success",
              message: "Address scanned successfully from QR code!",
              duration: 2000,
            });
          } else {
            notify({
              type: "error",
              message: `Invalid ${network} address found in QR code`,
              duration: 3000,
            });
          }
        } else {
          notify({
            type: "error",
            message: "No QR code found in the image",
            duration: 3000,
          });
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return { fileInputRef, triggerUpload, handleFileChange };
};

export default useAddressQRUpload;
