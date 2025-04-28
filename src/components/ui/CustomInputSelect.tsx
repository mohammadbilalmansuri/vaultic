import { useState } from "react";
import { motion } from "motion/react";
import { Controller, FieldValues, Control } from "react-hook-form";
import { Input } from "@/components/ui";
import { Expand } from "@/components/ui/icons";

interface CustomInputSelectProps {
  name: string;
  control: Control<FieldValues | any>;
  options: Array<{ label: string; value: string }>;
}

const CustomInputSelect = ({
  name,
  control,
  options,
}: CustomInputSelectProps) => {
  const [opened, setOpened] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref, onBlur } }) => (
        <div className="w-full relative flex flex-col items-center">
          <div className="w-full relative flex items-center">
            <Input
              ref={ref}
              placeholder="Enter or select solana address"
              onBlur={() => {
                if (opened) setOpened(false);
              }}
              value={value}
            />
            <Expand
              expanded={opened}
              className="absolute right-2.5 cursor-pointer"
              onClick={() => setOpened((prev) => !prev)}
            />
          </div>

          {opened && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 w-[95%] bg-2 shadow-lg rounded-2xl z-10 overflow-hidden"
            >
              <div className="flex flex-col gap-2 p-3">
                {options.map(({ label, value }) => (
                  <button
                    type="button"
                    key={value}
                    className="flex items-center justify-between gap-4 hover:bg-3 p-2 rounded-xl"
                    onClick={() => {
                      onChange(value);
                      setOpened(false);
                    }}
                  >
                    <span>{label}</span>
                    <span>
                      {value.slice(0, 3) +
                        "..." +
                        (value ? value.slice(-3) : "")}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    />
  );
};

export default CustomInputSelect;
