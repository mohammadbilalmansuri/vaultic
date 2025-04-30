import { ROUTES } from "@/constants";
import { TRouteCategory } from "@/types";

const getRouteCategory = (pathname: string): TRouteCategory => {
  for (const [category, paths] of ROUTES.entries()) {
    if (paths.has(pathname)) return category;
  }
  return null;
};

export default getRouteCategory;
