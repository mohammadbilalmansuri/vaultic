"use client";
import { ButtonHTMLAttributes, SVGProps } from "react";
import { Copy, CopyCheck } from "./icons";
import cn from "@/utils/cn";

interface CopyToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hasCopied: boolean;
  labels?: { copy: string; copied: string };
  iconProps?: SVGProps<SVGSVGElement>;
}

const CopyToggle = ({
  hasCopied,
  labels,
  className = "",
  iconProps,
  ...props
}: CopyToggleProps) => {
  return (
    <button
      type="button"
      className={cn(
        "icon-btn",
        {
          "pointer-events-none heading-color": hasCopied,
          "flex items-center gap-2": !!labels,
        },
        className
      )}
      {...props}
    >
      {hasCopied ? <CopyCheck {...iconProps} /> : <Copy {...iconProps} />}
      {labels && (
        <span className="leading-none">
          {hasCopied ? labels.copied : labels.copy}
        </span>
      )}
    </button>
  );
};

export default CopyToggle;
