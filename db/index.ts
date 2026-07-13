import { drizzle } from "drizzle-orm/neon-http";
import { relations } from "./schemas/auth-schema";

export const db = drizzle(process.env.DATABASE_URL || "", { relations });
