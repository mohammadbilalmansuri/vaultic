"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useWalletStore } from "@/stores";
import { useOutsideClick } from "@/hooks";
import { ThemeSwitcher, NavLink } from "../ui";
import { Logo, Github, Menu, Cancel } from "../ui/icons";

const Header = () => {
  const pathname = usePathname();
  const walletExists = useWalletStore((state) => state.walletExists);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuOutsideClickRef = useOutsideClick(
    () => isMenuOpen && setIsMenuOpen(false),
    isMenuOpen
  );

  const navLinks = [
    walletExists
      ? { href: "/dashboard", label: "Dashboard" }
      : { href: "/setup", label: "Set Up Your Wallet" },
    { href: "/faucet", label: "Faucet" },
    { href: "/help-and-support", label: "Help & Support" },
  ];

  return (
    <header className="w-full relative flex flex-col items-center sm:px-5 px-4 min-h-fit">
      <div className="w-full max-w-screen-lg relative flex items-center justify-between gap-5 sm:py-5 py-4">
        <Link
          href={walletExists ? "/dashboard" : "/"}
          className="flex items-center sm:gap-2.5 gap-2 select-none"
          aria-label="Vaultic home"
        >
          <Logo className="sm:w-7 w-5.5 text-teal-500" />
          <span className="-mt-0.5 sm:text-3xl text-[26px] lowercase leading-none font-bold text-teal-500">
            vaultic
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              active={pathname === href}
              className="px-4 py-2 rounded-full transition-colors duration-200 hover:bg-input"
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center sm:gap-3 gap-2">
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
            aria-label="Mobile navigation menu"
            className="md:hidden relative flex flex-col items-end"
          >
            <button
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="icon-btn-bg md:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? <Cancel /> : <Menu className="w-6" />}
            </button>

            <AnimatePresence initial={false}>
              {isMenuOpen && (
                <motion.div
                  id="mobile-menu"
                  aria-label="Mobile navigation menu dropdown"
                  className="min-w-43.5 absolute top-full mt-1 z-50 md:hidden bg-default border border-color rounded-2xl overflow-hidden shadow-xl"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <nav className="w-full bg-input flex flex-col items-start gap-2 p-2.5">
                    {navLinks.map(({ href, label }) => (
                      <NavLink
                        key={href}
                        href={href}
                        active={pathname === href}
                        className="w-full"
                        onClick={() => setIsMenuOpen(false)}
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
