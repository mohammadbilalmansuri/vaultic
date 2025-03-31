import { ReactNode } from "react";
import Link, { LinkProps } from "next/link";
import cn from "@/utils/cn";

interface NavLinkProps extends LinkProps {
  children: ReactNode;
  active: boolean;
}

const NavLink = ({ children, href, active, ...props }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "leading-none hover:heading-color transition-all duration-400",
        {
          "pointer-events-none heading-color": active,
        }
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
