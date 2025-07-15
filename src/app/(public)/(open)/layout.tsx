import type { Children } from "@/types";
import { PageLayout } from "@/components/layouts";

const OpenLayout = ({ children }: Children) => {
  return <PageLayout>{children}</PageLayout>;
};

export default OpenLayout;
