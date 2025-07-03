"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TSelectStyle, TSelectVariant } from "@/types";
import { useOutsideClick } from "@/hooks";
import cn from "@/utils/cn";
import { Loader } from "../ui";
import { ChevronsUpDown, Check } from "../ui/icons";

interface SelectProps<T> {
  options: Array<{
    label: string;
    value: T;
  }>;
  value: T;
  onChange: (value: T) => Promise<void> | void;
  selecting?: boolean;
  variant?: TSelectVariant;
  style?: TSelectStyle;
  widthClassName?: string;
}

const Select = <T,>({
  options,
  value,
  onChange,
  selecting = false,
  variant = "dropdown",
  style = "default",
  widthClassName = "w-full",
}: SelectProps<T>) => {
  const [opened, setOpened] = useState(false);
  const outsideClickRef = useOutsideClick(
    () => opened && setOpened(false),
    opened
  );

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || "Invalid Option";

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "relative shrink-0 flex flex-col items-center border-color rounded-2xl transition-all duration-300",
        {
          "hover:border-focus": !opened,
          "border-focus": opened && variant === "dropdown",
          "border-1.5": style === "default",
          "bg-input border": style === "input",
        },
        widthClassName
      )}
    >
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between gap-8 h-13 pl-4 pr-2 py-3 border-color",
          {
            "border-b-1.5":
              opened && variant === "inline" && style === "default",
            "border-b": opened && variant === "inline" && style === "input",
          }
        )}
        onClick={() => setOpened((prev) => !prev)}
        aria-expanded={opened}
        aria-haspopup="listbox"
        role="select"
        aria-label="Select option"
      >
        <span className="heading-color font-medium">{selectedLabel}</span>
        <span className={cn("icon-btn-bg-sm", { "heading-color": opened })}>
          <ChevronsUpDown />
        </span>
      </button>

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn("overflow-hidden", {
              "w-full": variant === "inline",
              "w-[98%] absolute top-full mt-1 rounded-2xl z-10 shadow-xl":
                variant === "dropdown",
              "bg-default border-color": variant === "dropdown",
              "border-1.5": variant === "dropdown" && style === "default",
              border: variant === "dropdown" && style === "input",
            })}
          >
            <div
              className={cn(
                "w-full flex flex-col gap-2 p-2.5 max-h-64 overflow-y-auto scrollbar-thin",
                { "bg-input": variant === "dropdown" && style === "input" }
              )}
            >
              {options.length === 0 ? (
                <p className="text-sm py-1 text-center" role="status">
                  No options available
                </p>
              ) : (
                options.map((option) => {
                  const isSelected = value === option.value;

                  const statusIcon =
                    selecting && isSelected ? (
                      <Loader size="xs" />
                    ) : isSelected ? (
                      <Check className="w-5 text-teal-500" />
                    ) : null;

                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={isSelected || selecting}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-all duration-300",
                        {
                          "bg-primary heading-color cursor-default pointer-events-none":
                            isSelected,
                          "hover:bg-primary hover:heading-color": !isSelected,
                        }
                      )}
                      onClick={async () => {
                        try {
                          if (selecting || isSelected) return;
                          await onChange(option.value);
                          setOpened(false);
                        } catch {}
                      }}
                    >
                      <span>{option.label}</span>
                      {statusIcon}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;
