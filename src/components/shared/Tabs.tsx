"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { TabsData } from "@/types";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useMounted } from "@/hooks";
import { ArrowLeft, ArrowRight } from "../icons";

interface TabsProps {
  tabs: TabsData;
  delay?: { list: number; panel: number };
  containerClassName?: string;
  listClassName?: string;
  buttonClassName?: string;
  panelClassName?: string;
}

const SCROLL_AMOUNT = 150;

const Tabs = ({
  tabs,
  delay,
  containerClassName = "",
  listClassName = "",
  buttonClassName = "",
  panelClassName = "",
}: TabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { panel: ActiveTabPanel } = tabs[activeTabIndex];
  const hasMounted = useMounted(2000);

  const updateScrollButtons = () => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    tabRefs.current[activeTabIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeTabIndex]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    updateScrollButtons();

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(el);

    el.addEventListener("scroll", updateScrollButtons);

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("scroll", updateScrollButtons);
    };
  }, []);

  const handleScroll = (dir: "left" | "right") => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  if (!tabs.length) return null;

  return (
    <div
      className={cn(
        "w-full relative flex flex-col gap-6 items-center",
        containerClassName
      )}
    >
      <motion.div
        className="w-full bg-primary rounded-2xl flex items-center"
        {...fadeUpAnimation({ delay: delay?.list })}
      >
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="p-1 bg-secondary hover:heading-color transition-all duration-200 rounded-full absolute left-1 z-10"
            aria-label="Scroll left"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}

        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="p-1 bg-secondary hover:heading-color transition-all duration-200 rounded-full absolute right-1 z-10"
            aria-label="Scroll right"
          >
            <ArrowRight className="size-5" />
          </button>
        )}

        <div
          ref={listRef}
          role="tablist"
          aria-label="Tabs Navigation"
          className={cn(
            "w-full relative p-1.5 flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth rounded-2xl",
            {
              "mask-l-from-80%": canScrollLeft,
              "mask-r-from-80%": canScrollRight,
            },
            listClassName
          )}
        >
          {tabs.map(({ icon: Icon, label }, index) => {
            const isActive = activeTabIndex === index;
            return (
              <button
                key={index}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                id={`tab-${index}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${index}`}
                tabIndex={isActive ? -1 : 0}
                disabled={isActive}
                onClick={() => setActiveTabIndex(index)}
                className={cn(
                  "flex-1 relative shrink-0 px-4 py-3 flex items-center justify-center gap-2 rounded-xl transition-all duration-200 font-medium whitespace-nowrap",
                  isActive
                    ? "heading-color pointer-events-none"
                    : "hover:heading-color",
                  buttonClassName
                )}
              >
                {Icon && (
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                )}
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 z-[-1] bg-secondary rounded-xl shadow"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      <div
        role="tabpanel"
        id={`tabpanel-${activeTabIndex}`}
        aria-labelledby={`tab-${activeTabIndex}`}
        className={cn(
          "w-full relative md:px-2 px-1 flex flex-col items-center",
          panelClassName
        )}
      >
        <ActiveTabPanel
          initialAnimationDelay={delay?.panel}
          showInitialAnimation={!hasMounted}
        />
      </div>
    </div>
  );
};

export default Tabs;
