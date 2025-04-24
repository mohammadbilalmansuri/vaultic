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
      type="button"
      className="p-1 rounded-full h-6 w-12 relative flex items-center transition-colors duration-300 bg-1"
      {...props}
    >
      <span
        className={cn(
          "size-4 block rounded-full transition-transform duration-300",
          {
            "translate-x-6": state,
            "translate-x-0": !state,
            "bg-teal-500":
              !colorDependsOnState || (colorDependsOnState && state),
            "bg-zinc-500 dark:bg-zinc-400": colorDependsOnState && !state,
          }
        )}
      />
    </button>
  );
};

export default Switch;
