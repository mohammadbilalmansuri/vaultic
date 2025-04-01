"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUserStore } from "@/stores/userStore";
import { Input, RHFSelect, Button } from "@/components/ui";
import { useForm, FormProvider } from "react-hook-form";

const Send = () => {
  const [expanded, setExpanded] = useState(false);
  const methods = useForm();

  return (
    <div className="w-full max-w-screen-lg relative flex flex-col items-center flex-1 gap-5 py-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        className="w-full border-2 border-color rounded-xl relative p-5 flex flex-col cursor-pointer"
        onClick={() => {
          if (expanded) return;
          setExpanded(true);
        }}
      >
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl heading-color">Send</h2>

          <button className="icon" onClick={() => setExpanded((prev) => !prev)}>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </motion.svg>
          </button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden w-full relative flex flex-col gap-3"
            >
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit((data) => console.log(data))}
                  className="mt-6 w-full grid grid-cols-2 gap-4"
                >
                  <RHFSelect
                    control={methods.control}
                    name="network-select"
                    options={[
                      { label: "Solana", value: "1" },
                      { label: "Ethereum", value: "2" },
                    ]}
                    placeholder="Select network"
                  />
                  <RHFSelect
                    control={methods.control}
                    name="wallet-select"
                    options={[
                      { label: "Wallet 1", value: "1" },
                      { label: "Wallet 2", value: "2" },
                    ]}
                    placeholder="Select wallet"
                  />

                  <Input placeholder="Enter address" />
                  <div className="w-full flex items-center gap-4">
                    <Input placeholder="Enter amount" className="w-3/4" />
                    <Button type="submit" className="w-1/4">
                      Send
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Send;
