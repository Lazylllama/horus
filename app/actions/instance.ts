"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { userIsSuperAdmin } from "@/lib/utils";

export type InstanceData = {
  instanceId: string;
  organizationId: string;
  name: string;
  resolvedTickets: number;
  openTickets: number;
  inProgressTickets: number;
  slug: string;
  imageUrl: string | null;
  slackChannel: string | null;
  nephthysHostname: string | null;
};

export async function GetInstances(
  includePrivateInstances: boolean = false,
): Promise<InstanceData[] | { error: string }> {
  // Only allow super admin to view private instances
  if (includePrivateInstances) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { error: "Unauthorized" };
    if (!userIsSuperAdmin(session.user.id)) return { error: "Forbidden" };
  }

  const data = await db.query.instance.findMany({
    with: {
      organization: true,
      nephthys_host: true,
    },
  });

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
      resolvedTickets: parseInt(instance.resolvedTickets || "0", 10),
      openTickets: parseInt(instance.openTickets || "0", 10),
      inProgressTickets: parseInt(instance.inProgressTickets || "0", 10),
      slug: instance.organization.slug,
      imageUrl: instance.organization?.logo || null,
      slackChannel: instance.nephthys_host?.slackChannel || null,
      nephthysHostname: instance.nephthys_host?.host || null,
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
