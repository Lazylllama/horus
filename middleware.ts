import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Request headers:", {
    "x-forwarded-for": req.headers.get("x-forwarded-for"),
    "x-real-ip": req.headers.get("x-real-ip"),
    "cf-connecting-ip": req.headers.get("cf-connecting-ip"),
    "user-agent": req.headers.get("user-agent"),
    Rest: req.headers,
  });
}

export const config = {
  matcher: "/:path*",
};
