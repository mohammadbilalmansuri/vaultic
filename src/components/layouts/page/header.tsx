"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { HEADER_NAV_LINKS } from "@/constants";
import { useWalletExists } from "@/stores";
import { expandCollapseAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useOutsideClick } from "@/hooks";
import { Logo, Github, Cancel, AlignRight } from "@/components/icons";
import { ThemeSwitcher, NavLink, Tooltip } from "@/components/ui";

const Header = () => {
  const pathname = usePathname();
  const walletExists = useWalletExists();
  const navLinks = HEADER_NAV_LINKS(walletExists);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => {
    if (isMenuOpen) setIsMenuOpen(false);
  };
  const menuOutsideClickRef = useOutsideClick<HTMLDivElement>(
    closeMenu,
    isMenuOpen
  );

  return (
    <header className="w-full relative flex flex-col items-center min-h-fit md:px-5 px-4 md:py-4 py-3">
      <div className="w-full max-w-screen-lg relative flex items-center justify-between gap-4">
        <Link
          href={walletExists ? "/dashboard" : "/"}
          className="flex items-center md:gap-2.5 gap-2 select-none"
        >
          <Logo className="w-6 text-teal-500" />
          <span className="-mt-0.5 md:text-3xl text-h2 lowercase leading-[0.8] font-bold text-teal-500">
            vaultic
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center lg:gap-6 gap-4"
          aria-label="Header navigation"
        >
          {navLinks.map(({ href, label }, index) => (
            <NavLink
              key={`link-${index}`}
              href={href}
              active={pathname === href}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center xs:gap-3 gap-2 -mr-1">
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
            <Tooltip
              content={isMenuOpen ? "Close Menu" : "Open Menu"}
              position="left"
              containerClassName="md:hidden"
            >
              <button
                aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                aria-expanded={isMenuOpen}
                className={cn("icon-btn-bg", { "bg-secondary": isMenuOpen })}
                onClick={toggleMenu}
              >
                {isMenuOpen ? <Cancel /> : <AlignRight className="w-7" />}
              </button>
            </Tooltip>

            <AnimatePresence initial={false}>
              {isMenuOpen && (
                <motion.div
                  id="header-mobile-nav-menu-dropdown"
                  aria-label="Header mobile navigation menu dropdown"
                  className="md:hidden absolute z-50 top-full mt-2 bg-default border rounded-2xl overflow-hidden shadow-xl"
                  {...expandCollapseAnimation({
                    duration: 0.15,
                    ease: "easeOut",
                  })}
                >
                  <nav className="w-full bg-input flex flex-col items-start gap-2 p-2.5">
                    {navLinks.map(({ href, label }, index) => (
                      <NavLink
                        key={`menu-link-${index}`}
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
