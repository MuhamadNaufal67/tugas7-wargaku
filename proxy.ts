import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/ajukan-surat", "/status"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true";
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/status", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ajukan-surat/:path*", "/login", "/status/:path*"],
};
