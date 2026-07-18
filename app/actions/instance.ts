"use server";

import { db } from "@/db";

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
