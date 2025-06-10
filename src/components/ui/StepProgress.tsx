"use client";
import cn from "@/utils/cn";
import { ArrowLeft } from "../ui/icons";

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
