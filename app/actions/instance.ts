"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { auth } from "@/lib/auth";

export type InstanceData = {
  instanceId: string;
  organizationId: string;
  name: string;
  // createdAt: Date;
  // updatedAt: Date;
  slug: string;
  imageStandalone: boolean;
  imageUrl: string | null;
  slackChannel: string | null;
  nephthysHostname: string | null;
};

export async function GetInstances(
  includePrivateInstances: boolean = false,
): Promise<InstanceData[] | { error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  // Only allow super admin to view private instances
  if (
    includePrivateInstances &&
    session.user.id !== process.env.NEXT_PUBLIC_SUPER_ADMIN_ID
  ) {
    return { error: "Forbidden" };
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
      // createdAt: instance.createdAt,
      // updatedAt: instance.updatedAt,
      slug: instance.organization.slug,
      imageStandalone: false, // TODO: implement in instance shema
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

  return org.instance?.nephthys_host.host;
}
