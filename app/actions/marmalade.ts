//* hmmmmmm
"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { marmalade_key } from "@/db/schemas/instance-schema";
import { auth } from "@/lib/auth";
import { decrypt, encrypt } from "@/lib/encryption";
import { getMailboxes } from "@/lib/marmalade";
import type { ErrorResponse } from "@/types/error";
import type { Mailbox } from "@/types/marmalade";

async function getMarmaladeApiKey(): Promise<ErrorResponse | (string | null)> {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey || typeof encryptionKey !== "string")
    return {
      error: "EncryptionKeyMissing",
    };

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const keys = await db.query.marmalade_key.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (!keys) return null;

  return decrypt(keys.apiKey) || null;
}

export async function setMarmaladeApiKey(
  instanceId: string,
  apiKey: string,
): Promise<ErrorResponse | { success: true }> {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey || typeof encryptionKey !== "string")
    return {
      error: "EncryptionKeyMissing",
    };

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const encryptedApiKey = encrypt(apiKey);
  if (!encryptedApiKey) {
    return {
      error: "EncryptionFailed",
    };
  }

  await db
    .insert(marmalade_key)
    .values({
      keyId: crypto.randomUUID(),
      instanceId,
      userId: session.user.id,
      apiKey: encryptedApiKey,
      version: "v1",
    })
    .onConflictDoUpdate({
      target: [marmalade_key.userId, marmalade_key.instanceId],
      set: { apiKey: encryptedApiKey },
    });

  return { success: true };
}

export async function getMarmaladeMailboxes(): Promise<
  ErrorResponse | Mailbox[]
> {
  const apiKey = await getMarmaladeApiKey();

  if (!apiKey)
    return {
      error: "NotFound",
    };

  if (typeof apiKey === "object" && "error" in apiKey) {
    return apiKey;
  }

  const response = await getMailboxes(apiKey);

  if (!response) {
    return {
      error: "NotFound",
    };
  }

  return response;
}
