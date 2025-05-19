"use client";
import { ComponentProps, Ref, useState } from "react";
import { EyeToggle } from "@/components/ui";
import cn from "@/utils/cn";

interface PasswordInputProps extends ComponentProps<"input"> {
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
      />
    </div>
  );
};

export default PasswordInput;
