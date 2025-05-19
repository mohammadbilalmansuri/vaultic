"use client";
import { useState } from "react";
import { EyeToggle, CopyToggle } from "@/components/ui";
import { useClipboard } from "@/hooks";
import { useWalletStore } from "@/stores";
import cn from "@/utils/cn";

interface MnemonicViewProps {
  lable?: string;
  cols?: 3 | 4 | 6;
  widthClassName?: string;
}

const MnemonicView = ({
  cols = 3,
  widthClassName = "w-full",
}: MnemonicViewProps) => {
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const copyToClipboard = useClipboard();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-4",
        widthClassName
      )}
    >
      <div className="w-full flex items-center justify-between gap-2 px-0.5">
        <EyeToggle
          isVisible={visible}
          onClick={() => setVisible((prev) => !prev)}
          labels={{ show: "Show Phrase", hide: "Hide Phrase" }}
        />
        <CopyToggle
          hasCopied={copied}
          onClick={() => copyToClipboard(mnemonic, copied, setCopied)}
          labels={{ copy: "Copy Phrase", copied: "Copied!" }}
        />
      </div>
      <div
        className={cn("w-full grid gap-2 transition-all", {
          "grid-cols-3": cols === 3,
          "grid-cols-4": cols === 4,
          "grid-cols-6": cols === 6,
          "blur-xs select-none": !visible,
        })}
      >
        {mnemonic.split(" ").map((word, index) => (
          <div
            key={index}
            className="flex items-center gap-1 heading-color lowercase w-full p-3.5 h-12 leading-none rounded-2xl bg-white dark:bg-zinc-950/30 border border-color"
          >
            <span className="opacity-50">{index + 1}.</span>
            <span>{word}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MnemonicView;
