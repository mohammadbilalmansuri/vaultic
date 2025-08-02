"use client";
import Link from "next/link";
import type { LinkProps } from "next/link";
import type {
  ReactNode,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";
import cn from "@/utils/cn";

type ButtonVariant = "teal" | "zinc" | "rose";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  };

type ButtonAsLink = ButtonBaseProps &
  LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "link";
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = ({
  as = "button",
  variant = "teal",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const classes = cn(
    "font-medium transition-all duration-200 flex items-center justify-center gap-2 rounded-2xl hover:rounded-5xl sm:h-13 h-12 py-4 sm:px-5 px-4",
    {
      "text-teal-950 bg-teal-500": variant === "teal",
      "text-primary bg-secondary": variant === "zinc",
      "text-rose-50 bg-rose-500": variant === "rose",
    },
    className
  );

  if (as === "link") {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link href={href} {...linkProps} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
};

export default Button;
