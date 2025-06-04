"use client";
import { HTMLAttributeAnchorTarget } from "react";
import Link, { LinkProps } from "next/link";
import { TIcon } from "@/types";
import cn from "@/utils/cn";

interface SidebarNavLinkProps extends LinkProps {
  name: string;
  href: string;
  icon: TIcon;
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
          "bg-primary heading-color cursor-default pointer-events-none":
            isActive,
          "hover:bg-primary hover:heading-color": !isActive,
        }
      )}
      {...props}
    >
      <Icon
        className={cn("w-5.5 transition-all duration-300", {
          "text-teal-500 scale-110": isActive,
          "group-hover:scale-110": !isActive,
        })}
      />
      <span className="font-medium mt-px">{name}</span>
    </Link>
  );
};

export default SidebarNavLink;
