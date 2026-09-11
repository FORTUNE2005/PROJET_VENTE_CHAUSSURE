import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100;
const RATE_WINDOW = 60 * 1000;

function getRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const { pathname } = url;
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  if (pathname.startsWith("/api/")) {
    const rateResult = getRateLimit(ip);
    if (!rateResult.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer dans une minute." },
        { status: 429 }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", String(rateResult.remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
