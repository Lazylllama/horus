"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { instance as instanceTable } from "@/db/schemas/instance-schema";
import { auth } from "@/lib/auth";

export async function createInstance(input: {
  name: string;
  slug: string;
  sponsorId: string;
}) {
  // TODO: add winston logdrain stuff
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  if (session.user.id !== process.env.NEXT_PUBLIC_SUPER_ADMIN_ID) {
    return { error: "Forbidden" };
  }

  const data = await auth.api.createOrganization({
    body: {
      name: input.name,
      slug: input.slug,
      userId: input.sponsorId,
      // TODO: logo: input.logo
      keepCurrentActiveOrganization: false,
    },
  });

  if (!data || !data.id) {
    return { error: "Failed to create organization" };
  }

  const instance = await db.insert(instanceTable).values({
    id: crypto.randomUUID(),
    name: input.name,
    organizationId: data.id,
  });

  if (!instance) {
    return { error: "Failed to insert instance after organization creation." };
  }

  return data;
}
