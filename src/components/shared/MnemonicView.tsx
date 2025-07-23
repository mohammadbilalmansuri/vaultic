"use client";
import { useState } from "react";
import cn from "@/utils/cn";
import { useClipboardStore } from "@/stores";
import { CopyToggle, EyeToggle } from "../ui";

interface MnemonicViewProps {
  mnemonic: string;
  containerClassName?: string;
}

const MNEMONIC_COPY_ID = "mnemonic-phrase";

const MnemonicView = ({
  mnemonic,
  containerClassName = "w-full",
}: MnemonicViewProps) => {
  const copyToClipboard = useClipboardStore((state) => state.copyToClipboard);
  const copiedId = useClipboardStore((state) => state.copiedId);
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-4",
        containerClassName
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
          hasCopied={copiedId === MNEMONIC_COPY_ID}
          onClick={() => copyToClipboard(mnemonic, MNEMONIC_COPY_ID)}
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
