"use client";
import { SVGProps, JSX, HTMLAttributeAnchorTarget } from "react";
import { LinkProps } from "next/link";
import Link from "next/link";
import cn from "@/utils/cn";

interface SidebarNavLinkProps extends LinkProps {
  name: string;
  href: string;
  icon: ({ ...props }: SVGProps<SVGSVGElement>) => JSX.Element;
  isActive: boolean;
  target?: HTMLAttributeAnchorTarget;
}

const SidebarNavLink = ({
  name,
  href,
  icon: Icon,
  isActive,
  ...props
}: SidebarNavLinkProps) => {
  return (
    <Link
      key={name}
      href={href}
      className={cn(
        "transition-all duration-300 px-4 py-3 h-12 rounded-2xl flex items-center gap-3 group",
        {
          "bg-primary heading-color": isActive,
          "hover:bg-primary hover:heading-color": !isActive,
        }
      )}
      {...props}
    >
      <Icon
        className={cn(
          "w-5.5 transition-all duration-300",
          isActive ? "text-teal-500 scale-110" : "group-hover:scale-110"
        )}
      />
      <span className="font-medium">{name}</span>
    </Link>
  );
};

export default SidebarNavLink;
