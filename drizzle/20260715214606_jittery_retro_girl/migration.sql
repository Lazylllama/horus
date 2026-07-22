CREATE TABLE "instances" (
	"instance_name" text PRIMARY KEY,
	"sponsor_user_id" text,
	"nephthys_id" text,
	"jelly_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jelly_hosts" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nephthys_hosts" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL UNIQUE,
	"host" text NOT NULL,
	"slack_channel" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "instances" ADD CONSTRAINT "instances_sponsor_user_id_user_id_fkey" FOREIGN KEY ("sponsor_user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "instances" ADD CONSTRAINT "instances_nephthys_id_nephthys_hosts_id_fkey" FOREIGN KEY ("nephthys_id") REFERENCES "nephthys_hosts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "instances" ADD CONSTRAINT "instances_jelly_id_jelly_hosts_id_fkey" FOREIGN KEY ("jelly_id") REFERENCES "jelly_hosts"("id") ON DELETE CASCADE;