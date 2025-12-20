import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifySession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  // Only run on /admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  const session = token ? await verifySession(token) : null;

  // If no session, redirect to login
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    // Optionally preserve return URL?
    return NextResponse.redirect(loginUrl);
  }

  // Handle specific admin paths
  const pathname = request.nextUrl.pathname;

  // Root /admin -> Portal
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/portal", request.url));
  }

  // Super Admin
  if (pathname.startsWith("/admin/super")) {
    if (session.role !== "super_admin") {
      return NextResponse.redirect(new URL("/admin/portal", request.url));
    }
    return NextResponse.next();
  }

  // Bot Admin Paths: /admin/[botId]
  // Extract botId from /admin/botId/something...
  const parts = pathname.split("/");
  // parts = ["", "admin", "botId", ...]
  if (parts.length >= 3) {
    const botId = parts[2];
    // Skip "portal" as it's not a botId
    if (botId === "portal") return NextResponse.next();

    // Check access
    const isSuper = session.role === "super_admin";
    const hasAccess = session.allowedBotIds?.includes(botId);

    if (!isSuper && !hasAccess) {
      // Unauthorized for this bot
      return NextResponse.redirect(new URL("/admin/portal", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths starting with /admin
     */
    "/admin/:path*",
  ],
};
