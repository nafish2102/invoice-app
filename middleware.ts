import { NextRequest, NextResponse } from "next/server";

const publicRoutes = new Set(["/login", "/signup"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get("invoice_token")?.value);

  if (publicRoutes.has(pathname)) {
    if (hasToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!hasToken) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
