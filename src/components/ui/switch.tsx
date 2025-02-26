import { JSX, ButtonHTMLAttributes } from "react";
import cn from "@/utils/cn";

interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  state: boolean;
  isStateDependentColor?: boolean;
}

export default function Switch({
  state,
  isStateDependentColor = false,
  ...props
}: SwitchProps): JSX.Element {
  return (
    <button
      className="p-1 dark:bg-zinc-800 bg-zinc-200 rounded-full h-6 w-12 relative flex items-center transition-colors duration-200"
      {...props}
    >
      <span
        className={cn(
          "size-4 block rounded-full transition-transform duration-200 ease-in-out transform",
          {
            "translate-x-6": state,
            "translate-x-0": !state,
            "bg-teal-500":
              !isStateDependentColor || (isStateDependentColor && state),
            "bg-zinc-600 dark:bg-zinc-400": isStateDependentColor && !state,
          }
        )}
      ></span>
    </button>
  );
}
