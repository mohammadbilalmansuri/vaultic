"use client";
import cn from "@/utils/cn";
import { ArrowLeft } from "../icons";

interface StepProgressProps {
  dots: number;
  activeDot: number;
  back?: () => void;
}

const StepProgress = ({ dots, activeDot, back }: StepProgressProps) => {
  if (dots < 1 || activeDot < 1 || activeDot > dots) {
    console.warn("Invalid StepProgress props:", { dots, activeDot });
    return null;
  }

  return (
    <div className="w-full relative flex items-center justify-center py-4.5 border-b-1.5">
      {back && (
        <button
          type="button"
          className="icon-btn-bg-sm absolute left-2 mt-px"
          onClick={back}
          aria-label="Go back to previous step"
        >
          <ArrowLeft />
        </button>
      )}

      <div
        className="flex items-center gap-2"
        role="progressbar"
        aria-valuenow={activeDot}
        aria-valuemin={1}
        aria-valuemax={dots}
        aria-label={`Step ${activeDot} of ${dots}`}
      >
        {Array.from({ length: dots }, (_, i) => {
          const index = i + 1;
          const isActive = activeDot >= index;
          return (
            <span
              key={`dot-${index}`}
              className={cn(
                "size-2.5 rounded-full",
                isActive ? "bg-teal-500" : "bg-zinc-300 dark:bg-zinc-700"
              )}
              aria-label={`Step ${index}${isActive ? " completed" : ""}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
