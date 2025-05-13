import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link, { LinkProps } from "next/link";
import cn from "@/utils/cn";

type ButtonVariant = "teal" | "zinc";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: "lg" | "sm";
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
  size = "lg",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const classes = cn(
    "font-medium transition-all duration-300 flex items-center justify-center rounded-2xl hover:rounded-3xl active:scale-95",
    {
      "text-zinc-800 bg-teal-500": variant === "teal",
      "heading-color bg-secondary": variant === "zinc",
      "h-13 px-5": size === "lg",
      "h-11 px-4": size === "sm",
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
