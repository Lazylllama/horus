ALTER TABLE "jelly_host" ADD COLUMN "jelly_api_key" text;--> statement-breakpoint
ALTER TABLE "jelly_host" ADD COLUMN "version" text DEFAULT 'v1';