import {
  genericOAuthClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    || process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    || "http://localhost:3000",
  plugins: [genericOAuthClient(), inferAdditionalFields<typeof auth>()],
});
