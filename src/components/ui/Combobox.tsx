"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Controller, Control, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui";
import { AngleDown } from "@/components/ui/icons";
import { useOutsideClick } from "@/hooks";
import cn from "@/utils/cn";

interface ComboboxProps {
  name: string;
  placeholder?: string;
  control: Control<FieldValues | any>;
  options: Array<{ label: string; value: string }>;
}

const Combobox = ({
  name,
  placeholder = "Enter or select value",
  control,
  options,
}: ComboboxProps) => {
  const [opened, setOpened] = useState(false);
  const containerRef = useOutsideClick(() => setOpened(false), opened);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <div
          ref={containerRef}
          className="w-full relative flex flex-col items-center"
        >
          <div className="w-full relative flex items-center">
            <Input
              ref={ref}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="pr-12"
            />
            {options.length > 0 && (
              <button
                type="button"
                className="hover-icon size-9 flex items-center justify-center rounded-xl hover:bg-secondary absolute right-2"
                onClick={() => setOpened((prev) => !prev)}
              >
                <AngleDown
                  className={cn("w-5.5 transition-all duration-300", {
                    "rotate-180": opened,
                  })}
                />
              </button>
            )}
          </div>

          <AnimatePresence>
            {opened && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute top-14 w-[98%] bg-default border-1.5 border-color rounded-2xl z-10 overflow-hidden"
              >
                <div className="flex flex-col gap-2 p-2">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="w-full flex items-center justify-between gap-4 hover:bg-primary px-3 py-2 rounded-xl transition-colors duration-300"
                      onClick={() => {
                        onChange(option.value);
                        setOpened(false);
                      }}
                    >
                      <span>{option.label}</span>
                      <span>
                        {option.value.slice(0, 4)}...{option.value.slice(-4)}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    />
  );
};

export default Combobox;
