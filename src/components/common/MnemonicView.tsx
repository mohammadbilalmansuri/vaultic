"use client";
import { useState } from "react";
import { CopyToggle, EyeToggle } from "@/components/ui";
import { useClipboard } from "@/hooks";
import { useWalletStore } from "@/stores";
import cn from "@/utils/cn";

interface MnemonicViewProps {
  lable?: string;
  cols?: 3 | 4 | 6;
  widthClassName?: string;
}

const MnemonicView = ({
  lable = "Your Recovery Phrase",
  cols = 3,
  widthClassName = "w-full",
}: MnemonicViewProps) => {
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const copyToClipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <div
      className={cn(
        "relative bg-primary rounded-2xl flex flex-col px-2",
        widthClassName
      )}
    >
      <div className="w-full border-color border-b-1.5 flex items-center justify-between py-3 px-2">
        <p className="leading-none">{lable}</p>
        <div className="flex items-center gap-4">
          <EyeToggle
            hidden={hidden}
            onClick={() => setHidden((prev) => !prev)}
          />
          <CopyToggle
            copied={copied}
            onClick={() => copyToClipboard(mnemonic, copied, setCopied)}
          />
        </div>
      </div>

      <div
        className={cn("w-full grid gap-4 cursor-pointer py-4 px-2", {
          "grid-cols-3": cols === 3,
          "grid-cols-4": cols === 4,
          "grid-cols-6": cols === 6,
        })}
        onClick={() => copyToClipboard(mnemonic, copied, setCopied)}
      >
        {mnemonic.split(" ").map((word, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="opacity-80">{index + 1}.</span>
            <span className="lowercase heading-color">
              {hidden ? Array(word.length).fill("•").join("") : word}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MnemonicView;
