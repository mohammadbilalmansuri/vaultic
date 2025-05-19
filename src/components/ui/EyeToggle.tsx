"use client";
import { ButtonHTMLAttributes, SVGProps } from "react";
import { Eye, EyeSlash } from "@/components/ui/icons";
import cn from "@/utils/cn";

interface EyeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hidden: boolean;
  svgProps?: SVGProps<SVGSVGElement>;
}

const EyeToggle = ({
  hidden,
  className = "",
  svgProps,
  ...props
}: EyeToggleProps) => {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={cn("icon-btn", className)}
      {...props}
    >
      {hidden ? <Eye {...svgProps} /> : <EyeSlash {...svgProps} />}
    </button>
  );
};

export default EyeToggle;
