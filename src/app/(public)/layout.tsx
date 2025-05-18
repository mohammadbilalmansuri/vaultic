import { Header, Footer } from "@/components/layout";
import { LayoutProps } from "@/types";

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
