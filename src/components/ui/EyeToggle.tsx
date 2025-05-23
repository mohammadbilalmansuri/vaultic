"use client";
import { ButtonHTMLAttributes, SVGProps } from "react";
import { Eye, EyeSlash } from "./icons";
import cn from "@/utils/cn";

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
  return (
    <button
      type="button"
      className={cn(
        "icon-btn",
        { "flex items-center gap-2 active:scale-100": !!labels },
        className
      )}
      {...restProps}
    >
      {isVisible ? <EyeSlash {...iconProps} /> : <Eye {...iconProps} />}
      {labels && (
        <span className="leading-none">
          {isVisible ? labels.hide : labels.show}
        </span>
      )}
    </button>
  );
};

export default EyeToggle;
