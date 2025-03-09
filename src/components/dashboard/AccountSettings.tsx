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
  const [expanded, setExpanded] = useState(true);
  const { copyToClipboard, copied } = useCopy();
  const { removeUser } = useStorage();
  const router = useRouter();

  const onCopy = (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.stopPropagation();
    copyToClipboard(mnemonic);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full border-2 border-color rounded-lg relative p-6 flex flex-col cursor-pointer"
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className="w-full flex items-center justify-between">
        <h2 className="text-2xl heading-color">Account Settings</h2>

        <div className="flex items-center gap-4">
          {expanded && (
            <>
              <Link
                href="reset-password"
                className="icon transition-none"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                  className="size-5"
                >
                  <path d="M42,23H10c-2.2,0-4,1.8-4,4v19c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V27C46,24.8,44.2,23,42,23z M31,44.5 c-1.5,1-3.2,1.5-5,1.5c-0.6,0-1.2-0.1-1.8-0.2c-2.4-0.5-4.4-1.8-5.7-3.8l3.3-2.2c0.7,1.1,1.9,1.9,3.2,2.1c1.3,0.3,2.6,0,3.8-0.8 c2.3-1.5,2.9-4.7,1.4-6.9c-0.7-1.1-1.9-1.9-3.2-2.1c-1.3-0.3-2.6,0-3.8,0.8c-0.3,0.2-0.5,0.4-0.7,0.6L26,37h-9v-9l2.6,2.6 c0.4-0.4,0.9-0.8,1.3-1.1c2-1.3,4.4-1.8,6.8-1.4c2.4,0.5,4.4,1.8,5.7,3.8C36.2,36.1,35.1,41.7,31,44.5z" />
                  <path d="M10,18.1v0.4C10,18.4,10,18.3,10,18.1C10,18.1,10,18.1,10,18.1z" />
                  <path d="M11,19h4c0.6,0,1-0.3,1-0.9V18c0-5.7,4.9-10.4,10.7-10C32,8.4,36,13,36,18.4v-0.3c0,0.6,0.4,0.9,1,0.9h4 c0.6,0,1-0.3,1-0.9V18c0-9.1-7.6-16.4-16.8-16c-8.5,0.4-15,7.6-15.2,16.1C10.1,18.6,10.5,19,11,19z" />
                </svg>
              </Link>

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="size-5"
                >
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                </svg>
              </button>
            </>
          )}

          <button className="icon">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="size-5"
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
              className="w-full flex items-center gap-3 bg-zinc-200/60 dark:bg-zinc-800/60 p-4 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all duration-200 word-spacing-2"
              onClick={onCopy}
            >
              {mnemonic}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AccountSettings;
