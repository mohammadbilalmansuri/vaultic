import { LayoutProps } from "@/types";
import Header from "./Header";
import Footer from "./Footer";

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
