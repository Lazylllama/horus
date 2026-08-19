import {
  adminClient,
  customSessionClient,
  genericOAuthClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

console.log("USING BASEURL:", process.env.NEXT_PUBLIC_BETTER_AUTH_URL);
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    genericOAuthClient(),
    organizationClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    customSessionClient<typeof auth>(),
  ],
});
