"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import jsQR from "jsqr";
import { TNetwork } from "@/types";
import cn from "@/utils/cn";
import { Button, Input, Loader, Tooltip } from "@/components/ui";
import { Send, Ethereum, Solana, WalletMoney, QR } from "@/components/ui/icons";

interface SendFormData {
  toAddress: string;
  amount: string;
  network: TNetwork;
}

interface SendTabProps {
  activeAccount: any;
}

const SendTab = ({ activeAccount }: SendTabProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<SendFormData>({
    mode: "onChange",
    defaultValues: {
      network: "ethereum",
    },
  });

  const selectedNetwork = watch("network");
  const currentAmount = watch("amount");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<SendFormData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case "ethereum":
        return Ethereum;
      case "solana":
        return Solana;
      default:
        return WalletMoney;
    }
  };

  const handleMaxAmount = () => {
    const balance = activeAccount[selectedNetwork]?.balance;
    if (balance) {
      // Reserve small amount for fees
      const maxAmount = Math.max(
        0,
        parseFloat(balance) - (selectedNetwork === "ethereum" ? 0.001 : 0.01)
      );
      setValue("amount", maxAmount.toString());
    }
  };
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, img.width, img.height);

          if (code && code.data) {
            // Set the scanned address in the form
            setValue("toAddress", code.data);
            alert("QR code scanned successfully!");
          } else {
            alert("No QR code found in the image.");
          }
        };
        img.onerror = () => {
          alert("Failed to load image for QR scan.");
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error reading QR code:", error);
      alert("Failed to scan QR code.");
    }
  };

  const handleQRClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="border border-color rounded-2xl p-6 bg-primary/30">
        <form
          onSubmit={handleSubmit((data) => {
            setPendingData(data);
            setShowConfirm(true);
          })}
          className="space-y-6"
        >
          {/* Network Selection as Dropdown */}
          <div>
            <select
              {...register("network", { required: true })}
              className="input h-14 text-base w-full"
            >
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
            </select>
          </div>{" "}
          {/* Recipient Address with QR Scanner (file upload only) */}
          <div className="flex gap-2 items-center">
            <Input
              {...register("toAddress", {
                required: "Recipient address is required",
                minLength: {
                  value: 10,
                  message: "Invalid address format",
                },
              })}
              placeholder="Enter recipient address"
              className={cn(
                "h-14 text-base flex-1",
                errors.toAddress ? "border-rose-500" : ""
              )}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Tooltip content="Upload QR Code Image">
              <button
                type="button"
                onClick={handleQRClick}
                className="icon-btn-bg"
              >
                <QR />
              </button>
            </Tooltip>
          </div>
          {errors.toAddress && (
            <p className="text-rose-500 text-sm mt-2">
              {errors.toAddress.message}
            </p>
          )}
          {/* Amount */}
          <div>
            <div className="relative">
              <Input
                {...register("amount", {
                  required: "Amount is required",
                  min: {
                    value: 0.000001,
                    message: "Amount must be greater than 0",
                  },
                  validate: (value) => {
                    const balance = activeAccount[selectedNetwork]?.balance;
                    if (parseFloat(value) > parseFloat(balance || "0")) {
                      return "Insufficient balance";
                    }
                    return true;
                  },
                })}
                type="number"
                step="0.000001"
                placeholder={`Enter amount in ${
                  selectedNetwork === "ethereum" ? "ETH" : "SOL"
                }`}
                className={cn(
                  "h-14 text-base pr-20",
                  errors.amount ? "border-rose-500" : ""
                )}
              />
              <Button
                type="button"
                variant="zinc"
                size="sm"
                onClick={handleMaxAmount}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-3"
              >
                MAX
              </Button>
            </div>
            {errors.amount && (
              <p className="text-rose-500 text-sm mt-2">
                {errors.amount.message}
              </p>
            )}
            <div className="flex justify-between items-center mt-2 text-sm text-color">
              <span>
                Balance: {activeAccount[selectedNetwork]?.balance || "0"}{" "}
                {selectedNetwork === "ethereum" ? "ETH" : "SOL"}
              </span>
              {currentAmount && (
                <span>
                  ≈ $
                  {(
                    parseFloat(currentAmount) *
                    (selectedNetwork === "ethereum" ? 2500 : 100)
                  ).toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-14 text-base"
            // disabled={!isValid || sending}
          >
            {false ? (
              <Loader size="sm" color="black" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Transaction
              </>
            )}
          </Button>
        </form>

        {/* Confirmation Modal */}
        {showConfirm && pendingData && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-primary rounded-2xl p-6 w-full max-w-sm mx-2">
              <h4 className="text-lg font-semibold mb-4 heading-color">
                Confirm Transaction
              </h4>
              <div className="mb-4 space-y-2 text-color">
                <div>
                  Network: <b>{pendingData.network}</b>
                </div>
                <div>
                  To: <b>{pendingData.toAddress}</b>
                </div>
                <div>
                  Amount:{" "}
                  <b>
                    {pendingData.amount}{" "}
                    {pendingData.network === "ethereum" ? "ETH" : "SOL"}
                  </b>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="teal"
                  className="flex-1"
                  onClick={async () => {
                    setShowConfirm(false);
                    // await onSendTransaction(pendingData);
                    setShowSuccess(true);
                    setTimeout(() => {
                      setShowSuccess(false);
                      setPendingData(null);
                      setValue("toAddress", "");
                      setValue("amount", "");
                    }, 2000);
                  }}
                  // disabled={sending}
                >
                  {false ? <Loader size="sm" /> : "Confirm & Send"}
                </Button>
                <Button
                  variant="zinc"
                  className="flex-1"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-primary rounded-2xl p-6 w-full max-w-xs mx-2 text-center">
              <h4 className="text-lg font-semibold mb-2 heading-color">
                Success!
              </h4>
              <p className="text-color mb-2">Transaction sent successfully.</p>
              <Button
                variant="teal"
                className="w-full"
                onClick={() => setShowSuccess(false)}
              >
                OK
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendTab;
