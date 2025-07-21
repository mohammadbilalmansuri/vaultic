import cn from "@/utils/cn";

interface LoaderProps {
  size?: "xs" | "sm" | "md" | "lg";
  color?: "teal" | "zinc" | "current";
}

const Loader = ({ size = "lg", color = "teal" }: LoaderProps) => {
  return (
    <div
      className={cn(
        "rounded-full border-r-transparent animate-spin",
        size === "xs" ? "border-t-2 border-r-2" : "border-t-3 border-r-3",
        {
          "size-4": size === "xs",
          "size-5.5": size === "sm",
          "size-8": size === "md",
          "size-10": size === "lg",
          "border-t-teal-500": color === "teal",
          "border-t-zinc-800 dark:border-t-zinc-200": color === "zinc",
          "border-t-current": color === "current",
        }
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Loader;
