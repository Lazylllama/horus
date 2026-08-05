"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCachetUser } from "@/lib/cachet";
import type { CachetUser } from "@/types/cachet";

export async function getCachetUsers(
  ids: (string | undefined)[],
): Promise<CachetUser[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const users = await Promise.all(
    ids
      .filter((id): id is string => !!id)
      .map(async (id) => {
        const user = await getCachetUser(id);
        if (!user) throw new Error(`User with ID ${id} not found`);
        return user;
      }),
  );

  return users;
}
