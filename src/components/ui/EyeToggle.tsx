"use client";
import { ButtonHTMLAttributes } from "react";
import { Eye, EyeSlash } from "@/components/ui/icons";
import cn from "@/utils/cn";

interface EyeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hidden: boolean;
}

const EyeToggle = ({ hidden, className = "", ...props }: EyeToggleProps) => {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={cn("icon-btn", className)}
      {...props}
    >
      {hidden ? <Eye /> : <EyeSlash />}
    </button>
  );
};

export default EyeToggle;
