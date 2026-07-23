import { upstashCache } from "drizzle-orm/cache/upstash";
import { drizzle } from "drizzle-orm/neon-http";
import { relations } from "./schemas/relations";

// TODO: get t3env or something omg
export const db = drizzle(process.env.DATABASE_URL || "", {
  cache: upstashCache({
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    url: process.env.UPSTASH_REDIS_REST_URL || "",
  }),
  relations,
});
