import { IChildren } from "@/types";
import Header from "./Header";
import Footer from "./Footer";

const PageLayout = ({ children }: IChildren) => {
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
