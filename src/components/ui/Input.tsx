"use client";
import { ComponentProps, Ref } from "react";
import cn from "@/utils/cn";

interface InputProps extends ComponentProps<"input"> {
  ref: Ref<HTMLInputElement>;
}

const Input = ({
  type = "text",
  className = "",
  ref,
  ...props
}: InputProps) => {
  return (
    <input
      type={type}
      className={cn("input", className)}
      ref={ref}
      {...props}
    />
  );
};

export default Input;
