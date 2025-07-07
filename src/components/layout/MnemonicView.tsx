"use client";
import { useState } from "react";
import cn from "@/utils/cn";
import { useClipboard } from "@/hooks";
import { CopyToggle, EyeToggle } from "../ui/";

interface MnemonicViewProps {
  mnemonic: string;
  widthClassName?: string;
}

const MnemonicView = ({
  mnemonic,
  widthClassName = "w-full",
}: MnemonicViewProps) => {
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
      <div className="w-full flex items-center justify-between gap-3 xs:px-0.5">
        <EyeToggle
          isVisible={visible}
          onClick={() => setVisible((prev) => !prev)}
          labels={{ show: "Show Phrase", hide: "Hide Phrase" }}
          className="xxs:text-base text-15 shrink-0"
        />
        <CopyToggle
          hasCopied={copied}
          onClick={() => copyToClipboard(mnemonic, copied, setCopied)}
          labels={{ copy: "Copy Phrase", copied: "Copied!" }}
          className="xxs:text-base text-15 shrink-0"
        />
      </div>
      <div className="w-full grid gap-2 xxs:grid-cols-3 grid-cols-2">
        {mnemonic.split(" ").map((word, index) => (
          <div key={`word-${index}`} className="mnemonic-word-input">
            <span className="opacity-50 select-none">{index + 1}.</span>
            <span className={cn({ "select-none": !visible })}>
              {visible ? word : Array(word.length).fill("•").join("")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MnemonicView;
