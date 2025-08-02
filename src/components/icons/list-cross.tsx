import type { Icon } from "@/types";

const ListCross: Icon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M20 6L3 6" />
      <path d="M11 11L3 11" />
      <path d="M11 16H3" />
      <path d="M15 16L20 11M20 16L15 11" strokeLinejoin="round" />
    </svg>
  );
};

export default ListCross;
