"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { TTabs } from "@/types";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useMounted } from "@/hooks";

interface TabsProps {
  tabs: TTabs;
  delay?: { header: number; content: number };
}

const Tabs = ({ tabs, delay }: TabsProps) => {
  const hasMounted = useMounted();
  const tabKeys = Object.keys(tabs);

  if (tabKeys.length === 0) return null;

  const [activeTab, setActiveTab] = useState(tabKeys[0]);
  const activeIndex = tabKeys.indexOf(activeTab);
  const ActiveTabContent = tabs[activeTab]?.content;

  if (!ActiveTabContent) return null;

  return (
    <div className="w-full relative flex flex-col items-center gap-8">
      <motion.div
        className="w-full relative bg-primary rounded-2xl h-14 flex items-center"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${tabKeys.length}, 1fr)`,
        }}
        {...fadeUpAnimation({ delay: delay?.header })}
      >
        <motion.div
          key={`tab-indicator-${activeTab}`}
          className="absolute bg-secondary rounded-xl h-[calc(100%-10px)]"
          style={{
            left: `calc(${activeIndex} * ${100 / tabKeys.length}% + 5px)`,
            width: `calc(${100 / tabKeys.length}% - 10px)`,
          }}
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {tabKeys.map((label) => {
          const Icon = tabs[label]?.icon;
          return (
            <button
              key={label}
              type="button"
              className={cn(
                "h-full px-3 transition-all duration-300 relative z-10 flex items-center justify-center gap-2 group",
                {
                  "heading-color cursor-default pointer-events-none":
                    activeTab === label,
                  "hover:heading-color": activeTab !== label,
                }
              )}
              onClick={() => setActiveTab(label)}
            >
              {Icon && (
                <Icon
                  className={cn("w-5 transition-all duration-300", {
                    "group-hover:scale-110": activeTab !== label,
                    "scale-110": activeTab === label,
                  })}
                />
              )}
              <span className="font-medium mt-px">{label}</span>
            </button>
          );
        })}
      </motion.div>

      <div className="w-full relative px-4 flex flex-col items-center">
        <ActiveTabContent delay={delay?.content} hasMounted={hasMounted} />
      </div>
    </div>
  );
};

export default Tabs;
