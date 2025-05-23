"use client";
import { MouseEventHandler } from "react";
import { TSetupStep } from "@/types";
import { ArrowLeft } from "../ui/icons";
import cn from "@/utils/cn";

interface SetupProgressProps {
  step: TSetupStep;
  back?: MouseEventHandler<HTMLButtonElement>;
}

const SetupProgress = ({ step, back }: SetupProgressProps) => {
  return (
    <div className="w-full relative flex items-center justify-center py-4.5 border-b-1.5 border-color">
      {back && (
        <button
          type="button"
          className="icon-btn-bg-sm absolute left-2 mt-px"
          onClick={back}
        >
          <ArrowLeft />
        </button>
      )}

      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={`dot-${i}`}
            className={cn("size-2.5 rounded-full", {
              "bg-teal-500": step >= i + 2,
              "bg-zinc-300 dark:bg-zinc-700": step < i + 2,
            })}
          />
        ))}
      </div>
    </div>
  );
};

export default SetupProgress;
