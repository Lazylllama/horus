import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth"; // path to your auth file
export const { POST, GET } = toNextJsHandler(auth);

export async function middleware(req: Request) {
  console.log("Request headers:", {
    "x-forwarded-for": req.headers.get("x-forwarded-for"),
    "x-real-ip": req.headers.get("x-real-ip"),
    "cf-connecting-ip": req.headers.get("cf-connecting-ip"),
    "user-agent": req.headers.get("user-agent"),
    Rest: req.headers,
  });
  return undefined;
}
