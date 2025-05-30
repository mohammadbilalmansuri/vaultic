import { SVGProps } from "react";

const Ethereum = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115 182" {...props}>
      <path
        fill="#F0CDC2"
        stroke="#1616B4"
        strokeLinejoin="round"
        d="M57.505 181v-45.16L1.641 103.171z"
      />
      <path
        fill="#C9B3F5"
        stroke="#1616B4"
        strokeLinejoin="round"
        d="M57.69 181v-45.16l55.865-32.669z"
      />
      <path
        fill="#88AAF1"
        stroke="#1616B4"
        strokeLinejoin="round"
        d="M57.506 124.615V66.979L1 92.28z"
      />
      <path
        fill="#C9B3F5"
        stroke="#1616B4"
        strokeLinejoin="round"
        d="M57.69 124.615V66.979l56.506 25.302z"
      />
      <path
        fill="#F0CDC2"
        stroke="#1616B4"
        strokeLinejoin="round"
        d="M1 92.281 57.505 1v65.979z"
      />
      <path
        fill="#B8FAF6"
        stroke="#1616B4"
        strokeLinejoin="round"
        d="M114.196 92.281 57.691 1v65.979z"
      />
    </svg>
  );
};

export default Ethereum;
