"use client";
import { ButtonHTMLAttributes } from "react";
import { Eye, EyeSlash } from "@/components/ui/icons";

interface HideProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hidden: boolean;
}

const Hide = ({ hidden, ...props }: HideProps) => {
  return (
    <button type="button" className="hover-icon" {...props}>
      {hidden ? <Eye /> : <EyeSlash />}
    </button>
  );
};

export default Hide;
