import { SVGProps } from "react";

const Logo = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="6 5 20 22" {...props}>
      <path
        fillOpacity=".6"
        fillRule="nonzero"
        d="M18.215 7.508l7.777 4.068-7.493 4.593-.284-8.661zm-4.43 16.941l-7.777-4.068 7.493-4.594.284 8.662z"
      />
      <path
        fillRule="nonzero"
        d="M25.992 20.679L15.179 27v-8.869l10.813-6.555v9.103zm-19.984-9.4L16.821 5v8.834L6.008 20.381v-9.103z"
      />
    </svg>
  );
};

export default Logo;
