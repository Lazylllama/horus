import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization, user } from "./auth-schema";

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

export const marmalade_data = pgTable("marmalade", {
  instanceId: text("instance_id")
    .primaryKey()
    .references(() => instance.id, { onDelete: "cascade" })
    .unique(),
  mailboxId: text("mailbox_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const marmalade_key = pgTable("marmalade_key", {
  instanceId: text("instance_id")
    .primaryKey()
    .references(() => instance.id, { onDelete: "cascade" })
    .unique(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  apiKey: text("api_key").notNull(),
  version: text("version").default("v1"), // TODO: Move to KMS?
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
