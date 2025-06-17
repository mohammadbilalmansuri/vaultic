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
  const tabKeys = Object.keys(tabs);
  if (tabKeys.length === 0) return null;

  const [activeTab, setActiveTab] = useState(tabKeys[0]);
  const activeIndex = tabKeys.indexOf(activeTab);
  const ActiveTabContent = tabs[activeTab].content;

  const hasMounted = useMounted(1000);

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
          className="absolute bg-secondary rounded-xl h-[calc(100%-10px)]"
          animate={{
            left: `calc(${activeIndex} * ${100 / tabKeys.length}% + 5px)`,
            width: `calc(${100 / tabKeys.length}% - 10px)`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {tabKeys.map((label) => {
          const Icon = tabs[label]?.icon;
          const isActive = activeTab === label;

          return (
            <button
              key={label}
              type="button"
              className={cn(
                "h-full px-3 transition-all duration-300 relative z-10 flex items-center justify-center gap-2 group",
                {
                  "heading-color cursor-default pointer-events-none": isActive,
                  "hover:heading-color": !isActive,
                }
              )}
              onClick={() => setActiveTab(label)}
            >
              {Icon && (
                <Icon
                  className={cn("w-5 transition-all duration-300", {
                    "group-hover:scale-110": !isActive,
                    "scale-110": isActive,
                  })}
                />
              )}
              <span className="font-medium mt-px">{label}</span>
            </button>
          );
        })}
      </motion.div>

      <div className="w-full relative px-4 flex flex-col items-center">
        <ActiveTabContent
          initialAnimationDelay={delay?.content}
          showInitialAnimation={!hasMounted}
        />
      </div>
    </div>
  );
};

export default Tabs;
