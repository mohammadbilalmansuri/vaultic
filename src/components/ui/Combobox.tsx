"use client";
import { useState, InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Controller, Control, FieldValues } from "react-hook-form";
import { useOutsideClick } from "@/hooks";
import Input from "./Input";
import { AngleDown, Check } from "./icons";
import getShortAddress from "@/utils/getShortAddress";
import cn from "@/utils/cn";

interface ComboboxProps {
  name: string;
  placeholder?: string;
  control: Control<FieldValues | any>;
  options: Array<{ label: string; value: string }>;
  autoFocus?: InputHTMLAttributes<HTMLInputElement>["autoFocus"];
  autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  autoCapitalize?: InputHTMLAttributes<HTMLInputElement>["autoCapitalize"];
  containerClassName?: string;
}

const Combobox = ({
  name,
  placeholder = "Enter or select value",
  control,
  options,
  autoFocus,
  autoComplete,
  autoCapitalize,
  containerClassName = "",
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
          className={cn(
            "w-full relative flex flex-col items-center",
            containerClassName
          )}
        >
          <div className="w-full relative flex items-center">
            <Input
              ref={ref}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={cn("pr-12", { "border-focus": opened })}
              autoFocus={autoFocus}
              autoComplete={autoComplete}
              autoCapitalize={autoCapitalize}
            />
            {options.length > 0 && (
              <button
                type="button"
                className="icon-btn-bg-sm absolute right-2"
                onClick={() => setOpened((prev) => !prev)}
              >
                <AngleDown
                  className={cn("transition-all duration-300", {
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
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full mt-1 w-[98%] bg-default border border-color rounded-2xl z-10 overflow-hidden"
              >
                <div className="w-full flex flex-col gap-2 p-2 bg-input">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="w-full flex items-center justify-between gap-3 hover:bg-primary px-3 py-2 rounded-xl transition-colors duration-300"
                      onClick={() => {
                        onChange(value === option.value ? "" : option.value);
                        setOpened(false);
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {option.label}
                        {value === option.value && <Check className="w-5" />}
                      </span>
                      <span>{getShortAddress(option.value)}</span>
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
