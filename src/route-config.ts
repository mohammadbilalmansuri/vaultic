export type RouteCategory =
  | "authProtected" // only logged-in + password verified
  | "guestOnly" // only visible to logged-out users
  | "semiProtected" // visible to all, but password required if logged in
  | "public"; // fully open, no checks

export const ROUTES = new Map<RouteCategory, Set<string>>([
  [
    "authProtected",
    new Set(["/dashboard", "/wallets", "/history", "/account"]),
  ],
  ["guestOnly", new Set(["/onboarding", "/forgot-password"])],
  ["semiProtected", new Set(["/faucet", "/faucet/solana"])],
  ["public", new Set(["/", "/help-and-support"])],
]);

export function getRouteCategory(pathname: string): RouteCategory | null {
  for (const [category, paths] of ROUTES.entries()) {
    if (paths.has(pathname)) return category;
  }
  return null;
}
