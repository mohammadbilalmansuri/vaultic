import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full relative flex flex-col items-center sm:px-5 px-4 min-h-fit">
      <div className="w-full max-w-screen-lg relative sm:py-5 py-4 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
        <p className="sm:text-left text-center">
          &copy;{currentYear} Vaultic. All rights reserved.
        </p>
        <p className="sm:text-right text-center">
          Built by&nbsp;
          <Link
            href="https://www.linkedin.com/in/mohammadbilalmansuri"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mohammad Bilal Mansuri's LinkedIn Profile"
            className="leading-none heading-color transition-all duration-300 border-b border-transparent hover:border-current"
          >
            Mohammad Bilal Mansuri
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
