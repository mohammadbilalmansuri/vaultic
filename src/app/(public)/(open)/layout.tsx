import { IChildren } from "@/types";
import { PageShell } from "@/components/shells";

const OpenLayout = ({ children }: IChildren) => {
  return <PageShell>{children}</PageShell>;
};

export default OpenLayout;
