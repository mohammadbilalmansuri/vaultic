import { JSX, ButtonHTMLAttributes } from "react";
import cn from "@/utils/cn";

interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  state: boolean;
}

export default function Switch({ state, ...props }: SwitchProps): JSX.Element {
  return (
    <button
      className="p-1 dark:bg-zinc-800 bg-zinc-200 rounded-full h-6 w-12 relative flex items-center transition-colors duration-200"
      {...props}
    >
      <span
        className={cn(
          "size-4 block bg-teal-500 rounded-full transition-transform duration-200 ease-in-out transform",
          {
            "translate-x-6": state,
            "translate-x-0": !state,
          }
        )}
      ></span>
    </button>
  );
}
