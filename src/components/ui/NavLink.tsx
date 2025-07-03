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
        "shrink-0 leading-none h-10 sm:px-3 px-2.5 rounded-xl flex items-center justify-center transition-all duration-300",
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
