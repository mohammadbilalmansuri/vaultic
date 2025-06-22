import { TIcon } from "@/types";

const Swap: TIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20.5 14.99L15.49 20.01" />
      <path d="M3.5 14.99H20.5" />
      <path d="M3.5 9.00999L8.51 3.98999" />
      <path d="M20.5 9.01001H3.5" />
    </svg>
  );
};

export default Swap;
