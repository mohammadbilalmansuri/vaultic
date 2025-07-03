"use client";
import { useState, InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TIcon } from "@/types";
import cn from "@/utils/cn";
import { useOutsideClick } from "@/hooks";
import Input from "./Input";
import { AngleDown, Check } from "./icons";

interface ComboboxProps<T extends FieldValues> {
  name: Path<T>;
  placeholder?: string;
  control: Control<T>;
  options: Array<{
    label: string;
    value: string;
    shortValue: string;
    valueIcon?: TIcon;
  }>;
  widthClassName?: string;
  autoFocus?: InputHTMLAttributes<HTMLInputElement>["autoFocus"];
  autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  autoCapitalize?: InputHTMLAttributes<HTMLInputElement>["autoCapitalize"];
  minLength?: number;
  maxLength?: number;
}

const Combobox = <T extends FieldValues>({
  name,
  placeholder = "Enter or select value",
  control,
  options,
  widthClassName = "w-full",
  ...inputProps
}: ComboboxProps<T>) => {
  const [opened, setOpened] = useState(false);
  const outsideClickRef = useOutsideClick(
    () => opened && setOpened(false),
    opened
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <div
          ref={outsideClickRef}
          className={cn(
            "relative min-w-fit flex flex-col items-center",
            widthClassName
          )}
        >
          <div className="w-full relative flex items-center">
            <Input
              ref={ref}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={cn("pr-12", { "border-focus": opened })}
              role="combobox"
              aria-expanded={opened}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              {...inputProps}
            />
            {options.length > 0 && (
              <button
                type="button"
                className="icon-btn-bg-sm absolute right-2"
                onClick={() => setOpened((prev) => !prev)}
                aria-label="Toggle options"
                tabIndex={-1}
              >
                <AngleDown
                  className={cn("transition-transform duration-300", {
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
                className="absolute top-full mt-1.5 w-[98%] bg-default border border-color rounded-2xl z-10 overflow-hidden shadow-xl"
              >
                <div className="flex flex-col gap-2 p-2.5 bg-input">
                  {options.map((option) => {
                    const isSelected = value === option.value;
                    const ValueIcon = option.valueIcon;

                    return (
                      <button
                        key={String(option.value)}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-colors duration-300",
                          isSelected ? "bg-primary" : "hover:bg-primary"
                        )}
                        onClick={() => {
                          onChange(isSelected ? "" : option.value);
                          setOpened(false);
                        }}
                      >
                        <span
                          className={cn("flex items-center gap-2", {
                            "heading-color": isSelected,
                          })}
                        >
                          <span>{option.label}</span>
                          {isSelected && (
                            <Check className="w-5 text-teal-500" />
                          )}
                        </span>
                        <span className="flex items-center gap-2 leading-none">
                          {ValueIcon && (
                            <ValueIcon className="w-3" aria-hidden="true" />
                          )}
                          <span className="mt-px">{option.shortValue}</span>
                        </span>
                      </button>
                    );
                  })}
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
