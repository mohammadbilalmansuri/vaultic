"use client";
import { SVGProps } from "react";
import cn from "@/utils/cn";

interface CopyProps extends SVGProps<SVGSVGElement> {
  copied: boolean;
}

const Copy = ({ copied, className = "", ...props }: CopyProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      className={cn(
        "transition-all duration-300 stroke-zinc-600 dark:stroke-zinc-400 hover:stroke-zinc-800 dark:hover:stroke-zinc-200",
        {
          "pointer-events-none": copied,
        },
        className
      )}
      {...props}
    >
      {copied ? (
        <>
          <path d="M9.31 14.7L10.81 16.2L14.81 12.2" />
          <path d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z" />
          <path d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002" />
        </>
      ) : (
        <>
          <path d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z" />
          <path d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002" />
        </>
      )}
    </svg>
  );
};

export default Copy;
