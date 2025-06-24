/**
 * Conditionally joins CSS class names into a single string.
 * Supports strings, objects with boolean values, and nested arrays.
 * @param args - Class names as strings, objects, or arrays
 * @returns Single space-separated class name string
 */
const cn = (
  ...args: (
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>
  )[]
): string => {
  return args
    .flat(Infinity)
    .flatMap((item) =>
      typeof item === "object" && !Array.isArray(item)
        ? Object.entries(item)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
        : item
    )
    .filter(Boolean)
    .join(" ");
};

export default cn;
