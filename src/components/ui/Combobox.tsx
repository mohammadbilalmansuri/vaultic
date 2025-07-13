"use client";
import { useState, InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TIcon } from "@/types";
import cn from "@/utils/cn";
import { useOutsideClick } from "@/hooks";
import { AngleDown, Check } from "../icons";
import Input from "./Input";

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
  containerClassName?: string;
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
  containerClassName = "w-full",
  ...inputProps
}: ComboboxProps<T>) => {
  const [opened, setOpened] = useState(false);
  const outsideClickRef = useOutsideClick<HTMLDivElement>(() => {
    if (opened) setOpened(false);
  }, opened);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <div
          ref={outsideClickRef}
          className={cn(
            "relative flex flex-col items-center",
            containerClassName
          )}
        >
          <div className="w-full relative flex items-center">
            <Input
              ref={ref}
              name={`${name}-combobox-input`}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={cn("sm:pr-12 pr-10", { "border-focus": opened })}
              role="combobox"
              aria-expanded={opened}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              {...inputProps}
            />
            {options.length > 0 && (
              <button
                type="button"
                className="icon-btn-bg-sm absolute sm:right-2 right-1.5"
                onClick={() => setOpened((prev) => !prev)}
                aria-label="Toggle options"
                tabIndex={-1}
              >
                <AngleDown
                  className={cn("transition-transform duration-200", {
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
                className="absolute top-full mt-1.5 w-[98%] bg-default border rounded-2xl z-10 overflow-hidden shadow-xl"
              >
                <div className="flex flex-col gap-2 xs:p-2.5 p-2 bg-input">
                  {options.map((option, index) => {
                    const isSelected = value === option.value;
                    const ValueIcon = option.valueIcon;

                    return (
                      <button
                        key={`option-${index}-${option.value}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        className={cn(
                          "w-full flex items-center justify-between xs:gap-3 gap-2 xs:px-3 px-2 xs:py-2 py-1.5 rounded-xl transition-colors duration-200",
                          isSelected ? "bg-secondary" : "hover:bg-secondary"
                        )}
                        onClick={() => {
                          onChange(isSelected ? "" : option.value);
                          setOpened(false);
                        }}
                      >
                        <span
                          className={cn("flex items-center xs:gap-2 gap-1", {
                            "heading-color": isSelected,
                          })}
                        >
                          <span className="xs:text-base text-sm">
                            {option.label}
                          </span>
                          {isSelected && (
                            <Check className="xs:w-5 w-4 text-teal-500" />
                          )}
                        </span>
                        <span className="flex items-center xs:gap-2 gap-1 leading-none">
                          {ValueIcon && (
                            <ValueIcon className="w-3" aria-hidden="true" />
                          )}
                          <span className="xs:text-base text-sm">
                            {option.shortValue}
                          </span>
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
