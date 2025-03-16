"use client";
import { useState, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUserStore } from "@/stores/userStore";
import { Copy } from "../ui";
import { useCopy, useStorage } from "@/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AccountSettings = () => {
  const mnemonic = useUserStore((state) => state.mnemonic);
  const { copyToClipboard, copied } = useCopy();
  const { removeUser } = useStorage();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const onCopy = (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.stopPropagation();
    copyToClipboard(mnemonic);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full border-2 border-color rounded-lg relative p-5 flex flex-col cursor-pointer"
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className="w-full flex items-center justify-between">
        <h2 className="text-2xl heading-color">Account Settings</h2>

        <div className="flex items-center gap-4">
          {expanded && (
            <button
              key="logout"
              className="icon transition-none"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/");

                setTimeout(() => {
                  removeUser();
                }, 200);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
            </button>
          )}

          <button className="icon">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </motion.svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden w-full flex flex-col gap-3"
          >
            <div className="w-full flex items-center justify-between gap-4 mt-6">
              <h3 className="text-xl">Secret Recovery Phrase</h3>
              <Copy copied={copied} withText={true} onClick={onCopy} />
            </div>

            <p
              className="w-full grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 xs:gap-3 gap-2 group"
              onClick={onCopy}
            >
              {mnemonic.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.03 * index,
                    ease: "easeInOut",
                  }}
                  className="bg-zinc-200/60 dark:bg-zinc-800/60 rounded-lg leading-none xs:text-base text-sm p-3"
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AccountSettings;
