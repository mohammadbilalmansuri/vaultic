type TArgs =
  | string
  | Record<string, boolean>
  | Array<string | Record<string, boolean>>;

const cn = (...args: TArgs[]): string =>
  args
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

export default cn;
