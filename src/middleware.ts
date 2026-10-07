import { NextRequest, NextResponse } from "next/server";



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
