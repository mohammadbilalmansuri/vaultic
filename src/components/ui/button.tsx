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
    "tracking-[0.01em] px-6 py-4 leading-none rounded-xl transition-all duration-200 border-1.5 relative hover:scale-[0.98] active:scale-100",
    variant === "secondary"
      ? "dark:bg-zinc-800 bg-zinc-200 text-zinc-900 dark:text-zinc-100 dark:border-zinc-700 border-zinc-300"
      : "bg-teal-500 text-zinc-900 dark:border-teal-300 border-teal-600",
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
