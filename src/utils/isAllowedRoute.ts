import { RouteState } from "@/types";
import { ROUTES } from "@/constants";

const isAllowedRoute = (state: RouteState, pathname: string): boolean => {
  const allowedPaths = ROUTES.get(state);
  return allowedPaths?.has(pathname) ?? false;
};

export default isAllowedRoute;
