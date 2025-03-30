"use client";
import { forwardRef, useState, ComponentProps } from "react";
import { Hide } from ".";
import cn from "@/utils/cn";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  ComponentProps<"input">
>(({ placeholder = "Password", className = "", ...props }, ref) => {
  const [passwordInputType, setPasswordInputType] = useState<
    "password" | "text"
  >("password");

  return (
    <div className="w-full relative flex flex-col items-center justify-center">
      <input
        type={passwordInputType}
        placeholder={placeholder}
        className={cn("input pr-9", className)}
        ref={ref}
        {...props}
      />
      <Hide
        hidden={passwordInputType === "password"}
        className="absolute right-3 cursor-pointer"
        onClick={() =>
          setPasswordInputType((prev) =>
            prev === "password" ? "text" : "password"
          )
        }
      />
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
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

Input.displayName = "Input";
