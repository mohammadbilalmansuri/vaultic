import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Controller } from "react-hook-form";
import cn from "@/utils/cn";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div
      className={cn(
        "relative w-full min-w-40 bg-zinc-200/60 dark:bg-zinc-800/60 focus:bg-zinc-200 dark:focus:bg-zinc-800 rounded-lg cursor-pointer px-4 py-3 h-13 flex items-center justify-between",
        className
      )}
      onClick={() => setIsOpen((prev) => !prev)}
      ref={selectRef}
    >
      <span>{selectedOption ? selectedOption.label : placeholder}</span>

      <button className="fill-zinc-600 dark:fill-zinc-400 hover:fill-zinc-900 dark:hover:fill-zinc-100 transition-all duration-200">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="size-4"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
            className="absolute top-full left-0 w-full mt-2 flex flex-col gap-2 border-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 z-10 px-4 py-3"
          >
            {options.map((option) => (
              <span
                key={option.value}
                className={cn("", value === option.value ? "" : "")}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const RHFSelect = ({ control, name, options, placeholder }: any) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          options={options}
          value={field.value}
          onChange={field.onChange}
          placeholder={placeholder}
        />
      )}
    />
  );
};
