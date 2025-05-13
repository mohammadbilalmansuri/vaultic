"use client";
import { ButtonHTMLAttributes } from "react";
import { Copy, CopyCheck } from "@/components/ui/icons";
import cn from "@/utils/cn";

interface CopyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  copied: boolean;
}

const CopyToggle = ({ copied, className = "", ...props }: CopyProps) => {
  return (
    <button
      type="button"
      className={cn("hover-icon", { "pointer-events-none": copied }, className)}
      {...props}
    >
      {copied ? <CopyCheck /> : <Copy />}
    </button>
  );
};

export default CopyToggle;
