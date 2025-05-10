"use client";
import { ComponentProps, Ref, useState } from "react";
import { Hide } from "@/components/ui";
import cn from "@/utils/cn";

interface PasswordInputProps extends ComponentProps<"input"> {
  ref: Ref<HTMLInputElement>;
}

const PasswordInput = ({
  placeholder = "Enter password",
  className = "",
  ref,
  ...props
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full relative flex flex-col items-center justify-center">
      <input
        type={show ? "text" : "password"}
        className={cn("input pr-10", className)}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />

      <Hide
        hidden={!show}
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3.5"
      />
    </div>
  );
};

export default PasswordInput;
