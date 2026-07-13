"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { user_preferences } from "@/db/schemas/auth-schema";
import { auth } from "@/lib/auth";
import { GetNephthysNameFromHost } from "@/lib/nephthys";

export async function updatePreferences(input: {
  defaultHost?: string;
  isOptedOutTracking?: boolean;
}) {
  console.log(input);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  if (input.defaultHost && !GetNephthysNameFromHost(input.defaultHost))
    return { error: "Invalid default host" };

  await db
    .insert(user_preferences)
    .values({
      userId: session.user.id,
      ...input,
    })
    .onConflictDoUpdate({
      target: user_preferences.userId,
      set: input,
    });

  return { success: true };
}
