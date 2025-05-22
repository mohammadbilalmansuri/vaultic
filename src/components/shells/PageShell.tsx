import { IChildren } from "@/types";
import { Header, Footer } from "@/components/layout";

const PageShell = ({ children }: IChildren) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PageShell;
