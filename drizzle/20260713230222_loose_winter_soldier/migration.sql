ALTER TABLE "user_preferences" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "user_preferences" ADD PRIMARY KEY ("user_id");