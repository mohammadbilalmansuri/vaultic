/**
 * Utility function to conditionally join class names.
 * Supports:
 *  - Strings
 *  - Objects (where keys are class names, and values are booleans)
 *  - Arrays of the above
 *
 * @example
 * cn("base", { active: true, hidden: false }, ["extra", { disabled: true }])
 * => "base active extra disabled"
 */
type TArgs =
  | string
  | Record<string, boolean>
  | Array<string | Record<string, boolean>>;

const cn = (...args: TArgs[]): string => {
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
