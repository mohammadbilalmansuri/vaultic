import { IChildren } from "@/types";
import { PageLayout } from "@/components/layouts";

const OpenLayout = ({ children }: IChildren) => {
  return <PageLayout>{children}</PageLayout>;
};

export default OpenLayout;
