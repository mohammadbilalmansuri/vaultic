import cn from "@/utils/cn";

interface LoaderProps {
  size?: "xs" | "sm" | "md" | "lg";
  color?: "teal" | "white" | "black" | "zinc";
}

const Loader = ({ size = "lg", color = "teal" }: LoaderProps) => {
  return (
    <div
      className={cn(
        "rounded-full border-t-3 border-r-3 border-r-transparent animate-spin",
        {
          "size-4": size === "xs",
          "size-6": size === "sm",
          "size-8": size === "md",
          "size-10": size === "lg",
          "border-t-teal-500": color === "teal",
          "border-t-zinc-200": color === "white",
          "border-t-zinc-800": color === "black",
          "border-t-zinc-800 dark:border-t-zinc-200": color === "zinc",
        }
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Loader;
