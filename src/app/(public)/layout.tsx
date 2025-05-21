import { LayoutProps } from "@/types";
import { Header, Footer } from "@/components/layout";

const PublicLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PublicLayout;
