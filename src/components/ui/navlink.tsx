"use client";
import { ReactNode } from "react";
import Link, { LinkProps } from "next/link";
import cn from "@/utils/cn";

interface NavLinkProps extends LinkProps {
  children: ReactNode;
  active: boolean;
}

const NavLink = ({ children, href, active, ...rest }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "leading-none hover:heading-color transition-all duration-200",
        {
          "pointer-events-none heading-color": active,
        }
      )}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default NavLink;
