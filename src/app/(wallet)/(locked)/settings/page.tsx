"use client";
import { JSX, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RecoveryPhrase,
  ChangePassword,
  TestnetMode,
  RemoveAccount,
} from "@/components/settings";
import cn from "@/utils/cn";
import { fadeUpAnimation } from "@/utils/animations";

const TABS = new Map<string, JSX.Element>([
  ["Recovery Phrase", <RecoveryPhrase />],
  ["Change Password", <ChangePassword />],
  ["Testnet Mode", <TestnetMode />],
  ["Remove Account", <RemoveAccount />],
]);

const SettingsPage = () => {
  const [tab, setTab] = useState<string>("Recovery Phrase");

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col flex-1 py-5">
      <div className="w-full relative flex flex-col gap-5 border-2 border-color p-5 rounded-3xl">
        <motion.div
          className="w-full relative grid grid-cols-4 bg-primary rounded-2xl p-1 h-14"
          {...fadeUpAnimation()}
        >
          <motion.div
            className="absolute bg-secondary rounded-xl h-[calc(100%-8px)] top-1"
            style={{
              left: `calc(${Array.from(TABS.keys()).indexOf(tab)} * 25% + 4px)`,
              width: "calc(25% - 8px)",
            }}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          {Array.from(TABS.keys(), (tabName, index) => (
            <button
              key={index}
              className={cn(
                "font-medium px-5 leading-none transition-all duration-300 relative z-10",
                {
                  "heading-color": tab === tabName,
                  "hover:heading-color": tab !== tabName,
                }
              )}
              onClick={() => setTab(tabName)}
            >
              {tabName}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="w-full relative flex flex-col items-center p-3"
            {...fadeUpAnimation({ delay: 0.1 })}
          >
            {TABS.get(tab)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SettingsPage;
