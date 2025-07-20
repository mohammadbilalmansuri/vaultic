"use client";
import Link from "next/link";
import type { ReactNode, HTMLAttributeAnchorTarget } from "react";
import type { LinkProps } from "next/link";
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
        "leading-none md:px-3 px-2.5 py-2.5 rounded-xl text-center transition-all duration-200",
        active
          ? "bg-secondary text-primary pointer-events-none"
          : "bg-transparent hover:text-primary hover:bg-secondary",
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
