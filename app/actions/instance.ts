"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { userIsSuperAdmin } from "@/lib/utils";
import type { InstanceApiData, RedisInstanceStats } from "@/types/instances";

export async function GetInstances(
  includePrivateInstances: boolean = false,
): Promise<InstanceApiData[] | { error: string }> {
  // Only allow super admin to view private instances
  if (includePrivateInstances) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { error: "Unauthorized" };
    if (!userIsSuperAdmin(session.user.role)) return { error: "Forbidden" };
  }

  const data = await db.query.instance.findMany({
    with: {
      organization: true,
      nephthys_host: true,
    },
  });

  let redisStats: RedisInstanceStats = {};
  const redisStatsString = await redis.get("instanceStats");
  console.log("Redis stats string:", redisStatsString);
  if (redisStatsString && typeof redisStatsString === "object") {
    // hopes and prayers right here
    redisStats = redisStatsString as RedisInstanceStats;
  }

  return data.map((instance) => {
    if (
      !instance.organizationId ||
      !instance.name ||
      !instance.organization?.slug
    ) {
      throw new Error("Instance data is incomplete", {
        cause: instance.id,
      });
    }

    return {
      instanceId: instance.id,
      organizationId: instance.organizationId,
      name: instance.name,
      resolvedTickets: redisStats[instance.id]?.resolvedTickets || 0,
      openTickets: redisStats[instance.id]?.openTickets || 0,
      inProgressTickets: redisStats[instance.id]?.inProgressTickets || 0,
      slug: instance.organization.slug,
      imageUrl: instance.organization?.logo || null,
      slackChannel: instance.nephthys_host?.slackChannel || null,
      nephthysHostname: instance.nephthys_host?.host || null,
      deprecated: instance.deprecated || false,
    };
  });
}

export async function GetMyInstances() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };
}

export async function GetNephthysHostnameFromSlug(slug: string) {
  const org = await db.query.organization.findFirst({
    where: { slug: slug.toLocaleLowerCase() },
    with: {
      instance: {
        with: {
          nephthys_host: true,
        },
      },
    },
  });

  if (!org || !org.instance || !org.instance.nephthys_host) {
    throw new Error("Couldn't find organization by slug", {
      cause: org?.id || slug,
    });
  }

  return {
    host: org.instance.nephthys_host.host,
    slackChannel: org.instance.nephthys_host.slackChannel,
  };
}
