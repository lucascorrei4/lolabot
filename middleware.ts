import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isOriginAllowed } from "./lib/cors";

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  const isApi = req.nextUrl.pathname.startsWith("/api/") || req.nextUrl.pathname === "/api";
  if (!isApi) return NextResponse.next();

  const res = NextResponse.next();
  const allow = isOriginAllowed(origin) ? origin ?? "*" : "";
  if (allow) {
    res.headers.set("Access-Control-Allow-Origin", allow);
    res.headers.set("Vary", "Origin");
  }
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, x-lolabot-signature");

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
