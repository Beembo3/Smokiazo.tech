import { NextResponse } from "next/server";

export function middleware(request: any) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get("2go.session") !== undefined;

  // Redirect unauthenticated users from home to login
  if (pathname === "/" && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect admin and manage pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/manage")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}