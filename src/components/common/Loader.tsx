"use client";
import cn from "@/utils/cn";

interface LoaderProps {
  size?: "xs" | "sm" | "md" | "lg";
  color?: "teal" | "zinc" | "black";
}

const Loader = ({ size = "lg", color = "teal" }: LoaderProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("animate-spin duration-300", {
        "w-4 h-4": size === "xs",
        "w-6 h-6": size === "sm",
        "w-8 h-8": size === "md",
        "w-10 h-10": size === "lg",
        "fill-zinc-600 dark:fill-zinc-400": color === "zinc",
        "fill-teal-500": color === "teal",
        "fill-zinc-800": color === "black",
      })}
    >
      <path
        opacity="0.25"
        fillRule="evenodd"
        d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      />
      <path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z" />
      <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" />
    </svg>
  );
};

export default Loader;
