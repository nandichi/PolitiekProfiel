export interface PublicMotionPolicy {
  lenis: boolean;
  gsap: boolean;
}

export const PUBLIC_MOTION_BLOCKER_SELECTOR =
  'form, dialog[open], [role="dialog"]';

const LENIS_EXACT_ROUTES = new Set([
  "/",
  "/citaten",
  "/disclaimer",
  "/herroepingsrecht",
  "/ideologieen",
  "/kabinetten",
  "/landen",
  "/methodiek",
  "/partijen",
  "/politici",
  "/privacy",
  "/stellingen",
  "/voorwaarden",
  "/verkennen",
  "/woordenboek",
  "/docs/api",
]);

const LENIS_ROUTE_PREFIXES = [
  "/ideologie/",
  "/kabinetten/",
  "/land/",
  "/partij/",
  "/politici/",
  "/stelling/",
  "/woordenboek/",
] as const;

const GSAP_EXACT_ROUTES = new Set(["/", "/methodiek"]);

function hasCheckoutState(search: string): boolean {
  return new URLSearchParams(search).has("checkout");
}

export function getPublicMotionPolicy(
  pathname: string,
  search: string,
): PublicMotionPolicy {
  if (hasCheckoutState(search)) {
    return { lenis: false, gsap: false };
  }

  const lenis =
    LENIS_EXACT_ROUTES.has(pathname) ||
    LENIS_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  return {
    lenis,
    gsap: GSAP_EXACT_ROUTES.has(pathname),
  };
}
