"use client";
import { ButtonHTMLAttributes } from "react";
import cn from "@/utils/cn";

interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md";
  state: boolean;
}

const Switch = ({
  size = "md",
  state,
  className = "",
  ...props
}: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={state}
      className={cn(
        "shrink-0 relative p-1 rounded-full flex items-center bg-secondary",
        { "h-5 w-9": size === "sm", "h-6 w-12": size === "md" },
        className
      )}
      {...props}
    >
      <span
        className={cn("block rounded-full transition-transform duration-200", {
          "size-3": size === "sm",
          "size-4": size === "md",
          "translate-x-4": size === "sm" && state,
          "translate-x-6": size === "md" && state,
          "bg-teal-500": state,
          "translate-x-0 bg-zinc-500 dark:bg-zinc-400": !state,
        })}
      />
    </button>
  );
};

export default Switch;
