import type { Children } from "@/types";
import Header from "./Header";
import Footer from "./Footer";

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
