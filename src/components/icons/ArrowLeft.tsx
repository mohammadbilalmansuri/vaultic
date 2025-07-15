import type { Icon } from "@/types";

const ArrowLeft: Icon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.57 5.92993L3.5 11.9999L9.57 18.0699" />
      <path d="M20.5 12H3.67004" />
    </svg>
  );
};

export default ArrowLeft;
