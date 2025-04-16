"use client";
import { forwardRef, ComponentProps } from "react";
import cn from "@/utils/cn";

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ type = "text", placeholder, className = "", ...props }, ref) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        className={cn("input", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

export default Input;
Input.displayName = "Input";
