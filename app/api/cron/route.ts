import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { GetInstances } from "@/app/actions/instance";
import { db } from "@/db";
import { instance as InstanceSchema } from "@/db/schemas/instance-schema";
import { getStats } from "@/lib/nephthys";

// update instance stats
export async function POST() {
  const headersData = await headers();

  if (
    headersData.get("Upstash-Forward-Cron-Secret") !==
      `Bearer ${process.env.CRON_SECRET}` &&
    headersData.get("Cron-Secret") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  const instances = await GetInstances();
  if ("error" in instances) {
    return new Response(`Failed to fetch instances: ${instances.error}`, {
      status: 500,
    });
  }

  try {
    for (const instance of instances) {
      if (!instance || !instance.instanceId || !instance.nephthysHostname) {
        console.error(
          `Skipping instance due to missing data: ${JSON.stringify(instance?.instanceId)}`,
        );
        continue;
      }

      const stats = await getStats(instance.nephthysHostname);

      if (
        !stats.all_time.tickets_in_progress ||
        !stats.all_time.tickets_open ||
        !stats.all_time.tickets_closed
      ) {
        console.error(`Failed to fetch stats for instance ${instance.name}`);
        continue;
      }

      // the first time i did this i forgot ".where"...
      await db
        .update(InstanceSchema)
        .set({
          openTickets: stats.all_time.tickets_open.toString(),
          inProgressTickets: stats.all_time.tickets_in_progress.toString(),
          resolvedTickets: stats.all_time.tickets_closed.toString(),
        })
        .where(eq(InstanceSchema.id, instance.instanceId));
    }
  } catch (error) {
    console.error("Error updating instance stats:", error);
    return new Response("Failed to update instance stats", { status: 500 });
  }

  return new Response("Instance stats updated successfully", { status: 200 });
}

export async function GET() {
  return new Response("Method not allowed", { status: 405 });
}
