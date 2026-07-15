import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const instance = pgTable("instance", {
  id: text("id").primaryKey(),
  name: text("name"),
  sponsorUserId: text("sponsor_user_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const nephthys_host = pgTable("nephthys_host", {
  instanceId: text("instance_id")
    .primaryKey()
    .references(() => instance.id, { onDelete: "cascade" })
    .unique(),
  name: text("name").unique().notNull(),
  host: text("host").notNull(),
  slackChannel: text("slack_channel").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const jelly_host = pgTable("jelly_host", {
  instanceId: text("instance_id")
    .primaryKey()
    .references(() => instance.id, { onDelete: "cascade" })
    .unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
