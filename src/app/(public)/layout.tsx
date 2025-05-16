import { Header, Footer } from "@/components/layout";
import { LayoutProps } from "@/types";

const PublicLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
