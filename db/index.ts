import { drizzle } from "drizzle-orm/neon-http";
import { relations } from "./schemas/relations";

export const db = drizzle(process.env.DATABASE_URL || "", { relations });
