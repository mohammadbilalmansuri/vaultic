"use client";
import { ButtonHTMLAttributes } from "react";
import { Eye, EyeSlash } from "@/components/ui/icons";
import cn from "@/utils/cn";

interface HideProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hidden: boolean;
}

const Hide = ({ hidden, className = "", ...props }: HideProps) => {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={cn("hover-icon", className)}
      {...props}
    >
      {hidden ? <Eye /> : <EyeSlash />}
    </button>
  );
};

export default Hide;
