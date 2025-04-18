"use client";
import { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RecoveryPhrase,
  ChangePassword,
  NetworkSettings,
  RemoveAccount,
} from "@/components/account";
import cn from "@/utils/cn";

const TABS = new Map<string, JSX.Element>([
  ["Recovery Phrase", <RecoveryPhrase />],
  ["Change Password", <ChangePassword />],
  ["Network Settings", <NetworkSettings />],
  ["Remove Account", <RemoveAccount />],
]);

export default function AccountPage() {
  const [tab, setTab] = useState("Recovery Phrase");

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col flex-1 gap-3 py-5">
      <div className="w-full flex flex-col">
        <div className="w-full relative flex gap-3 p-3 border-2 border-color rounded-2xl overflow-hidden">
          {Array.from(TABS.keys(), (tabName, index) => (
            <button
              key={index}
              className={cn(
                "font-medium w-full px-5 py-4 leading-none rounded-xl transition-all duration-300 bg-zinc-200/60 dark:bg-zinc-800/50 active:scale-95 border-t-2",
                {
                  "heading-color border-zinc-400 dark:border-zinc-600":
                    tab === tabName,
                  "border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800":
                    tab !== tabName,
                }
              )}
              onClick={() => setTab(tabName)}
            >
              {tabName}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <div className="w-full relative flex flex-col pt-9 pb-5 px-5 overflow-hidden border-t-0 border-2 border-color rounded-b-2xl -mt-4">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {TABS.get(tab)}
            </motion.div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
