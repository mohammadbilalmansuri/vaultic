"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useWalletStore } from "@/stores";
import { expandCollapseAnimation } from "@/utils/animations";
import { useOutsideClick } from "@/hooks";
import { ThemeSwitcher, NavLink, MenuToggler } from "../ui";
import { Logo, Github } from "../ui/icons";

const Header = () => {
  const pathname = usePathname();
  const walletExists = useWalletStore((state) => state.walletExists);

  const navLinks = [
    walletExists
      ? { href: "/dashboard", label: "Dashboard" }
      : { href: "/setup", label: "Set Up Your Wallet" },
    { href: "/faucet", label: "Faucet" },
    { href: "/help-and-support", label: "Help & Support" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => isMenuOpen && setIsMenuOpen(false);
  const menuOutsideClickRef = useOutsideClick(closeMenu, isMenuOpen);

  return (
    <header className="w-full relative flex flex-col items-center sm:px-5 px-4 min-h-fit">
      <div className="w-full max-w-screen-lg relative flex items-center justify-between gap-5 sm:py-5 py-4">
        <Link
          href={walletExists ? "/dashboard" : "/"}
          className="flex items-center sm:gap-2.5 gap-2 select-none"
          aria-label="Vaultic home"
        >
          <Logo className="sm:w-7 w-6 text-teal-500" />
          <span className="-mt-0.5 sm:text-3xl text-26 lowercase leading-none font-bold text-teal-500">
            vaultic
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center lg:gap-6 gap-4"
          aria-label="Header navigation"
        >
          {navLinks.map(({ href, label }) => (
            <NavLink key={href} href={href} active={pathname === href}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center xs:gap-3 gap-2">
          <Link
            href="https://github.com/mohammadbilalmansuri/vaultic"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn-bg"
            aria-label="View Vaultic source code on GitHub"
          >
            <Github />
          </Link>

          <ThemeSwitcher />

          <div
            ref={menuOutsideClickRef}
            aria-label="Header mobile navigation menu"
            className="md:hidden flex flex-col items-end"
          >
            <MenuToggler
              isOpen={isMenuOpen}
              onClick={toggleMenu}
              className="md:hidden"
            />
            <AnimatePresence initial={false}>
              {isMenuOpen && (
                <motion.div
                  id="header-mobile-nav-menu-dropdown"
                  aria-label="Header mobile navigation menu dropdown"
                  className="md:hidden absolute z-50 top-full sm:-mt-4 -mt-3 bg-default border border-color rounded-2xl overflow-hidden shadow-xl"
                  {...expandCollapseAnimation({
                    duration: 0.15,
                    ease: "easeOut",
                  })}
                >
                  <nav className="w-full bg-input flex flex-col items-start gap-2 p-2.5">
                    {navLinks.map(({ href, label }) => (
                      <NavLink
                        key={href}
                        href={href}
                        active={pathname === href}
                        className="w-full"
                        onClick={closeMenu}
                      >
                        {label}
                      </NavLink>
                    ))}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
