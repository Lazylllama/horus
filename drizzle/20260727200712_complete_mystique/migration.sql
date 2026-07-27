CREATE TABLE "marmalade" (
	"instance_id" text PRIMARY KEY UNIQUE,
	"mailbox_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marmalade_key" (
	"instance_id" text PRIMARY KEY UNIQUE,
	"mailbox_id" text NOT NULL,
	"api_key" text NOT NULL,
	"version" text DEFAULT 'v1',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "jelly_host";--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "role" SET DEFAULT 'helper';--> statement-breakpoint
ALTER TABLE "marmalade" ADD CONSTRAINT "marmalade_instance_id_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "instance"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "marmalade_key" ADD CONSTRAINT "marmalade_key_instance_id_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "instance"("id") ON DELETE CASCADE;