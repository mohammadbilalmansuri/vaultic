"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks";
import cn from "@/utils/cn";
import { Loader } from "../ui";
import { ChevronsUpDown, Check } from "../ui/icons";

interface SelectProps<T> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => Promise<void> | void;
  selecting?: boolean;
  variant?: "inline" | "dropdown";
  bg?: "transparent" | "input";
  containerClassName?: string;
}

const Select = <T,>({
  options,
  value,
  onChange,
  selecting = false,
  variant = "dropdown",
  containerClassName = "",
  bg = "transparent",
}: SelectProps<T>) => {
  const [opened, setOpened] = useState(false);
  const outsideClickRef = useOutsideClick(
    () => opened && setOpened(false),
    opened
  );
  const selectedLabel =
    options.find((opt) => opt.value === (value ?? options[0]?.value))?.label ||
    "Invalid Option";

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "relative w-full flex flex-col items-center border-color rounded-2xl transition-all duration-300",
        {
          "hover:border-focus": !opened,
          "border-focus": opened && variant === "dropdown",
          "border-1.5": bg === "transparent",
          "bg-input border": bg === "input",
        },
        containerClassName
      )}
    >
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between gap-8 h-12 pl-4 pr-2 py-3 rounded-2xl border-color",
          opened && variant === "inline" && bg === "transparent"
            ? "border-b-1.5"
            : "border-b"
        )}
        onClick={() => setOpened((prev) => !prev)}
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
              "border-1.5": variant === "dropdown" && bg === "transparent",
              border: variant === "dropdown" && bg === "input",
            })}
          >
            <div
              className={cn(
                "w-full flex flex-col gap-2 p-2 max-h-62 overflow-y-auto scrollbar-thin",
                { "bg-input": variant === "dropdown" && bg === "input" }
              )}
            >
              {options.length === 0 ? (
                <p className="text-sm py-1 text-center">No options available</p>
              ) : (
                options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <button
                      key={String(option.value)}
                      type="button"
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
                          await onChange(option.value);
                          setOpened(false);
                        } catch (error) {
                          console.error("Select onChange failed:", error);
                        }
                      }}
                    >
                      <span>{option.label}</span>
                      {selecting && isSelected ? (
                        <Loader size="xs" />
                      ) : isSelected ? (
                        <Check className="w-5 text-teal-500" />
                      ) : null}
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
