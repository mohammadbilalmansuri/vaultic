"use client";
import { useState } from "react";
import { motion } from "motion/react";
import type { TabsData } from "@/types";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useMounted } from "@/hooks";

interface TabsProps {
  tabs: TabsData;
  delay?: { list: number; panel: number };
}

const Tabs = ({ tabs, delay }: TabsProps) => {
  const tabKeys = Object.keys(tabs);
  if (tabKeys.length === 0) return null;

  const [activeTab, setActiveTab] = useState(tabKeys[0]);
  const activeIndex = tabKeys.indexOf(activeTab);
  const ActiveTabContent = tabs[activeTab].panel;

  const hasMounted = useMounted(2000);

  return (
    <div className="w-full relative flex flex-col items-center gap-7">
      <motion.div
        role="tablist"
        aria-label="Tabs Navigation"
        className="w-full relative bg-primary rounded-2xl p-1.5 grid gap-1.5 items-center overflow-x-auto scrollbar-hide"
        style={{ gridTemplateColumns: `repeat(${tabKeys.length}, 1fr)` }}
        {...fadeUpAnimation({ delay: delay?.list })}
      >
        {/* <motion.div
          className="absolute bg-secondary rounded-xl h-[calc(100%-10px)]"
          animate={{
            left: `calc(${activeIndex} * ${100 / tabKeys.length}% + 5px)`,
            width: `calc(${100 / tabKeys.length}% - 10px)`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          initial={false}
          aria-hidden="true"
        /> */}

        {tabKeys.map((label, index) => {
          const Icon = tabs[label]?.icon;
          const isActive = activeTab === label;

          return (
            <button
              key={`tab-${index}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${label}`}
              id={`tab-${label}`}
              className={cn(
                "min-w-fit p-3 relative z-10 rounded-xl transition-all duration-200",
                {
                  "flex items-center justify-center gap-2": !!Icon,
                  "bg-secondary heading-color pointer-events-none": isActive,
                  "hover:heading-color": !isActive,
                }
              )}
              onClick={() => setActiveTab(label)}
              tabIndex={isActive ? 0 : -1}
            >
              {Icon && <Icon className="w-5 shrink-0" aria-hidden="true" />}
              <span className="font-medium leading-none text-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </motion.div>

      <div
        className="w-full relative md:px-2 px-1 flex flex-col items-center"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        <ActiveTabContent
          initialAnimationDelay={delay?.panel}
          showInitialAnimation={!hasMounted}
        />
      </div>
    </div>
  );
};

export default Tabs;
