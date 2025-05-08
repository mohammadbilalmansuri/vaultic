"use client";
import { ButtonHTMLAttributes } from "react";
import { Clipboard, ClipboardTick } from "@/components/ui/icons";
import cn from "@/utils/cn";

interface CopyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  copied: boolean;
}

const Copy = ({ copied, className = "", ...props }: CopyProps) => {
  return (
    <button
      type="button"
      className={cn("hover-icon", { "pointer-events-none": copied }, className)}
      {...props}
    >
      {copied ? <ClipboardTick /> : <Clipboard />}
    </button>
  );
};

export default Copy;
