import { NextRequest, NextResponse } from "next/server";

/**
 * Coarse, edge-level route gate. This runs before any page renders (both
 * full loads and client-side navigations go through it in the App Router),
 * using the small `lsp_session` / `lsp_role` cookies set by
 * src/lib/token-storage.ts alongside the real tokens in localStorage.
 *
 * This is a UX optimization (skip rendering the wrong shell, redirect
 * fast), NOT the security boundary — those cookies are plain, readable,
 * unsigned values set by client JS, so a determined user could edit them.
 * That doesn't matter: every actual API call still goes through the
 * backend's own authenticate + authorize middleware with the real JWT, so
 * a forged cookie only gets someone to a page shell with no real data
 * (every query will 401/403 and the RoleGuard component will bounce them).
 */

const ROLE_PREFIXES: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/operator": ["ADMIN", "OPERATOR"],
  "/consumer": ["ADMIN", "OPERATOR", "CONSUMER"],
  "/profile": ["ADMIN", "OPERATOR", "CONSUMER"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedPrefix = Object.keys(ROLE_PREFIXES).find((prefix) => pathname.startsWith(prefix));
  if (!matchedPrefix) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.get("lsp_session")?.value === "1";
  const role = request.cookies.get("lsp_role")?.value;

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedRoles = ROLE_PREFIXES[matchedPrefix];
  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/operator/:path*", "/consumer/:path*", "/profile/:path*"],
};
