"use client";
import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TIcon } from "@/types";
import { fadeUpAnimation } from "@/utils/animations";
import cn from "@/utils/cn";
import { useMounted } from "@/hooks";

interface TabsProps {
  tabs: Record<string, { icon?: TIcon; content: ReactNode }>;
  delay?: { header: number; content: number };
}

const Tabs = ({ tabs, delay }: TabsProps) => {
  const tabKeys = Object.keys(tabs);
  const [activeTab, setActiveTab] = useState(tabKeys[0]);
  const activeIndex = tabKeys.indexOf(activeTab);
  const hasMounted = useMounted();

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
          style={{
            left: `calc(${activeIndex} * ${100 / tabKeys.length}% + 5px)`,
            width: `calc(${100 / tabKeys.length}% - 10px)`,
          }}
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {tabKeys.map((label) => {
          const Icon = tabs[label].icon;
          return (
            <button
              key={label}
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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          {...fadeUpAnimation({
            delay: !hasMounted ? delay?.content : undefined,
          })}
          className="w-full relative px-4 flex flex-col items-center"
        >
          {tabs[activeTab].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Tabs;
