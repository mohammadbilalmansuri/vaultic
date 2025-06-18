"use client";
import { ButtonHTMLAttributes, SVGProps } from "react";
import cn from "@/utils/cn";
import { Eye, EyeSlash } from "./icons";

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
  return (
    <button
      type="button"
      className={cn(
        "icon-btn",
        { "flex items-center gap-2": !!labels },
        className
      )}
      {...restProps}
    >
      <Icon {...iconProps} />
      {labels && (
        <span className="leading-none">
          {isVisible ? labels.hide : labels.show}
        </span>
      )}
    </button>
  );
};

export default EyeToggle;
