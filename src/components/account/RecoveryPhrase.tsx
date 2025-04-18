"use client";
import { useState } from "react";
import { Copy, Hide } from "@/components/ui/icons";
import { useClipboard } from "@/hooks";
import useUserStore from "@/stores/userStore";
import cn from "@/utils/cn";

export default function RecoveryPhrase() {
  const mnemonic = useUserStore((state) => state.mnemonic);
  const copyToClipboard = useClipboard();

  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <div className="w-full relative bg-zinc-200/60 dark:bg-zinc-800/50 rounded-xl flex flex-col overflow-hidden">
      <div className="bg-zinc-200 dark:bg-zinc-800 flex items-center justify-between py-3 px-4 rounded-xl">
        <p className="leading-none">Save these words in a safe place.</p>
        <div className="flex items-center gap-4">
          <Hide hidden={hidden} onClick={() => setHidden((prev) => !prev)} />
          <Copy
            copied={copied}
            onClick={() => copyToClipboard(mnemonic, copied, setCopied)}
          />
        </div>
      </div>

      <div
        className="w-full grid grid-cols-2 xs:grid-cols-3 gap-4 cursor-pointer p-4"
        onClick={() => copyToClipboard(mnemonic, copied, setCopied)}
      >
        {mnemonic.split(" ").map((word, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="opacity-80">{index + 1}.</span>
            <span
              className={cn("lowercase heading-color", {
                "tracking-[0.2em]": hidden,
              })}
            >
              {hidden ? Array(word.length).fill("•").join("") : word}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
