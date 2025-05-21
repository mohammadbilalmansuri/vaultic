import { LayoutProps } from "@/types";
import { PublicLayout } from "@/components/layout";

const OpenLayout = ({ children }: LayoutProps) => {
  return <PublicLayout>{children}</PublicLayout>;
};

export default OpenLayout;
