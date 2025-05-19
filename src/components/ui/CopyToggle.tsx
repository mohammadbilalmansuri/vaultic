"use client";
import { ButtonHTMLAttributes, SVGProps } from "react";
import { Copy, CopyCheck } from "@/components/ui/icons";
import cn from "@/utils/cn";

interface CopyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  copied: boolean;
  svgProps?: SVGProps<SVGSVGElement>;
}

const CopyToggle = ({
  copied,
  className = "",
  svgProps,
  ...props
}: CopyProps) => {
  return (
    <button
      type="button"
      className={cn("icon-btn", { "pointer-events-none": copied }, className)}
      {...props}
    >
      {copied ? <CopyCheck {...svgProps} /> : <Copy {...svgProps} />}
    </button>
  );
};

export default CopyToggle;
