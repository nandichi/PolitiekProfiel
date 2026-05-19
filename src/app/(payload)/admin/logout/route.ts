import configPromise from "@payload-config";
import { NextResponse } from "next/server";

function normalizeSameSite(
  sameSite: boolean | "Lax" | "None" | "Strict" | undefined,
): "lax" | "none" | "strict" | undefined {
  if (sameSite === true) return "strict";
  if (sameSite === false) return undefined;
  return sameSite?.toLowerCase() as "lax" | "none" | "strict" | undefined;
}

export async function GET(request: Request) {
  const config = await configPromise;
  const usersCollection = config.collections.find(
    (collection) => collection.slug === config.admin.user,
  );
  const authCookies = usersCollection?.auth?.cookies;
  const response = NextResponse.redirect(
    new URL(`${config.routes.admin}/login`, request.url),
  );

  response.cookies.set(`${config.cookiePrefix}-token`, "", {
    domain: authCookies?.domain ?? undefined,
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: normalizeSameSite(authCookies?.sameSite),
    secure: authCookies?.secure,
  });

  return response;
}
