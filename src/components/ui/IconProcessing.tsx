import { IChildren } from "@/types";

const IconProcessing = ({ children }: IChildren) => {
  return (
    <div
      className="relative flex items-center justify-center"
      role="status"
      aria-label="Processing"
    >
      <div className="rounded-full size-20 border-3 border-t-teal-500 animate-spin" />
      <div className="absolute">{children}</div>
    </div>
  );
};

export default IconProcessing;
