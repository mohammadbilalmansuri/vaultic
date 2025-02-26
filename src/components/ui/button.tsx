import {
  JSX,
  ReactNode,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";
import Link, { LinkProps } from "next/link";
import cn from "@/utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  as?: "button" | "link";
  variant?: "primary" | "secondary";
  href?: LinkProps["href"];
  className?: string;
}

export default function Button({
  children,
  as = "button",
  type = "button",
  variant = "primary",
  href,
  className = "",
  ...props
}: ButtonProps): JSX.Element {
  const classes = cn(
    "btn-base",
    {
      "btn-teal": variant === "primary",
      "btn-zinc": variant === "secondary",
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
