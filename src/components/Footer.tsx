import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full relative flex flex-col items-center px-4 min-h-fit">
      <div className="w-full max-w-screen-lg relative py-4 flex justify-between items-center border-t border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 text-zinc-500">
        <p>&copy;2025 All Rights Reserved.</p>
        <p>
          Designed and Developed by{" "}
          <Link
            href="https://www.linkedin.com/in/mohammadbilalmansuri"
            target="_blank"
            className="dark:text-zinc-100 text-zinc-900 hover:underline"
          >
            Mohammad Bilal Mansuri
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
