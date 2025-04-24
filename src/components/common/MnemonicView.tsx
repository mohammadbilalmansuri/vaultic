import { useState } from "react";
import { Copy, Hide } from "@/components/ui/icons";
import { useClipboard } from "@/hooks";
import useUserStore from "@/stores/userStore";
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
  const mnemonic = useUserStore((state) => state.mnemonic);
  const copyToClipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <div
      className={cn("relative bg-1 rounded-2xl flex flex-col", widthClassName)}
    >
      <div className="w-full border-color border-b-[1.5px] flex items-center justify-between py-3 px-4">
        <p className="leading-none">{lable}</p>
        <div className="flex items-center gap-4">
          <Hide hidden={hidden} onClick={() => setHidden((prev) => !prev)} />
          <Copy
            copied={copied}
            onClick={() => copyToClipboard(mnemonic, copied, setCopied)}
          />
        </div>
      </div>

      <div
        className={cn("w-full grid gap-4 cursor-pointer p-4", {
          "grid-cols-3": cols === 3,
          "grid-cols-4": cols === 4,
          "grid-cols-6": cols === 6,
        })}
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
};

export default MnemonicView;
