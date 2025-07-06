"use client";
import { ButtonHTMLAttributes, SVGProps } from "react";
import cn from "@/utils/cn";
import { Copy, CopyCheck } from "./icons";

interface CopyToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hasCopied: boolean;
  labels?: { copy: string; copied: string };
  iconProps?: SVGProps<SVGSVGElement>;
}

const CopyToggle = ({
  hasCopied,
  labels,
  className = "",
  iconProps: { className: iconClassName = "w-4.5", ...iconProps } = {},
  ...props
}: CopyToggleProps) => {
  const Icon = hasCopied ? CopyCheck : Copy;
  const ariaLabel = labels
    ? hasCopied
      ? labels.copied
      : labels.copy
    : hasCopied
    ? "Copied"
    : "Copy";

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
      aria-label={ariaLabel}
      aria-pressed={hasCopied}
      {...props}
    >
      <Icon className={cn(iconClassName)} {...iconProps} />
      {labels && (
        <span className="leading-none text-left">
          {hasCopied ? labels.copied : labels.copy}
        </span>
      )}
    </button>
  );
};

export default CopyToggle;
