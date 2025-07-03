"use client";
import { ButtonHTMLAttributes } from "react";
import cn from "@/utils/cn";
import { Menu, Cancel } from "../ui/icons";

interface MenuTogglerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
}

const MenuToggler = ({
  isOpen,
  className = "",
  ...props
}: MenuTogglerProps) => {
  return (
    <button
      aria-label={isOpen ? "Close Menu" : "Open Menu"}
      aria-expanded={isOpen}
      className={cn("icon-btn-bg", className)}
      {...props}
    >
      {isOpen ? <Cancel /> : <Menu className="w-6" />}
    </button>
  );
};

export default MenuToggler;
