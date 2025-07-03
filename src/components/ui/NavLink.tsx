"use client";
import { ReactNode, HTMLAttributeAnchorTarget } from "react";
import Link, { LinkProps } from "next/link";
import cn from "@/utils/cn";

interface NavLinkProps extends LinkProps {
  children: ReactNode;
  active: boolean;
  target?: HTMLAttributeAnchorTarget;
  className?: string;
}

const NavLink = ({
  children,
  href,
  active,
  className = "",
  ...props
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "leading-none sm:min-h-10 min-h-8 sm:px-3 px-2.5 py-2.5 rounded-xl flex items-center justify-center transition-all duration-300",
        {
          "bg-primary heading-color cursor-default pointer-events-none": active,
          "bg-transparent hover:heading-color hover:bg-primary": !active,
        },
        className
      )}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
