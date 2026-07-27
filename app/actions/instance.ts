"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { userIsSuperAdmin } from "@/lib/utils";
import type { ErrorResponse } from "@/types/error";
import type { InstanceApiData, RedisInstanceStats } from "@/types/instances";

export async function GetInstances(
  includePrivateInstances: boolean = false,
): Promise<InstanceApiData[] | ErrorResponse> {
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
  if (redisStatsString && typeof redisStatsString === "object") {
    // hopes and prayers right here
    redisStats = redisStatsString as RedisInstanceStats;
  }

  const transformedData = data.map((instance) => {
    // "temporary"
    if (!instance.organization) {
      console.warn(
        `Instance ${instance.id} is missing organization data, skipping...`,
      );
      return null;
    }
    if (!instance.organization.slug) {
      console.warn(
        `Instance ${instance.id} is missing organization slug, skipping...`,
      );
      return null;
    }
    if (!instance.name) {
      console.warn(`Instance ${instance.id} is missing name, skipping...`);
      return null;
    }
    if (!instance.organizationId) {
      console.warn(
        `Instance ${instance.id} is missing organizationId, skipping...`,
      );
      return null;
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
  return transformedData.filter((v): v is NonNullable<typeof v> => !!v);
}

export async function GetNephthysHostnameFromSlug(
  slug: string,
): Promise<{ host: string; slackChannel: string } | ErrorResponse> {
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
    return {
      error: "SlugNotFound",
      message: `Couldn't find organization, nephthys hostname or instance (${org?.id || slug}) by slug`,
    };
  }

  return {
    host: org.instance.nephthys_host.host,
    slackChannel: org.instance.nephthys_host.slackChannel,
  };
}
