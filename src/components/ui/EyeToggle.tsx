"use client";
import { ButtonHTMLAttributes, SVGProps } from "react";
import cn from "@/utils/cn";
import { Eye, EyeSlash } from "../icons";

interface EyeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isVisible: boolean;
  labels?: { show: string; hide: string };
  iconProps?: SVGProps<SVGSVGElement>;
}

const EyeToggle = ({
  isVisible,
  labels,
  className = "",
  iconProps,
  ...restProps
}: EyeToggleProps) => {
  const Icon = isVisible ? EyeSlash : Eye;
  const ariaLabel = labels
    ? isVisible
      ? labels.hide
      : labels.show
    : isVisible
    ? "Hide"
    : "Show";

  return (
    <button
      type="button"
      className={cn(
        "icon-btn",
        { "flex items-center xxs:gap-2 gap-1.5": !!labels },
        className
      )}
      aria-label={ariaLabel}
      aria-pressed={isVisible}
      {...restProps}
    >
      <Icon {...iconProps} />
      {labels && (
        <span className="leading-none text-left">
          {isVisible ? labels.hide : labels.show}
        </span>
      )}
    </button>
  );
};

export default EyeToggle;
