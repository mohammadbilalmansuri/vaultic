"use client";
import {
  JSX,
  ReactNode,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";
import Link, { LinkProps } from "next/link";
import cn from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  as?: "button" | "link";
  variant?: "teal" | "zinc";
  href?: LinkProps["href"];
  className?: string;
}

export default function Button({
  children,
  as = "button",
  type = "button",
  variant = "teal",
  href,
  className = "",
  ...props
}: ButtonProps): JSX.Element {
  const classes = cn(
    {
      "btn-teal": variant === "teal",
      "btn-zinc": variant === "zinc",
    },
    className
  );

  if (as === "link" && href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
