ALTER TABLE "instances" RENAME TO "instance";--> statement-breakpoint
ALTER TABLE "jelly_hosts" RENAME TO "jelly_host";--> statement-breakpoint
ALTER TABLE "nephthys_hosts" RENAME TO "nephthys_host";--> statement-breakpoint
ALTER TABLE "instance" DROP CONSTRAINT "instances_nephthys_id_nephthys_hosts_id_fkey";--> statement-breakpoint
ALTER TABLE "instance" DROP CONSTRAINT "instances_jelly_id_jelly_hosts_id_fkey";--> statement-breakpoint
ALTER TABLE "instance" RENAME COLUMN "instance_name" TO "id";--> statement-breakpoint
ALTER TABLE "jelly_host" RENAME COLUMN "id" TO "instance_id";--> statement-breakpoint
ALTER TABLE "instance" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "nephthys_host" ADD COLUMN "instance_id" text;--> statement-breakpoint
ALTER TABLE "nephthys_host" RENAME CONSTRAINT "nephthys_hosts_pkey" TO "nephthys_host_pkey";--> statement-breakpoint
ALTER TABLE "instance" DROP COLUMN "nephthys_id";--> statement-breakpoint
ALTER TABLE "instance" DROP COLUMN "jelly_id";--> statement-breakpoint
ALTER TABLE "jelly_host" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "nephthys_host" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "nephthys_host" ADD PRIMARY KEY ("instance_id");--> statement-breakpoint
ALTER TABLE "jelly_host" ADD CONSTRAINT "jelly_host_instance_id_key" UNIQUE("instance_id");--> statement-breakpoint
ALTER TABLE "nephthys_host" ADD CONSTRAINT "nephthys_host_instance_id_key" UNIQUE("instance_id");--> statement-breakpoint
ALTER TABLE "jelly_host" ADD CONSTRAINT "jelly_host_instance_id_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "instance"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "nephthys_host" ADD CONSTRAINT "nephthys_host_instance_id_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "instance"("id") ON DELETE CASCADE;