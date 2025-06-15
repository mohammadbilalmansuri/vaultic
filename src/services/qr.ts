import QRCode from "qrcode";
import jsQR from "jsqr";
import { QR_CONFIG } from "../constants";

export const generateQRCode = async (text: string): Promise<string> => {
  return QRCode.toDataURL(text, QR_CONFIG);
};

export const scanQRCode = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return reject(new Error("Canvas context not available"));

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code?.data) {
          resolve(code.data.trim());
        } else {
          reject(new Error("No QR code found in the image."));
        }
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};
