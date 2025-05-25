import { IChildren } from "@/types";
import { Header, Footer } from "../layout";

const PageShell = ({ children }: IChildren) => {
  return (
    <>
      <Header />
      <main className="page-main">{children}</main>
      <Footer />
    </>
  );
};

export default PageShell;
