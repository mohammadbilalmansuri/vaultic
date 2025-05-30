import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full relative flex flex-col items-center px-5 min-h-fit">
      <div className="w-full max-w-screen-lg relative py-5 flex justify-between items-center gap-4">
        <p>&copy;{new Date().getFullYear()} Vaultic</p>
        <p>
          Designed and Developed by{" "}
          <Link
            href="https://www.linkedin.com/in/mohammadbilalmansuri"
            target="_blank"
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
