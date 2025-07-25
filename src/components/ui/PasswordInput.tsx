"use client";
import { useState } from "react";
import type { InputHTMLAttributes, Ref } from "react";
import cn from "@/utils/cn";
import EyeToggle from "./EyeToggle";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref: Ref<HTMLInputElement>;
}

const PasswordInput = ({
  placeholder = "Password",
  className = "",
  ref,
  ...props
}: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full relative flex flex-col items-center justify-center">
      <input
        type={visible ? "text" : "password"}
        className={cn("input pr-10", className)}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />

      <EyeToggle
        isVisible={visible}
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3.5"
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      />
    </div>
  );
};

export default PasswordInput;
