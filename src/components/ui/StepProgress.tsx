"use client";
import { MouseEventHandler } from "react";
import cn from "@/utils/cn";
import { ArrowLeft } from "../ui/icons";

interface StepProgressProps {
  dots: number;
  activeDot: number;
  back?: MouseEventHandler<HTMLButtonElement>;
}

const StepProgress = ({ dots, activeDot, back }: StepProgressProps) => {
  if (dots < 1 || activeDot < 1 || activeDot > dots) {
    console.warn("Invalid StepProgress props:", { dots, activeDot });
    return null;
  }

  return (
    <div className="w-[calc(100%+3px)] -mt-[1.5px] relative flex items-center justify-center py-5 border-1.5 rounded-3xl border-color">
      {back && (
        <button
          type="button"
          className="icon-btn-bg-sm absolute left-2"
          onClick={back}
        >
          <ArrowLeft />
        </button>
      )}

      <div className="flex items-center gap-2">
        {Array.from({ length: dots }, (_, i) => {
          const index = i + 1;
          return (
            <span
              key={`dot-${index}`}
              className={cn("size-2.5 rounded-full", {
                "bg-teal-500": activeDot >= index,
                "bg-zinc-300 dark:bg-zinc-700": activeDot < index,
              })}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
