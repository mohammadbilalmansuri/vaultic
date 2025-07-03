"use client";
import { ReactNode, HTMLAttributeAnchorTarget } from "react";
import Link, { LinkProps } from "next/link";
import cn from "@/utils/cn";

interface NavLinkProps extends LinkProps {
  children: ReactNode;
  active: boolean;
  target?: HTMLAttributeAnchorTarget;
}

const NavLink = ({ children, href, active, ...props }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "leading-none sm:min-h-10 min-h-9 px-3 py-2.5 rounded-xl flex items-center justify-center transition-all duration-300",
        {
          "bg-primary heading-color cursor-default pointer-events-none": active,
          "bg-transparent hover:heading-color hover:bg-primary": !active,
        }
      )}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
