import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full relative flex flex-col items-center px-5 min-h-fit">
      <div className="w-full max-w-screen-lg relative py-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p>&copy;{new Date().getFullYear()} Vaultic. All rights reserved.</p>
        <p>
          Designed & developed by{" "}
          <Link
            href="https://www.linkedin.com/in/mohammadbilalmansuri"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mohammad Bilal Mansuri's LinkedIn Profile"
            className="heading-color leading-none border-b border-transparent hover:border-current transition-colors duration-300"
          >
            Mohammad Bilal Mansuri
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
