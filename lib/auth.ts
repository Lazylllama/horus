import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schemas/auth-schema";

const CACHET_HOST = process.env.CACHET_HOST || "https://cachet.hackclub.com";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  user: {
    additionalFields: {
      slack_id: {
        required: true,
        type: "string",
        unique: true,
      },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "hack-club",
          clientId: process.env.HACK_CLUB_AUTH_CLIENT || "",
          clientSecret: process.env.HACK_CLUB_AUTH_SECRET || "",
          discoveryUrl:
            "https://auth.hackclub.com/.well-known/openid-configuration",
          scopes: ["slack_id", "email", "openid"],
          getUserInfo: async (tokens) => {
            const authResponse = await fetch(
              "https://auth.hackclub.com/api/v1/me",
              {
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              },
            );

            if (!authResponse.ok) {
              console.error(
                "Failed to fetch user info:",
                authResponse.statusText,
              );
              return null;
            }

            var userInfo = await authResponse.json();
            userInfo = userInfo.identity || userInfo;

            const cachetResponse = await fetch(
              `${CACHET_HOST}/users/${userInfo.slack_id}`,
            );

            if (!cachetResponse.ok) {
              console.error(
                "Failed to fetch Cachet user info:",
                cachetResponse.statusText,
              );
              return null;
            }

            const cachetData = await cachetResponse.json();

            return {
              id: userInfo.id,
              email: userInfo.primary_email,
              emailVerified: true,
              name:
                cachetData.displayName || userInfo.primary_email.split("@")[0],
              slack_id: userInfo.slack_id,
              image: cachetData.imageUrl,
            };
          },
        },
      ],
    }),
  ],
});
