ALTER TABLE "marmalade_key" DROP CONSTRAINT IF EXISTS "marmalade_key_instance_id_key";--> statement-breakpoint
ALTER TABLE "marmalade_key" ADD COLUMN "key_id" text;--> statement-breakpoint
ALTER TABLE "marmalade_key" DROP CONSTRAINT "marmalade_key_pkey";--> statement-breakpoint
ALTER TABLE "marmalade_key" ADD PRIMARY KEY ("key_id");--> statement-breakpoint
ALTER TABLE "marmalade_key" ALTER COLUMN "instance_id" DROP NOT NULL;