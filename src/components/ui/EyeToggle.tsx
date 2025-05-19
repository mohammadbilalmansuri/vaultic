"use client";
import React, { ButtonHTMLAttributes, SVGProps } from "react";
import { Eye, EyeSlash } from "@/components/ui/icons";
import cn from "@/utils/cn";

interface EyeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  visible: boolean;
  label?: {
    show: string;
    hide: string;
  };
  iconProps?: SVGProps<SVGSVGElement>;
}

const EyeToggle = ({
  visible,
  label,
  className = "",
  iconProps,
  ...props
}: EyeToggleProps) => {
  return (
    <button
      type="button"
      className={cn(
        "icon-btn",
        { "flex items-center gap-2": !!label },
        className
      )}
      {...props}
    >
      {visible ? <EyeSlash {...iconProps} /> : <Eye {...iconProps} />}
      {label && (
        <span className="leading-none">
          {visible ? label.hide : label.show}
        </span>
      )}
    </button>
  );
};

export default EyeToggle;
