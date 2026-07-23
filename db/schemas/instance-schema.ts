import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "./auth-schema";

export const instance = pgTable("instance", {
  id: text("id").primaryKey(),
  name: text("name"),
  organizationId: text("organization_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  deprecated: boolean("deprecated").default(false),
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
  jellyApiKey: text("jelly_api_key"),
  version: text("version").default("v1"), // TODO: Move to KMS?
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
