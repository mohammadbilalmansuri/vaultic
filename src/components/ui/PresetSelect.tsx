"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Controller, Control, FieldValues } from "react-hook-form";
import { useOutsideClick } from "@/hooks";
import cn from "@/utils/cn";

interface PresetSelectProps {
  name: string;
  control: Control<FieldValues | any>;
  options: string[];
  placeholder?: string;
  valueSuffix?: string;
  containerClassName?: string;
}

const PresetSelect = ({
  name,
  control,
  options,
  placeholder = "Select",
  valueSuffix,
  containerClassName = "",
}: PresetSelectProps) => {
  const [opened, setOpened] = useState(false);
  const containerRef = useOutsideClick(() => {
    if (opened) setOpened(false);
  }, opened);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div
          ref={containerRef}
          className={cn(
            "relative flex flex-col items-center",
            containerClassName
          )}
        >
          <button
            type="button"
            className={cn("input justify-center leading-none text-nowrap", {
              "text-zinc-500": !value,
            })}
            onClick={() => setOpened((prev) => !prev)}
          >
            {value ? `${value} ${valueSuffix || ""}` : placeholder}
          </button>

          <AnimatePresence>
            {opened && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full mt-1.5 min-w-32 bg-default border border-color rounded-2xl z-10 overflow-hidden shadow-xl"
              >
                <div className="grid grid-cols-2 gap-2 p-3 bg-input">
                  {options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={cn(
                        "w-full flex items-center justify-center border border-color p-2 rounded-xl transition duration-300",
                        {
                          "bg-primary": value === option,
                          "hover:bg-primary": value !== option,
                        }
                      )}
                      onClick={() => {
                        onChange(value === option ? "" : option);
                        setOpened(false);
                      }}
                    >
                      {option}
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

export default PresetSelect;
