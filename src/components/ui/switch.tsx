"use client";
import { ButtonHTMLAttributes } from "react";
import cn from "@/utils/cn";

interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  state: boolean;
  colorDependsOnState?: boolean;
}

const Switch = ({
  state,
  colorDependsOnState = true,
  ...props
}: SwitchProps) => {
  return (
    <button
      className="p-1 bg-zinc-200 dark:bg-zinc-800 rounded-full h-6 w-12 relative flex items-center transition-colors duration-200"
      {...props}
    >
      <span
        className={cn(
          "size-4 block rounded-full transition-transform duration-200 ease-in-out transform",
          {
            "translate-x-6": state,
            "translate-x-0": !state,
            "bg-teal-500":
              !colorDependsOnState || (colorDependsOnState && state),
            "bg-zinc-500 dark:bg-zinc-400": colorDependsOnState && !state,
          }
        )}
      ></span>
    </button>
  );
};

export default Switch;
