"use client";
import { ButtonHTMLAttributes } from "react";
import cn from "@/utils/cn";

interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  state: boolean;
}

const Switch = ({ state, ...props }: SwitchProps) => {
  return (
    <button
      type="button"
      className="p-1 rounded-full h-6 w-12 relative flex items-center bg-secondary"
      {...props}
    >
      <span
        className={cn(
          "size-4 block rounded-full transition-transform duration-300",
          {
            "translate-x-6 bg-teal-500": state,
            "translate-x-0 bg-zinc-500 dark:bg-zinc-400": !state,
          }
        )}
      />
    </button>
  );
};

export default Switch;
