export type TArg =
  | string
  | Record<string, boolean>
  | Array<string | Record<string, boolean>>;

const cn = (...args: TArg[]): string =>
  args
    .flat(Infinity)
    .filter(Boolean)
    .flatMap((item) =>
      typeof item === "object" && !Array.isArray(item)
        ? Object.keys(item).filter((key) => item[key as keyof typeof item])
        : item
    )
    .join(" ");

export default cn;
