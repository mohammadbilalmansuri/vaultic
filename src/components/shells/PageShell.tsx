import { IChildren } from "@/types";
import { Header, Footer } from "../layout";

const PageShell = ({ children }: IChildren) => {
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

export default PageShell;
