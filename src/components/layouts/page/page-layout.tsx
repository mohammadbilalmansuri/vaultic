import type { Children } from "@/types";
import Header from "./header";
import Footer from "./footer";

const PageLayout = ({ children }: Children) => {
  return (
    <>
      <Header />
      <main className="page-main" role="main" aria-label="Page Main Content">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default PageLayout;
