"use client";
import { ButtonHTMLAttributes } from "react";
import cn from "@/utils/cn";

interface CopyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  copied: boolean;
}

const Copy = ({ copied, className = "", ...props }: CopyProps) => {
  return (
    <button
      type="button"
      className={cn(
        "icon-stroke w-5",
        { "pointer-events-none": copied },
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
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
    </button>
  );
};

export default Copy;
