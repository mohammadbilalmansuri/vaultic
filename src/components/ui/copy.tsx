"use client";
import { ButtonHTMLAttributes } from "react";
import cn from "@/utils/cn";

interface CopyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  copied: boolean;
  withText?: boolean;
  lable?: string;
}

const Copy = ({
  copied,
  withText = false,
  lable = "Copy to clipboard",
  ...props
}: CopyProps) => {
  return (
    <button
      className="flex items-center gap-2"
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      title={copied ? "Copied" : "Copy to clipboard"}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
        className={cn("size-5", {
          "stroke-zinc-600 dark:stroke-zinc-400": !copied,
          "stroke-teal-500": copied,
        })}
      >
        {copied ? (
          <>
            <path d="M22 11.1V6.9C22 3.4 20.6 2 17.1 2H12.9C9.4 2 8 3.4 8 6.9V8H11.1C14.6 8 16 9.4 16 12.9V16H17.1C20.6 16 22 14.6 22 11.1Z" />
            <path d="M16 17.1V12.9C16 9.4 14.6 8 11.1 8H6.9C3.4 8 2 9.4 2 12.9V17.1C2 20.6 3.4 22 6.9 22H11.1C14.6 22 16 20.6 16 17.1Z" />
            <path d="M6.08008 15L8.03008 16.95L11.9201 13.05" />
          </>
        ) : (
          <>
            <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" />
            <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z" />
          </>
        )}
      </svg>

      {withText && (
        <span className={cn({ "text-teal-500": copied })}>
          {copied ? "Copied" : lable}
        </span>
      )}
    </button>
  );
};

export default Copy;
