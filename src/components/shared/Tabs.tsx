"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { TabsData } from "@/types";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useMounted } from "@/hooks";

interface TabsProps {
  tabs: TabsData;
  delay?: { list: number; panel: number };
  containerClassName?: string;
  listClassName?: string;
  panelClassName?: string;
}

const Tabs = ({
  tabs,
  delay,
  containerClassName = "",
  listClassName = "",
  panelClassName = "",
}: TabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { panel: ActiveTabPanel } = tabs[activeTabIndex];
  const hasMounted = useMounted(2000);

  if (tabs.length === 0) return null;

  return (
    <div
      className={cn(
        "w-full relative flex flex-col items-center gap-7",
        containerClassName
      )}
    >
      <motion.div
        role="tablist"
        aria-label="Tabs Navigation"
        className={cn(
          "w-full relative bg-primary rounded-2xl p-1.5 grid items-center gap-1.5 overflow-x-auto scrollbar-hide",
          listClassName
        )}
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
        {...fadeUpAnimation({ delay: delay?.list })}
      >
        {tabs.map(({ icon: Icon, label }, index) => {
          const isActive = activeTabIndex === index;

          return (
            <button
              key={`tab-${index}`}
              type="button"
              role="tab"
              id={`tab-${index}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${index}`}
              className={cn(
                "col-span-1 min-w-fit relative z-10 p-3 flex items-center justify-center gap-1.5 rounded-xl transition-all duration-200 font-medium leading-none text-nowrap group",
                isActive
                  ? "heading-color bg-secondary shadow pointer-events-none"
                  : "hover:heading-color"
              )}
              onClick={() => setActiveTabIndex(index)}
              disabled={isActive}
            >
              {Icon && <Icon className="w-5 shrink-0" aria-hidden="true" />}
              <span>{label}</span>
            </button>
          );
        })}
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
