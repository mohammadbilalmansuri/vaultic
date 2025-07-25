"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import cn from "@/utils/cn";
import { useOutsideClick } from "@/hooks";

interface PresetSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: string[];
  placeholder?: string;
  valueSuffix?: string;
  containerClassName?: string;
  gridCols?: number;
}

const PresetSelect = <T extends FieldValues>({
  name,
  control,
  options,
  placeholder = "Select",
  valueSuffix = "",
  containerClassName = "",
  gridCols = 2,
}: PresetSelectProps<T>) => {
  const [opened, setOpened] = useState(false);
  const outsideClickRef = useOutsideClick<HTMLDivElement>(() => {
    if (opened) setOpened(false);
  }, opened);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div
          ref={outsideClickRef}
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
            aria-expanded={opened}
            aria-haspopup="listbox"
            role="preset-select"
            aria-label={placeholder}
          >
            {value ? `${value} ${valueSuffix}` : placeholder}
          </button>

          <AnimatePresence>
            {opened && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full mt-1.5 xs:min-w-32 min-w-26 bg-default border rounded-2xl z-10 overflow-hidden shadow-xl flex flex-col items-center justify-center"
              >
                <div
                  className={cn(
                    "xs:gap-2 gap-1.5 xs:p-2.5 p-2 bg-input",
                    `grid grid-cols-${gridCols}`
                  )}
                >
                  {options.map((option, index) => (
                    <button
                      key={`option-${index}-${option}`}
                      type="button"
                      role="option"
                      aria-selected={value === option}
                      className={cn(
                        "xs:size-12 size-10 flex items-center justify-center border rounded-xl transition duration-200 text-primary",
                        value === option ? "bg-secondary" : "hover:bg-secondary"
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
