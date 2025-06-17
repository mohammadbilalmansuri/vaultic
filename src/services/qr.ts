import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import jsQR from "jsqr";

const QR_CONFIG: QRCodeToDataURLOptions = {
  width: 256,
  margin: 2,
  color: { dark: "#000000", light: "#FFFFFF" },
  errorCorrectionLevel: "H",
};

const createCanvas = (): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");
  return { canvas, ctx };
};

export const generateQRCode = async (
  text: string,
  logoSvgUrl?: string
): Promise<string> => {
  const baseQR = await QRCode.toDataURL(text, QR_CONFIG);

  if (!logoSvgUrl) return baseQR;

  if (!logoSvgUrl.endsWith(".svg")) {
    throw new Error("Only SVG logos are supported for embedding in QR.");
  }

  return new Promise<string>((resolve, reject) => {
    const dimension = QR_CONFIG.width || 256;
    const { canvas, ctx } = createCanvas();
    canvas.width = dimension;
    canvas.height = dimension;

    const qrImage = new Image();
    qrImage.onload = () => {
      ctx.drawImage(qrImage, 0, 0, dimension, dimension);

      const logoImage = new Image();
      logoImage.crossOrigin = "anonymous";

      logoImage.onload = () => {
        const logoSize = 0.15 * dimension;
        const x = (dimension - logoSize) / 2;
        const y = (dimension - logoSize) / 2;

        const padding = 6;
        const border = 3;
        const bgSize = logoSize + padding * 2;

        ctx.fillStyle = QR_CONFIG.color?.light || "#FFFFFF";
        ctx.strokeStyle = QR_CONFIG.color?.dark || "#000000";
        ctx.lineWidth = border;
        ctx.beginPath();
        ctx.roundRect(x - padding, y - padding, bgSize, bgSize, 8);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, logoSize, logoSize, 4);
        ctx.clip();
        ctx.drawImage(logoImage, x, y, logoSize, logoSize);
        ctx.restore();

        // Validate QR
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = jsQR(imageData.data, canvas.width, canvas.height);

        if (!result || result.data.trim() !== text.trim()) {
          console.warn("QR validation failed — falling back to base QR.");
          return resolve(baseQR);
        }

        resolve(canvas.toDataURL("image/png"));
      };

      logoImage.onerror = () => reject(new Error("Failed to load logo"));
      logoImage.src = logoSvgUrl;
    };

    qrImage.onerror = () => reject(new Error("Failed to load base QR image"));
    qrImage.src = baseQR;
  });
};

export const scanQRCode = async (file: File): Promise<string> => {
  if (!file.type.startsWith("image/")) throw new Error("File must be an image");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const { canvas, ctx } = createCanvas();
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code?.data) {
          resolve(code.data.trim());
        } else {
          reject(new Error("No QR code found in the image"));
        }
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};
