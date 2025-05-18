"use client";
import { MouseEventHandler } from "react";
import { ArrowLeft } from "@/components/ui/icons";
import { TSetupPath, TSetupStep } from "@/types";
import cn from "@/utils/cn";

interface SetupProgressProps {
  step: TSetupStep;
  path: TSetupPath;
  back?: MouseEventHandler<HTMLButtonElement>;
}

const SetupProgress = ({ step, path, back }: SetupProgressProps) => {
  const totalSteps = path === "create" ? 4 : 3;

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
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepIndex = i + 2;
          return (
            <span
              key={`dot-${stepIndex}`}
              className={cn("size-2.5 rounded-full", {
                "bg-teal-500": step >= stepIndex,
                "bg-zinc-300 dark:bg-zinc-700": step < stepIndex,
              })}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SetupProgress;
