import { headers } from "next/headers";
import { GetInstances } from "@/app/actions/instance";
import { getStats } from "@/lib/nephthys";
import { redis } from "@/lib/redis";
import type { RedisInstanceStats } from "@/types/instances";

/**
  test command:
  curl -X POST http://localhost:3000/api/cron -H "cron-secret: TEST_CRON_SECRET"
 */

// update instance stats
export async function POST() {
  const headersData = await headers();

  if (!process.env.CRON_SECRET) {
    return new Response("CRON isnt setup", { status: 500 });
  }

  if (headersData.get("cron-secret") !== `${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const instances = await GetInstances();
  if ("error" in instances) {
    return new Response(`Failed to fetch instances: ${instances.error}`, {
      status: 500,
    });
  }

  const instanceStats: RedisInstanceStats = {};

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
        typeof stats.all_time.tickets_in_progress !== "number" ||
        typeof stats.all_time.tickets_open !== "number" ||
        typeof stats.all_time.tickets_closed !== "number"
      ) {
        console.error(
          `Failed to fetch stats for instance ${instance.name}, data: ${JSON.stringify(stats)}`,
        );
        continue;
      }

      // why did i use postgres for this bradar
      instanceStats[instance.instanceId] = {
        openTickets: stats.all_time.tickets_open,
        inProgressTickets: stats.all_time.tickets_in_progress,
        resolvedTickets: stats.all_time.tickets_closed,
      };
    }
  } catch (error) {
    console.error("Error fetching instance stats:", error);
    return new Response("Failed to fetch instance stats", { status: 500 });
  }

  try {
    await redis.set("instanceStats", JSON.stringify(instanceStats)); // no expiration, cuz we want this to persist until the next cron job runs
  } catch (error) {
    console.error("Error saving instance stats to Redis:", error);
    return new Response("Failed to save instance stats to Redis", {
      status: 500,
    });
  }

  return new Response("Instance stats updated successfully", { status: 200 });
}

export async function GET() {
  return new Response("Method not allowed", { status: 405 });
}
